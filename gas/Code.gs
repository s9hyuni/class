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
