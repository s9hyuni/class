# 6회차 보충 문서: Discord 알림, 기록 처리, 트리거

> 이 문서는 6회차 프롬프트가 만드는 내용의 자세한 약속입니다. 앞 회차 문서에 이어지며, 앞 문서와 다르면 이 문서를 따릅니다.

## 이 문서를 읽는 법

- 백틱 안의 글은 이름이나 값입니다. 글자 그대로 씁니다.
- 큰따옴표 안의 글은 화면에 나오는 글자이거나 코드에 들어가는 값입니다. 한 글자도 바꾸지 않습니다.
- "쓰는 단계"는 그 내용을 만드는 프롬프트 번호입니다. 프롬프트 맨 앞의 `[2-14]` 같은 표시가 이번 단계입니다. 그 번호가 "쓰는 단계"나 줄 앞에 적힌 내용만 만들고, 다른 번호의 내용은 그 프롬프트를 받기 전에 만들지 않습니다.
- 창고 쪽 이름은 공장 쪽 이름의 `factory`를 `warehouse`로 바꾼 같은 이름입니다.

## 이 회차에서 만드는 것

- 시작 상태: 5회차를 끝낸 폴더입니다. GAS 웹 앱이 배포돼 있고 화면은 내 Google 시트 값으로 "조회 정상"이며 기록 보기도 됩니다.
- 끝 상태: 내 Discord 시험 채널로 알림이 갑니다. 편집기에서 함수를 실행하거나 시트를 직접 고쳐 기록을 더하고 처리하면 화면 수량이 바뀝니다. 자동 실행(트리거) 두 개가 동작합니다.
- 건드리지 않는 곳: 화면 파일과 웹 앱 입구입니다.

기록은 시트에 쌓이고 웹 앱이 그 시트를 읽어 답합니다. 화면은 10초마다 다시 조회합니다. 알림은 웹훅으로 Discord 채널에 가고 결과는 알림 기록 탭에 남습니다. 화면의 알림 카드는 이 탭의 마지막 행을 읽습니다.

## 앞 회차에서 바뀌는 것

- 5회차 '코드를 고친 뒤'에는 "gas:push 뒤 gas:redeploy"라고 적혀 있습니다. 이번 회차는 웹 앱 입구를 바꾸지 않아서 사용자가 gas:push만 하고 gas:redeploy는 하지 않습니다. 편집기 실행과 트리거는 gas:push로 올린 코드로 바로 돌아갑니다.
- 5회차에 다른 곳에서 부르지 않던 `settings_()`를 이번 회차 `rememberSettings_()`가 부릅니다.
- 5회차에 만든 도구(`toRow_`, `fromCell_`, `settings_()`, `meta_()`, `readData_()`, `alerts_()`, `alertMessage_`, `TumbleCore`)는 새로 만들지 않고 그대로 부릅니다.

## 프롬프트의 말과 실제 이름

쓰는 단계: 6-1 ~ 6-22

| 프롬프트의 말 | 실제 이름 |
|---|---|
| Google 쪽 코드 | `gas/Code.gs` |
| 잠금 | `withLock_` |
| Discord 시험 채널로 알림을 보내는 기능 | `sendAlert_` |
| 알림 시험 함수 | `testDiscordAlert` |
| 설정 이력 끝에 한 번 더 남기는 기능 | `rememberSettings_` |
| 기록 탭의 한 줄을 접수하고 처리하는 기능(한 줄 처리), 앞부분·입력 검사·끝부분 | `processRow_` |
| 두 탭의 모든 줄을 처리하는 함수 | `processPendingRecords` |
| 생산 기록 탭 끝에 기록 한 줄을 더하고 바로 처리하는 함수 | `addDemoProductionRecord` |
| 시트를 고치면 고친 기록 줄을 바로 처리하는 함수 | `onEditInstalled` |
| 확인할 일이 있으면 Discord로 알리는 함수 | `checkRecordDelays` |
| 두 함수의 자동 실행(트리거)을 만드는 함수 | `installTrainingTriggers` |

## 코드를 두는 곳과 올리는 법

쓰는 단계: 6-1 ~ 6-22

### 약속

- 이번 회차 함수는 모두 `gas/Code.gs` 끝에 더합니다.
- 웹 앱 입구(`doGet`)는 바꾸지 않으므로 사용자는 `gas:push`만 하고 `gas:redeploy`는 하지 않습니다.

## 함수 이름

쓰는 단계: 6-5, 6-14, 6-15, 6-20, 6-21, 6-22

사용자는 이 이름으로 편집기의 함수 목록과 트리거 목록에서 함수를 찾습니다.

### 약속

- 사용자가 편집기에서 고르는 함수(이름 끝에 _ 없음): `testDiscordAlert`, `processPendingRecords`, `addDemoProductionRecord`, `installTrainingTriggers`.
- 트리거가 부르는 함수: `onEditInstalled`, `checkRecordDelays`.

## 잠금

쓰는 단계: 6-1, 6-5, 6-14, 6-15, 6-20, 6-21

시트에 쓰는 일이 동시에 두 개 실행되면 같은 줄을 겹쳐 쓸 수 있습니다. 한 번에 하나만 실행되게 합니다.

이 잠금은 6-1에서 만듭니다. `testDiscordAlert`, `processPendingRecords`, `addDemoProductionRecord`, `checkRecordDelays`는 만들 때 본문 전체를 이 안에서 실행합니다. `onEditInstalled`는 첫 검사(`e`, `e.range`, 시트 ID)를 통과한 뒤의 일을 모두 이 안에서 실행합니다. `sendAlert_`, `rememberSettings_`, `processRow_`는 이 함수들 안에서 불리므로 따로 잠그지 않습니다. `installTrainingTriggers`는 시트에 쓰지 않아 이 안에 넣지 않습니다. 5회차의 `createTrainingSpreadsheet`는 고치지 않습니다.

### 약속

- `withLock_(fn)`: `LockService.getScriptLock()`으로 최대 20000밀리초 기다려 잠그고 `fn()`의 값을 돌려주며, 오류가 나도 끝나면 잠금을 풉니다.
- 시트에 쓰는 편집기 함수와 트리거 함수는 모두 이 안에서 실행합니다.

## Discord 알림 보내기

쓰는 단계: 6-2

웹훅 주소와 보내다가 난 오류의 내용은 로그와 시트에 남기지 않습니다. 상세 칸에는 '보낸 결과 남기기' 표의 글만 씁니다.

### 약속

- `sendAlert_(key, message)`: 같은 `key`는 설정 `cooldown_minutes`분 안에 다시 보내지 않습니다.
- 그 시간 안이면 보내지도, 알림 기록 탭에 쓰지도, `ALERT_` 속성을 고치지도 않고 끝냅니다.
- 마지막 시도 시각(밀리초)은 스크립트 속성 `"ALERT_" + meta_().sessionId + "_" + key`에 두고, 없으면 0으로 봅니다.
- 웹훅 주소는 `DISCORD_WEBHOOK_URL`에서만 읽고, 아래 첫 줄의 형식에 맞을 때만 둘째 줄처럼 보냅니다(주소와 보낼 글은 그 자리에 넣을 값입니다).

```javascript
/^https:\/\/discord\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+$/
UrlFetchApp.fetch(주소 + "?wait=true", { method: "post", contentType: "application/json", payload: JSON.stringify({ content: 보낼 글, allowed_mentions: { parse: [] } }), muteHttpExceptions: true })
```

## 현장 이름 붙이기

쓰는 단계: 6-3

`sendAlert_`가 보낼 글을 만드는 규칙입니다.

### 약속

- 보낼 글은 `message`가 "텀블공장: "이나 "물류창고: "로 시작하면 그대로, 아니면 `"텀블공장: " + message`입니다(현장 이름이 두 번 붙지 않게).

## 보낸 결과 남기기

쓰는 단계: 6-4

`sendAlert_`가 보낸 뒤 하는 일입니다.

### 약속

| 경우 | 발송 상태 | 상세 |
|---|---|---|
| 응답 코드 200~299 | "sent" | "HTTP " + 코드 |
| 그 밖의 응답 코드 | "failed" | "HTTP " + 코드 |
| 주소가 없거나 틀리거나 보내다 오류가 나면 | "failed" | "알림 연결 또는 웹훅 설정을 확인해 주세요." |

- 결과는 알림 기록 탭 끝에 [지금 ISO 시각, key, message(이름을 붙이기 전 글), 발송 상태, 상세]를 `toRow_`로 한 행 더합니다.
- 실패여도 `ALERT_` 속성에 지금 시각을 저장합니다.
- 화면 알림 카드는 이 탭의 마지막 행을 읽습니다.

## 알림 시험 함수

쓰는 단계: 6-5

### 약속

- `testDiscordAlert()`: `withLock_` 안에서 `sendAlert_("test-" + Utilities.getUuid(), "알림 연결 테스트입니다.")`를 부릅니다.

## 설정 이력

쓰는 단계: 6-10

화면은 설정 탭을 바로 읽지 않고 설정 탭 A1 칸의 메모(설정 이력)를 읽습니다. 기록을 처리할 때마다 지금 설정을 이력에 더합니다.

### 약속

- `rememberSettings_()`: `meta_()`의 `revision`을 1 올리고 `changedAt`을 지금으로 바꿉니다.
- 설정 탭 A1 메모의 설정 이력 끝에 { at: 지금, settings: settings_(), revision: 새 revision }을 더합니다.
- 바뀐 `meta`를 `TUMBLE_META`에 저장합니다.

## 한 줄 처리 앞부분

쓰는 단계: 6-11

기록 줄의 A칸 메모에는 접수한 기록의 원본이 들어 있습니다. 접수한 기록은 시트에서 고쳐도 화면 값이 바뀌지 않게 합니다.

### 약속

`processRow_(sheet, row, notify)` 앞부분은 그 행 1~6열을 `fromCell_`로 읽고 A칸 메모를 봅니다.

| A칸 메모 | 할 일 |
|---|---|
| 있고 원본에 처리 시각이 있으면 | 행을 원본(`toRow_`)으로 되돌려 쓰고 끝냅니다. |
| 있고 처리 전이면 | 원본 값으로 이어 처리합니다. |
| 없으면 | 읽은 값의 접수·처리 시각을 비웁니다(시트 칸은 끝부분에서 씁니다). |

## 한 줄 처리 입력 검사

쓰는 단계: 6-12

앞부분에서 고른 값을 검사합니다. 문제가 있으면 여기서 끝나고 끝부분으로 가지 않습니다.

### 약속

- `processRow_` 검사: `kind`는 탭이 "생산 기록"이면 `production`, 아니면 `shipment`입니다.
- 같은 탭 다른 행에 같은 ID(`String` 비교, 빈 ID는 제외)가 있거나 TumbleCore.parse([값], kind, 지금)에 오류가 있으면 6열에 "입력 확인 필요"를 쓰고, `notify`면 sendAlert_("input-" + kind + "-" + 행 번호, "같은 기록 ID가 있습니다." 또는 parse 첫 오류 문장)을 부른 뒤 끝냅니다.

## 한 줄 처리 끝부분

쓰는 단계: 6-13

검사를 지난 값만 여기까지 옵니다.

### 약속

- `processRow_` 끝부분: 빈 행이면 끝냅니다.
- 접수 시각이 비었으면 지금으로 채웁니다.
- 그 현장 처리 정지(`factory_paused`·`warehouse_paused`)가 `true`면 처리 시각 "", 처리 상태 "처리 대기", 아니면 처리 시각 지금, 처리 상태 "완료"입니다.
- 값을 `toRow_`로 그 행에 쓰고 A칸 메모에 값의 JSON을 씁니다.

## 모든 기록 처리 함수

쓰는 단계: 6-14

본문 전체를 `withLock_` 안에서 실행합니다.

### 약속

- `processPendingRecords()`: 두 기록 탭의 2행부터 마지막 행까지 processRow_(탭, 행, true)를 부르고 끝에 `rememberSettings_()`를 부릅니다.

## 데모 생산 기록 함수

쓰는 단계: 6-15

본문 전체를 `withLock_` 안에서 실행합니다.

### 약속

- `addDemoProductionRecord()`: 생산 기록 탭 끝에 ["P-" + Utilities.getUuid(), 10, 지금 ISO 시각, "", "", "대기"]를 `toRow_`로 더합니다.
- 그 행에 processRow_(탭, 행, true)를 부른 뒤 `rememberSettings_()`를 부릅니다.

## 시트를 고치면 처리하는 함수

쓰는 단계: 6-20

손으로 실행하던 처리를, 시트를 고치는 순간 자동으로 하게 합니다. 첫 검사(`e`, `e.range`, 시트 ID)를 통과한 뒤의 일을 모두 `withLock_` 안에서 실행합니다.

### 약속

`onEditInstalled(e)`는 아래를 차례로 봅니다.

1. `e`나 `e.range`가 없거나 `e.source.getId()`가 `SPREADSHEET_ID`와 다르면 아무것도 하지 않습니다.
2. 편집한 탭이 "설정"이면 `rememberSettings_()`만 부릅니다.
3. 기록 탭이 아니거나 편집 범위 첫 행이 1행이면 끝냅니다.
4. 그 밖에는 편집 범위의 행마다 processRow_(탭, 행, true)를 부르고, 반복이 끝난 뒤 `rememberSettings_()`를 한 번 부릅니다.

## 늦은 기록을 알리는 함수

쓰는 단계: 6-21

본문 전체를 `withLock_` 안에서 실행합니다.

### 약속

- `checkRecordDelays()`: `readData_()`로 지금 자료를 읽어 `TumbleCore.snapshot(data.records, data.settings, data.meta, alerts_(), null, data.now, data.errors)`를 만듭니다.
- `incidents` 가운데 `scope`가 "service"가 아닌 것마다 sendAlert_(사건 id, alertMessage_(사건))를 부릅니다.

## 자동 실행 설치 함수

쓰는 단계: 6-22

### 약속

- `installTrainingTriggers()`: `SPREADSHEET_ID`가 없으면 "시트를 먼저 생성해 주세요."입니다.
- 실행 함수가 `onEditInstalled`나 `checkRecordDelays`인 트리거를 모두 지웁니다.
- 그 뒤 ScriptApp.newTrigger("onEditInstalled").forSpreadsheet(시트 ID).onEdit().create()와 `ScriptApp.newTrigger("checkRecordDelays").timeBased().everyMinutes(1).create()`를 만듭니다.
- 여러 번 실행해도 두 개만 남습니다.

## 사용자가 직접 하는 일

쓰는 단계: 6-6 ~ 6-9, 6-16 ~ 6-19, 6-23 ~ 6-27

아래 일은 사용자가 합니다. AI 도구는 실행하지 않습니다.

- Discord 웹훅 만들기(6-6), 스크립트 속성에 웹훅 주소 넣기(6-7)
- `npm.cmd run gas:push`로 올리기, 편집기에서 함수 실행(6-8, 6-9, 6-16 ~ 6-19, 6-23)
- 시트를 직접 고치기(6-17 ~ 6-19, 6-24, 6-25), 트리거 설치와 지우기(6-23, 6-27)
- 화면 서버 켜기와 끄기

### 약속

- Discord 웹훅 주소는 채팅에 옮겨 적지 않고 코드·시트·문서·로그에 쓰지 않습니다. 사용자가 스크립트 속성 `DISCORD_WEBHOOK_URL`에 직접 넣습니다.
- GAS 편집기 실행, 스크립트 속성, 트리거 메뉴, Discord 설정은 사용자가 직접 합니다.
- 브라우저를 대신 조작하지 않습니다.

[session-6 문서 끝]
