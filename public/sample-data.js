window.SAMPLE_SNAPSHOT = {
  "schemaVersion": 1,
  "scenarioId": "normal",
  "revision": 1,
  "changedAt": "2026-10-26T00:00:00.000Z",
  "serverTime": "2026-10-26T04:10:00.000Z",
  "viewTime": "2026-10-26T04:10:00.000Z",
  "trainingOnly": true,
  "sites": {
    "factory": {
      "label": "텀블공장",
      "target": 120,
      "completed": 100,
      "lastEventAt": "2026-10-26T03:55:00.000Z",
      "receivedAt": "2026-10-26T03:55:02.000Z",
      "processedAt": "2026-10-26T03:55:05.000Z",
      "status": "normal",
      "note": "기록이 반영되고 있습니다.",
      "processingState": "completed",
      "history": [
        { "timestamp": "2026-10-26T00:00:00.000Z", "quantity": 20 },
        { "timestamp": "2026-10-26T01:00:00.000Z", "quantity": 30 },
        { "timestamp": "2026-10-26T02:00:00.000Z", "quantity": 25 },
        { "timestamp": "2026-10-26T03:00:00.000Z", "quantity": 25 }
      ],
      "image": { "url": "./assets/approved/factory.png", "alt": "생산 라인 참고 사진" }
    },
    "warehouse": {
      "label": "물류창고",
      "target": 100,
      "completed": 75,
      "lastEventAt": "2026-10-26T03:58:00.000Z",
      "receivedAt": "2026-10-26T03:58:02.000Z",
      "processedAt": "2026-10-26T03:58:05.000Z",
      "status": "normal",
      "note": "기록이 반영되고 있습니다.",
      "processingState": "completed",
      "history": [
        { "timestamp": "2026-10-26T00:00:00.000Z", "quantity": 15 },
        { "timestamp": "2026-10-26T01:00:00.000Z", "quantity": 20 },
        { "timestamp": "2026-10-26T02:00:00.000Z", "quantity": 20 },
        { "timestamp": "2026-10-26T03:00:00.000Z", "quantity": 20 }
      ],
      "image": { "url": "./assets/approved/warehouse.png", "alt": "물류창고 참고 사진" }
    }
  },
  "services": {
    "api": { "status": "normal", "note": "조회 서비스가 정상입니다." },
    "alerts": { "status": "sent", "lastAttemptAt": "2026-10-26T03:30:00.000Z", "note": "모의 전송 성공 기록입니다. 실제 알림을 보내지 않았습니다." }
  },
  "incidents": [],
  "mode": "current",
  "sessionId": "sample"
};

window.SAMPLE_RECORDS = {
  "production": [
    { "id": "sample-p-1", "kind": "production", "quantity": 20, "occurredAt": "2026-10-26T00:20:00.000Z", "receivedAt": "2026-10-26T00:20:02.000Z", "processedAt": "2026-10-26T00:20:05.000Z", "status": "completed" },
    { "id": "sample-p-2", "kind": "production", "quantity": 30, "occurredAt": "2026-10-26T01:20:00.000Z", "receivedAt": "2026-10-26T01:20:02.000Z", "processedAt": "2026-10-26T01:20:05.000Z", "status": "completed" },
    { "id": "sample-p-3", "kind": "production", "quantity": 25, "occurredAt": "2026-10-26T02:20:00.000Z", "receivedAt": "2026-10-26T02:20:02.000Z", "processedAt": "2026-10-26T02:20:05.000Z", "status": "completed" },
    { "id": "sample-p-4", "kind": "production", "quantity": 25, "occurredAt": "2026-10-26T03:55:00.000Z", "receivedAt": "2026-10-26T03:55:02.000Z", "processedAt": "2026-10-26T03:55:05.000Z", "status": "completed" }
  ],
  "shipment": [
    { "id": "sample-s-1", "kind": "shipment", "quantity": 15, "occurredAt": "2026-10-26T00:30:00.000Z", "receivedAt": "2026-10-26T00:30:02.000Z", "processedAt": "2026-10-26T00:30:05.000Z", "status": "completed" },
    { "id": "sample-s-2", "kind": "shipment", "quantity": 20, "occurredAt": "2026-10-26T01:30:00.000Z", "receivedAt": "2026-10-26T01:30:02.000Z", "processedAt": "2026-10-26T01:30:05.000Z", "status": "completed" },
    { "id": "sample-s-3", "kind": "shipment", "quantity": 20, "occurredAt": "2026-10-26T02:30:00.000Z", "receivedAt": "2026-10-26T02:30:02.000Z", "processedAt": "2026-10-26T02:30:05.000Z", "status": "completed" },
    { "id": "sample-s-4", "kind": "shipment", "quantity": 20, "occurredAt": "2026-10-26T03:58:00.000Z", "receivedAt": "2026-10-26T03:58:02.000Z", "processedAt": "2026-10-26T03:58:05.000Z", "status": "completed" }
  ]
};
