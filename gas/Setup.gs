function createTrainingSpreadsheet() {
  var file = SpreadsheetApp.create("텀블공장 개인 실습 " + new Date().toISOString());
  file.setSpreadsheetTimeZone("Asia/Seoul");
  var production = file.getSheets()[0].setName(TUMBLE_SHEETS.production);
  var shipment = file.insertSheet(TUMBLE_SHEETS.shipment);
  var settingsSheet = file.insertSheet(TUMBLE_SHEETS.settings);
  var alertsSheet = file.insertSheet(TUMBLE_SHEETS.alerts);
  properties_().setProperty("SPREADSHEET_ID", file.getId());

  var now = Date.now();
  var midnight = Date.parse(TumbleCore.day(new Date(now).toISOString()) + "T00:00:00+09:00");

  [[production, "P-seed-", 20], [shipment, "S-seed-", 15]].forEach(function (seed) {
    var sheet = seed[0];
    sheet.appendRow(TUMBLE_HEADERS);
    for (var i = 0; i < 5; i++) {
      var happened = midnight + Math.floor((now - midnight) * (i + 1) / 5);
      var gap = Math.min(2000, Math.floor((now - happened) / 2));
      var row = [
        seed[1] + i,
        seed[2],
        new Date(happened).toISOString(),
        new Date(happened + gap).toISOString(),
        new Date(Math.min(now, happened + gap * 2)).toISOString(),
        "완료"
      ];
      sheet.appendRow(toRow_(row));
      sheet.getRange(sheet.getLastRow(), 1).setNote(JSON.stringify(row));
    }
  });

  var settings = {
    factory_target: 120,
    warehouse_target: 100,
    delay_minutes: 30,
    cooldown_minutes: 10,
    factory_paused: false,
    warehouse_paused: false
  };
  settingsSheet.appendRow(["설정 이름", "값"]);
  Object.keys(settings).forEach(function (key) {
    settingsSheet.appendRow([key, settings[key]]);
  });
  settingsSheet.getRange("A1").setNote(JSON.stringify([{ at: new Date(midnight).toISOString(), revision: 1, settings: settings }]));
  alertsSheet.appendRow(["시각", "사건 ID", "내용", "발송 상태", "상세"]);

  [production, shipment, settingsSheet, alertsSheet].forEach(function (sheet) {
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, sheet.getLastColumn());
  });

  properties_().setProperty("TUMBLE_META", JSON.stringify({ sessionId: Utilities.getUuid(), revision: 1, changedAt: new Date(now).toISOString() }));
  var url = file.getUrl();
  Logger.log("새 실습 시트: " + url);
  return url;
}