// 다른 GAS 파일이 함께 쓰는 작은 함수 다섯 개입니다. 이름 끝의 _는 편집기 실행 목록에서 숨기는 표시입니다.

// 탭의 모든 값에서 첫 행(머리글)을 뺀 행 배열을 돌려줍니다.
function readRecordRows_(sheet) {
  return sheet.getDataRange().getValues().slice(1);
}

// 기록의 수량 합을 돌려줍니다. 빈 배열이면 0입니다.
function sumQuantities_(records) {
  return records.reduce(function (sum, record) { return sum + record.quantity; }, 0);
}

// 발생 시각을 UTC 정시로 내린 ISO 글자를 키로, 그 시간의 수량 합을 값으로 모읍니다.
function groupHourly_(records) {
  var hours = {};
  records.forEach(function (record) {
    var hour = new Date(record.occurredAt);
    hour.setUTCMinutes(0, 0, 0);
    var key = hour.toISOString();
    hours[key] = (hours[key] || 0) + record.quantity;
  });
  return hours;
}

// 마지막 기록이 at보다 minutes분 넘게 이전이면 true입니다.
function isDelayed_(latest, at, minutes) {
  return Boolean(latest) && Date.parse(at) - Date.parse(latest.occurredAt) > minutes * 60000;
}

// 사건 하나를 알림 한 줄로 만듭니다.
function alertMessage_(incident) {
  return incident.title + " 담당자: " + incident.owner + " / 할 일: " + incident.action;
}
