var TUMBLE_SHEETS = { production: "생산 기록", shipment: "출고 기록", settings: "설정", alerts: "알림 기록" };
var TUMBLE_HEADERS = ["기록 ID", "수량", "발생 시각", "접수 시각", "처리 시각", "처리 상태"];
var KEEP_AS_TEXT_ = /^[0-9=+\-@]/;

function properties_() {
  return PropertiesService.getScriptProperties();
}

function spreadsheet_() {
  var id = properties_().getProperty("SPREADSHEET_ID");
  if (!id) throw Error("먼저 createTrainingSpreadsheet를 실행해 주세요.");
  return SpreadsheetApp.openById(id);
}

function toCell_(value) {
  return typeof value === "string" && KEEP_AS_TEXT_.test(value) ? "'" + value : value;
}

function toRow_(row) {
  return row.map(toCell_);
}

function fromCell_(value) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value.charAt(0) === "'" && KEEP_AS_TEXT_.test(value.slice(1))) {
    return value.slice(1);
  }
  return value;
}

function rows_(name) {
  return readRecordRows_(spreadsheet_().getSheetByName(name)).map(function (row) {
    return row.map(fromCell_);
  });
}

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

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function alerts_() {
  return rows_(TUMBLE_SHEETS.alerts)
    .filter(function (row) { return row[0] !== "" && row[0] !== null && row[0] !== undefined; })
    .map(function (row) { return { at: TumbleCore.iso(row[0]), status: row[3], message: row[2] }; });
}

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
      var cells = row.slice(0, 6);
      var note = notes[index] ? notes[index][0] : "";
      if (!note) {
        var fresh = cells.slice();
        fresh[3] = "";
        fresh[4] = "";
        return fresh;
      }
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
    return json_({ error: error.message });
  }
}