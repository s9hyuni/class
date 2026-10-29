// Google 서비스를 쓰지 않는 계산 함수 모음입니다. 시각 검사, 한국 날짜, 기준 시각, 기록 읽기와 고르기를 맡습니다.
var TumbleCore = (function () {
  var KST_OFFSET_MS = 9 * 60 * 60 * 1000;

  // 시간대를 포함한 시각 글자(또는 Date)를 UTC ISO 글자로 바꿉니다.
  function iso(value) {
    if (value instanceof Date) value = value.toISOString();
    if (typeof value !== "string" || !/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(value) || isNaN(Date.parse(value))) {
      throw Error("시간대를 포함한 시각을 입력해 주세요.");
    }
    return new Date(value).toISOString();
  }

  // 시각의 한국 날짜 "YYYY-MM-DD"를 돌려줍니다.
  function day(value) {
    return new Date(Date.parse(value) + KST_OFFSET_MS).toISOString().slice(0, 10);
  }

  // 기준 시각을 정합니다. 오늘(한국 날짜)이고 지금보다 늦지 않아야 합니다.
  function view(at, now) {
    now = iso(now);
    var cutoff = at ? iso(at) : now;
    if (day(cutoff) !== day(now) || Date.parse(cutoff) > Date.parse(now)) {
      throw Error("오늘의 현재 이전 시각을 선택해 주세요.");
    }
    return cutoff;
  }

  function isBlank(cell) {
    return cell === "" || cell === null;
  }

  function optionalIso(cell) {
    return cell === "" || cell === null || cell === undefined ? null : iso(cell);
  }

  // 한 행을 기록으로 바꿉니다. 문제가 있으면 그 문구로 오류를 냅니다.
  function parseRow(row, kind, now, seen) {
    var id = row[0] === null || row[0] === undefined ? "" : String(row[0]);
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(id) || seen.has(id)) {
      throw Error("고유한 영문·숫자 기록 ID가 필요합니다.");
    }
    seen.add(id);
    var cell = row[1];
    var quantity = Number(cell);
    if ((typeof cell !== "string" && typeof cell !== "number") || cell === "" ||
        !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10000) {
      throw Error("수량은 1~10000의 정수입니다.");
    }
    var occurredAt = iso(row[2]);
    var receivedAt = optionalIso(row[3]);
    var processedAt = optionalIso(row[4]);
    var nowMs = Date.parse(now);
    var occurredMs = Date.parse(occurredAt);
    if (occurredMs > nowMs ||
        (receivedAt && (Date.parse(receivedAt) < occurredMs || Date.parse(receivedAt) > nowMs)) ||
        (processedAt && (!receivedAt || Date.parse(processedAt) < Date.parse(receivedAt) || Date.parse(processedAt) > nowMs))) {
      throw Error("발생·접수·처리 시각의 순서를 확인해 주세요.");
    }
    return { id: id, kind: kind, quantity: quantity, occurredAt: occurredAt, receivedAt: receivedAt, processedAt: processedAt };
  }

  // 시트 행 배열을 { records, errors }로 바꿉니다. 오류의 row는 시트 행 번호(배열 순번 + 2)입니다.
  function parse(rows, kind, now) {
    var records = [];
    var errors = [];
    var seen = new Set();
    rows.forEach(function (row, index) {
      if (row.every(isBlank)) return;
      try {
        records.push(parseRow(row, kind, now, seen));
      } catch (error) {
        errors.push({ row: index + 2, message: error.message });
      }
    });
    return { records: records, errors: errors };
  }

  // 기준 시각 at까지 보이는 그 kind의 기록을 발생 시각 순으로 돌려줍니다.
  function recordsAt(records, kind, at, from, to) {
    if (kind !== "production" && kind !== "shipment") {
      throw Error("생산 또는 출고를 선택해 주세요.");
    }
    var start = from ? iso(from) : iso(day(at) + "T00:00:00+09:00");
    var end = to ? iso(to) : at;
    var atMs = Date.parse(at);
    var startMs = Date.parse(start);
    var endMs = Date.parse(end);
    if (day(start) !== day(at) || day(end) !== day(at) || startMs > endMs || endMs > atMs) {
      throw Error("조회 시간 구간을 확인해 주세요.");
    }
    return records
      .filter(function (record) {
        var occurredMs = Date.parse(record.occurredAt);
        return record.kind === kind && occurredMs >= startMs && occurredMs <= endMs;
      })
      .sort(function (a, b) { return Date.parse(a.occurredAt) - Date.parse(b.occurredAt); })
      .map(function (record) {
        var receivedAt = record.receivedAt && Date.parse(record.receivedAt) <= atMs ? record.receivedAt : null;
        var processedAt = record.processedAt && Date.parse(record.processedAt) <= atMs ? record.processedAt : null;
        return {
          id: record.id,
          kind: record.kind,
          quantity: record.quantity,
          occurredAt: record.occurredAt,
          receivedAt: receivedAt,
          processedAt: processedAt,
          status: processedAt ? "completed" : receivedAt ? "processing-wait" : "receipt-wait"
        };
      });
  }

  return { iso: iso, day: day, view: view, parse: parse, recordsAt: recordsAt };
})();
