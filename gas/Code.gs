// 시트를 열고 읽는 공통 도구입니다. 다른 파일에서 이 이름으로 부릅니다.
var TUMBLE_SHEETS = { production: "생산 기록", shipment: "출고 기록", settings: "설정", alerts: "알림 기록" };
var TUMBLE_HEADERS = ["기록 ID", "수량", "발생 시각", "접수 시각", "처리 시각", "처리 상태"];

// 한 번 연 시트 파일을 { id, file }로 기억해 같은 ID면 다시 열지 않습니다.
var opened_ = null;

// Sheets가 날짜·숫자·수식으로 바꾸지 않게 글자로 남길 값의 첫 글자입니다.
var KEEP_AS_TEXT_ = /^[0-9=+\-@]/;

function properties_() {
  return PropertiesService.getScriptProperties();
}

function spreadsheet_() {
  var id = properties_().getProperty("SPREADSHEET_ID");
  if (!id) throw Error("먼저 createTrainingSpreadsheet를 실행해 주세요.");
  if (!opened_ || opened_.id !== id) {
    opened_ = { id: id, file: SpreadsheetApp.openById(id) };
  }
  return opened_.file;
}

// 시트에 쓸 값: 숫자로 시작하는 글자 등은 앞에 '를 붙여 글자 그대로 남깁니다.
function toCell_(value) {
  return typeof value === "string" && KEEP_AS_TEXT_.test(value) ? "'" + value : value;
}

// 시트에서 읽은 값: Date는 ISO 글자로, toCell_이 붙인 '는 뗍니다.
function fromCell_(value) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value.charAt(0) === "'" && KEEP_AS_TEXT_.test(value.slice(1))) {
    return value.slice(1);
  }
  return value;
}

function toRow_(row) {
  return row.map(toCell_);
}

// 이름이 name인 탭의 머리글을 뺀 행들을 칸 값을 바꿔 돌려줍니다.
function rows_(name) {
  return readRecordRows_(spreadsheet_().getSheetByName(name)).map(function (row) {
    return row.map(fromCell_);
  });
}

// 설정 탭을 읽어 검사하고 형을 맞춘 설정 객체를 돌려줍니다.
function settings_() {
  var settings = {};
  rows_(TUMBLE_SHEETS.settings).forEach(function (row) {
    settings[row[0]] = row[1];
  });
  ["factory_target", "warehouse_target"].forEach(function (key) {
    var value = settings[key];
    if (value === "" || value === null || value === undefined) {
      settings[key] = null;
      return;
    }
    var target = Number(value);
    if (!Number.isSafeInteger(target) || target < 1) throw Error("목표는 양의 정수 또는 빈칸입니다.");
    settings[key] = target;
  });
  ["delay_minutes", "cooldown_minutes"].forEach(function (key) {
    var minutes = Number(settings[key]);
    if (!isFinite(minutes) || minutes < 1 || minutes > 1440) throw Error("대기 기준은 1~1440분입니다.");
    settings[key] = minutes;
  });
  ["factory_paused", "warehouse_paused"].forEach(function (key) {
    var value = settings[key];
    if ([true, false, "TRUE", "FALSE"].indexOf(value) < 0) throw Error("처리 정지는 TRUE 또는 FALSE입니다.");
    settings[key] = value === true || value === "TRUE";
  });
  return settings;
}

function meta_() {
  var text = properties_().getProperty("TUMBLE_META");
  if (!text) throw Error("초기 자료가 없습니다.");
  return JSON.parse(text);
}

// 웹 앱 응답: 값을 JSON 글자로 그대로 보냅니다(봉투로 감싸지 않습니다).
function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

// 기록 탭과 설정 이력을 읽어 기준 시각의 기록·입력 오류·설정·메타를 돌려줍니다.
function readData_(at, kinds) {
  var now = new Date().toISOString();
  var cutoff = TumbleCore.view(at, now);
  var meta = meta_();
  var records = [];
  var errors = [];
  (kinds || ["production", "shipment"]).forEach(function (kind) {
    var name = TUMBLE_SHEETS[kind];
    var rows = rows_(name);
    var notes = spreadsheet_().getSheetByName(name).getDataRange().getNotes().slice(1);
    var chosen = rows.map(function (row, index) {
      // 앞 여섯 칸(A~F열)만 기록으로 씁니다. G열 이후는 읽지도 비교하지도 않습니다.
      var cells = row.slice(0, 6);
      var note = notes[index] ? notes[index][0] : "";
      if (!note) {
        // 메모가 없으면 아직 접수하지 않은 기록입니다.
        var fresh = cells.slice();
        fresh[3] = "";
        fresh[4] = "";
        return fresh;
      }
      // 메모가 있으면 접수한 원본을 쓰고, 시트에서 고친 칸이 있으면 알립니다.
      var original = JSON.parse(note);
      var changed = cells.some(function (cell, i) { return String(cell) !== String(original[i]); });
      if (changed) {
        errors.push({ sheet: name, row: index + 2, message: "접수한 기록의 수정은 반영하지 않습니다. 새 실습 시트를 만들어 주세요." });
      }
      return original;
    });
    var parsed = TumbleCore.parse(chosen, kind, now);
    records = records.concat(parsed.records);
    parsed.errors.forEach(function (error) {
      errors.push({ sheet: name, row: error.row, message: error.message });
    });
  });
  var history = JSON.parse(spreadsheet_().getSheetByName(TUMBLE_SHEETS.settings).getRange("A1").getNote() || "[]");
  var entry = null;
  history.forEach(function (item) {
    if (Date.parse(item.at) <= Date.parse(cutoff)) entry = item;
  });
  if (!entry) throw Error("이 시점의 설정 자료가 없습니다.");
  return {
    now: now,
    at: cutoff,
    records: records,
    errors: errors,
    settings: entry.settings,
    meta: { sessionId: meta.sessionId, revision: entry.revision, changedAt: entry.at }
  };
}

// 알림 기록 탭에서 첫 칸(시각)이 있는 행만 { at, status, message }로 돌려줍니다.
function alerts_() {
  return rows_(TUMBLE_SHEETS.alerts)
    .filter(function (row) { return row[0] !== "" && row[0] !== null && row[0] !== undefined; })
    .map(function (row) { return { at: TumbleCore.iso(row[0]), status: row[3], message: row[2] }; });
}

// 웹 앱 진입점입니다. 화면은 경로를 ?path=/api/v1/snapshot처럼 path 매개변수로 넘깁니다.
function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var path = (params.path === undefined || params.path === null ? "" : String(params.path)).replace(/^\/+|\/+$/g, "");
    var at = params.at;
    if (path === "api/v1/snapshot") {
      var data = readData_(at);
      return json_(TumbleCore.snapshot(data.records, data.settings, data.meta, alerts_(), at, data.now, at ? [] : data.errors));
    }
    if (path === "api/v1/records") {
      var kind = params.kind;
      if (kind !== "production" && kind !== "shipment") throw Error("생산 또는 출고 기록을 선택해 주세요.");
      var picked = readData_(at, [kind]);
      return json_({ sessionId: picked.meta.sessionId, viewTime: picked.at, records: TumbleCore.recordsAt(picked.records, kind, picked.at, params.from, params.to) });
    }
    throw Error("웹 앱 주소 뒤에 ?path=/api/v1/snapshot 또는 ?path=/api/v1/records를 붙여 주세요.");
  } catch (error) {
    // 웹 앱은 상태 코드를 정할 수 없어 오류도 200으로 { error }를 보냅니다.
    return json_({ error: error.message });
  }
}
