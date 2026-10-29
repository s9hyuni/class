# 6회차: Discord 알림, 기록 처리, 트리거

- 시작 상태: 5회차를 끝낸 `C:\ai-class\tumble-dashboard`에서 이어 합니다(완료 브랜치 `milestone-5`와 같은 출발점). 내 GAS 웹 앱이 배포돼 있고, `public\config.js`의 `apiBaseUrl`이 그 주소(`…/exec`)를 가리킵니다. 화면은 내 구글 시트의 값으로 "조회 정상"이고 기록 보기도 됩니다.
- 끝나면 되는 것
  - 내 Discord 시험 채널로 알림이 가고, 화면의 운영 상태 알림 카드에 "전송 성공"이 뜹니다.
  - GAS 편집기에서 함수를 실행하거나 시트를 직접 고쳐 기록을 더하고 처리하면, 화면 수량이 바뀝니다.
  - 트리거 두 개(시트를 고치면 바로 처리, 1분마다 늦은 기록 알림)가 동작하고, 실습이 끝나면 지웁니다.
- 준비물: 수업 Google 계정으로 로그인한 Chrome, Discord 계정(Chrome에서 `https://discord.com`으로 써도 됩니다), 서버를 켜 둔 터미널(이하 "서버 창")
- 꼭 지킬 것: Discord 웹훅 주소를 아는 사람은 누구나 내 채널에 글을 보낼 수 있습니다. 주소는 GAS 스크립트 속성 `DISCORD_WEBHOOK_URL`에만 넣고 채팅, 화면 공유, 캡처, 코드, 시트에 옮기지 않습니다.
- 이 회차는 따라잡기와 발표 시간도 겸합니다. 프롬프트는 짧고, 대부분은 편집기와 시트에서 직접 확인합니다.

| 번호 | 하는 일 |
|---|---|
| 6-0 | 규칙 더하기 |
| 6-1 ~ 6-10 | Discord 시험 알림 |
| 6-11 ~ 6-19 | 기록 더하기와 처리하기 |
| 6-20 ~ 6-26 | 트리거 두 개, 실습 끝나면 지우기 |

## 시작 전에 (프롬프트 없이 직접 합니다)

**5회차를 못 끝냈으면** 먼저 완료 브랜치를 받습니다. 5회차를 끝냈으면 이 부분은 건너뛰고 아래 "수업 날 새 실습 시트 만들기"로 갑니다.

1. PowerShell에서 옛 폴더 이름을 바꾸고 `milestone-5`를 받습니다.

```powershell
cd C:\ai-class
Rename-Item tumble-dashboard tumble-dashboard-old
git clone -b milestone-5 https://github.com/startup-life/aiops-dashboard-student.git tumble-dashboard
cd tumble-dashboard
```

2. 5회차에서 Google 프로젝트를 만들고 배포까지 했으면, 옛 폴더의 연결 파일과 화면 설정을 새 폴더로 복사한 뒤 코드를 다시 올립니다. `gas:deploy`는 하지 않습니다(배포가 하나 더 생겨 주소가 바뀝니다).

```powershell
Copy-Item ..\tumble-dashboard-old\.clasp.json .
Copy-Item ..\tumble-dashboard-old\public\config.js public\config.js
npm.cmd run gas:push
npm.cmd run gas:redeploy
```

   - 확인: `notepad public\config.js`로 열어 `apiBaseUrl`이 `https://script.google.com/macros/s/…/exec`이고 `timeoutMs`가 `15000`입니다. 아니면 5회차에 `README.md` 단계별 값 표에 적어 둔 내 주소로 직접 고칩니다. 마지막 줄은 "같은 배포를 새 버전으로 갱신했습니다. 주소는 그대로입니다."입니다.
3. Google 프로젝트를 만든 적이 없으면(옛 폴더에 `.clasp.json`이 없으면) 5회차 파일에서 코드를 만드는 프롬프트는 건너뛰고, 명령·브라우저 단계(Apps Script API 켜기, `gas:login`, `gas:create`, `gas:push`, 첫 권한 승인과 실습 시트 만들기, `gas:deploy`, `gas:open`)만 차례로 합니다.
4. Antigravity로 새 `C:\ai-class\tumble-dashboard` 폴더를 엽니다.

**수업 날 새 실습 시트 만들기**: 화면은 "오늘" 기록만 셉니다. 5회차에 만든 시트의 시드 기록은 그날 날짜라 오늘 화면에는 기록이 없게 나옵니다. 오늘 날짜로 시드 기록이 든 새 시트를 만듭니다. 웹 앱은 다시 배포하지 않아도 새 시트를 읽습니다.

1. Antigravity 터미널에서 편집기를 엽니다.

```powershell
npm.cmd run gas:editor
```

2. Chrome에 열린 편집기 오른쪽 위 계정이 수업 계정인지 봅니다. 왼쪽 파일 목록에서 `Setup.gs`를 누르고, 위쪽 함수 선택에서 `createTrainingSpreadsheet`를 골라 "실행"을 누릅니다.
3. 서버 창에서 `npm.cmd start`로 화면 서버를 켜고 Chrome에서 `http://127.0.0.1:4173`을 엽니다.

- 확인: 실행 로그에 `새 실습 시트: https://docs.google.com/spreadsheets/…`가 나옵니다. 10~15초 안에 화면이 "생산 100개 · 목표 120개", "출고 75개 · 목표 100개"이고 "조회 정상"입니다.
- 이 시트 주소는 이번 회차 내내 씁니다. 실행 로그의 주소를 Ctrl+클릭해 새 탭으로 열어 둡니다. 주소는 다른 곳에 옮기지 않습니다.

## 진행 방법

- 프롬프트는 `gas\Code.gs` 끝에 함수를 하나씩 더합니다. Antigravity는 내 컴퓨터의 파일만 고칩니다. Google에 반영하려면 내가 `npm.cmd run gas:push`로 올려야 합니다.
- 올린 뒤에는 편집기 탭을 새로고침(F5)해야 새 함수가 함수 선택 목록에 보입니다. 함수 목록은 왼쪽에서 고른 파일 기준이라, 이번 회차 함수는 `Code.gs`를 누른 뒤 고릅니다.
- 이번 회차는 웹 앱 응답(`doGet`)을 바꾸지 않습니다. 그래서 **`gas:redeploy`는 하지 않습니다.** 편집기 실행과 트리거는 `gas:push`로 올린 코드로 바로 돌아갑니다.
- 화면은 10초마다 다시 조회합니다. 시트가 바뀐 뒤 10~15초 기다리면 화면에 반영됩니다.
- 화면 서버(`npm.cmd start`)는 켜 둔 채로 진행합니다. 화면 파일은 이번 회차에 바뀌지 않습니다.

## 6-0. 규칙 더하기

```text
1회차에 만든 규칙 파일(AGENTS.md) 끝에 아래 두 줄을 그대로 더해 주세요. 다른 줄은 바꾸지 마세요.

- Discord 웹훅 주소는 채팅에 옮겨 적지 않고, 코드·시트·문서에 쓰지 않는다. 주소는 사용자가 GAS 스크립트 속성에 직접 넣는다.
- GAS 편집기 실행, 스크립트 속성, 트리거 메뉴, Discord 설정은 사용자가 직접 한다. 브라우저를 대신 조작하지 않는다.
```

- 확인: `AGENTS.md` 끝에 두 줄이 생겼습니다.

## 6-1. 잠금 함수

시트에 쓰는 함수가 동시에 두 개 실행되면 같은 행을 겹쳐 쓸 수 있습니다. 한 번에 하나만 실행되게 하는 도구를 먼저 만듭니다.

```text
gas/Code.gs 끝에 withLock_(fn) 함수를 더해 주세요. 다른 함수와 다른 파일은 고치지 마세요. Apps Script용 일반 JavaScript로 씁니다.
LockService.getScriptLock()으로 잠금을 최대 20000밀리초 기다려(waitLock) 얻고, fn()을 실행해 그 값을 돌려줍니다.
fn()에서 오류가 나도 끝나면 잠금을 풉니다(try/finally).
```

- 확인: Antigravity가 함수를 더했다고 알려 줍니다. 아직 Google에 올리지 않았습니다.

## 6-2. 알림 보내기 1: 다시 보내지 않는 시간

```text
gas/Code.gs에 알림을 보내는 sendAlert_(key, message) 함수를 만들어 주세요. 이번에는 첫 검사만 만듭니다.
같은 key는 settings_().cooldown_minutes분 안에 다시 보내지 않습니다. 마지막 시도 시각(밀리초 숫자)은 스크립트 속성 "ALERT_" + meta_().sessionId + "_" + key에 두고, 속성이 없으면 0으로 봅니다.
지금과의 차이가 cooldown보다 짧으면 아무것도 하지 않고 끝냅니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 6-3. 알림 보내기 2: 웹훅 주소 검사와 보내기

```text
sendAlert_에 이어서, 웹훅 주소를 스크립트 속성 DISCORD_WEBHOOK_URL에서만 읽어 주세요. 코드·시트·로그에 주소를 쓰지 않습니다.
주소가 없거나 /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+$/에 맞지 않으면 보내지 않습니다.
맞으면 UrlFetchApp.fetch(주소 + "?wait=true", { method: "post", contentType: "application/json", payload: JSON.stringify({ content: 보낼 글, allowed_mentions: { parse: [] } }), muteHttpExceptions: true })로 보냅니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 6-4. 알림 보내기 3: 현장 이름 한 번만 붙이기

```text
sendAlert_의 "보낼 글"을 정해 주세요. message가 "텀블공장: "이나 "물류창고: "로 시작하면 message 그대로, 아니면 "텀블공장: " + message입니다.
현장 사건 알림은 제목이 이미 현장 이름으로 시작하므로, 이름이 두 번 붙지 않게 하려는 것입니다.
```

- 확인: `gas\Code.gs`에서 `"텀블공장: " + message`가 조건 없이 쓰이지 않았습니다. 조건 없이 붙이면 6-25의 알림이 "텀블공장: 텀블공장: …"이 됩니다.

## 6-5. 알림 보내기 4: 결과를 알림 기록 탭에 남기기

```text
sendAlert_의 결과를 정해 주세요. 응답 코드가 200~299면 발송 상태 "sent", 아니면 "failed"이고, 상세는 "HTTP " + 응답 코드입니다.
주소가 없거나 맞지 않거나 보내다 오류가 나면 발송 상태 "failed", 상세 "알림 연결 또는 웹훅 설정을 확인해 주세요."입니다.
결과는 알림 기록 탭 끝에 [지금 ISO 시각, key, message(앞에 이름을 붙이지 않은 원래 글), 발송 상태, 상세]를 toRow_로 바꿔 한 행 더합니다.
그 뒤 실패여도 지금 시각을 위의 ALERT_ 속성에 저장합니다. 실패도 같은 시간 동안 다시 보내지 않습니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다. 화면의 알림 카드는 이 탭의 마지막 행을 읽으므로 칸 순서가 위와 같아야 합니다.

## 6-6. 시험 함수

```text
gas/Code.gs에 편집기에서 실행할 testDiscordAlert() 함수를 더해 주세요. 이름 끝에 _를 붙이지 않습니다(편집기 실행 목록에 보여야 합니다).
withLock_ 안에서 sendAlert_("test-" + Utilities.getUuid(), "알림 연결 테스트입니다.")를 부릅니다. 실행할 때마다 key가 달라 바로 다시 시험할 수 있습니다.
```

- 확인: `gas\Code.gs` 끝에 `withLock_`, `sendAlert_`, `testDiscordAlert` 세 함수가 있습니다.

## 6-7. Discord 웹훅 만들기 (직접)

1. Discord에서 내가 만든 서버의 시험 채널을 고릅니다. 서버가 없으면 왼쪽 맨 아래 "+"(서버 추가하기), "직접 만들기"로 하나 만듭니다.
2. 채널 이름 옆 톱니바퀴(채널 편집), "연동", "웹후크", "새 웹후크"를 차례로 누릅니다.
3. 새로 생긴 웹후크를 열고 "웹후크 URL 복사"를 누릅니다. 복사한 주소는 메모장이나 채팅에 붙여 넣지 않고 바로 6-8에서 씁니다.

- 확인: 복사한 주소는 `https://discord.com/api/webhooks/`와 숫자로 시작합니다(눈으로만 봅니다).

## 6-8. 스크립트 속성에 웹훅 주소 넣기 (직접)

1. GAS 편집기 왼쪽 톱니바퀴(프로젝트 설정)를 누르고 아래 "스크립트 속성"으로 내려갑니다.
2. "스크립트 속성 수정", "스크립트 속성 추가"를 누르고 속성에 `DISCORD_WEBHOOK_URL`, 값에 복사한 웹훅 주소를 붙여 넣은 뒤 "스크립트 속성 저장"을 누릅니다.
3. 이미 있는 `SPREADSHEET_ID`, `TUMBLE_META`는 고치지 않습니다.

- 확인: 스크립트 속성 목록에 `DISCORD_WEBHOOK_URL`이 생겼습니다. 이 화면은 캡처하지 않습니다.

## 6-9. 올리고 시험 알림 보내기 (직접)

```powershell
npm.cmd run gas:push
```

1. 터미널에 `Pushed 5 files`가 나오면 편집기 탭을 새로고침합니다.
2. 왼쪽에서 `Code.gs`를 누르고 함수 선택에서 `testDiscordAlert`를 골라 "실행"을 누릅니다.

- 확인: 시험 채널에 "텀블공장: 알림 연결 테스트입니다."가 옵니다.
- 확인: 시트 알림 기록 탭에 한 행이 생깁니다. 사건 ID는 `test-`로 시작하고, 내용 "알림 연결 테스트입니다.", 발송 상태 `sent`, 상세 `HTTP 200`입니다.
- 확인: 10~15초 안에 화면의 운영 상태 알림 카드가 "전송 성공", "알림 전송이 완료됐습니다."로 바뀌고 마지막 전송 시도 시각이 나옵니다.
- 스크립트 속성에 `ALERT_`로 시작하는 속성이 하나 생깁니다. 같은 알림을 잠시 다시 보내지 않으려고 보낸 시각을 적어 둔 것입니다. 지우지 않습니다.
- `Syntax error`가 나오면 그 줄을 Antigravity에 붙여 넣고 "이 오류만 고쳐 주세요. Apps Script용 일반 JavaScript로 씁니다."라고 요청한 뒤 다시 올립니다.
- 실행 로그에 외부 서비스에 연결할 권한이 없다는 오류가 나오면, 5회차 첫 권한 승인에서 일부만 고른 것입니다. 다시 "실행"을 눌러 승인 창이 나오면 "모두 선택"으로 승인합니다.

## 6-10. 실패도 보이는지 확인 (직접)

1. 스크립트 속성에서 `DISCORD_WEBHOOK_URL` 줄을 지우고 저장한 뒤 `testDiscordAlert`를 실행합니다.
   - 확인: 알림 기록 탭에 `failed`, 상세 "알림 연결 또는 웹훅 설정을 확인해 주세요."가 남습니다. 화면 알림 카드가 "실패"가 되고, 화면 위 `알림 N건`을 누르면 "알림 전송에 실패했습니다."와 "담당자: 서비스 담당자"가 보입니다.
2. Discord에서 "웹후크 URL 복사"를 다시 눌러 6-8처럼 `DISCORD_WEBHOOK_URL`을 다시 넣고 `testDiscordAlert`를 실행합니다.
   - 확인: 알림 기록이 `sent`로 돌아오고, 화면 알림 카드가 "전송 성공"이 되며 실패 알림이 목록에서 빠집니다.

## 6-11. 설정 이력 남기기

화면은 설정 탭을 바로 읽지 않고, 설정 탭 A1 칸의 메모(설정 이력)를 읽습니다. 기록을 처리할 때마다 지금 설정을 이력에 더하는 함수를 만듭니다.

```text
gas/Code.gs에 rememberSettings_() 함수를 더해 주세요. 다른 함수와 다른 파일은 고치지 마세요.
meta = meta_()의 revision을 1 늘리고 changedAt을 지금 ISO 시각으로 바꿉니다.
설정 탭 A1 메모의 설정 이력(JSON 배열, 메모가 없으면 빈 배열) 끝에 { at: 지금 시각, settings: settings_(), revision: 새 revision }을 더해 메모에 다시 씁니다.
바뀐 meta는 스크립트 속성 TUMBLE_META에 JSON 글자로 저장합니다. 속성 하나에 넣을 수 있는 크기에 한도가 있어 이력은 메모에 둡니다.
```

- 확인: Antigravity가 함수를 더했다고 알려 줍니다.

## 6-12. 한 행 처리하기 1: 접수한 원본 지키기

기록 행의 A칸 메모에는 접수한 기록의 원본이 들어 있습니다. 접수한 기록은 시트에서 고쳐도 화면 값이 바뀌지 않게 합니다.

```text
gas/Code.gs에 기록 탭의 한 행을 접수·처리하는 processRow_(sheet, row, notify)를 만들어 주세요. 이번에는 앞부분만 만듭니다.
그 행 1~6열 값을 읽어 칸마다 fromCell_을 적용하고, A칸 메모(접수한 원본)를 봅니다.
메모가 있고 원본의 5번째 칸(처리 시각)이 있으면, 그 행을 원본으로(toRow_로 바꿔) 되돌려 쓰고 끝냅니다. 처리를 마친 기록은 시트에서 고칠 수 없습니다.
메모가 있고 처리 시각이 없으면 원본 값으로 이어서 처리합니다. 메모가 없으면 읽은 값의 접수 시각·처리 시각(4·5번째 칸)을 빈 글자로 비웁니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 6-13. 한 행 처리하기 2: 입력 검사

```text
processRow_에 이어서 입력 검사를 더해 주세요. 탭 이름이 "생산 기록"이면 kind는 "production", 아니면 "shipment"입니다.
같은 탭의 다른 행(rows_로 읽은 지금 값)에 같은 기록 ID가 있거나 TumbleCore.parse([값], kind, 지금 ISO 시각)에 오류가 있으면, 그 행 6열(처리 상태)에 "입력 확인 필요"를 씁니다.
이어서 notify가 true면 sendAlert_("input-" + kind + "-" + 행 번호, 같은 ID면 "같은 기록 ID가 있습니다.", 아니면 parse 오류의 첫 문구)를 부르고 끝냅니다.
기록 ID는 String으로 바꿔 비교합니다. 빈 글자인 ID는 같은 ID로 보지 않고, 숫자 0과 "0"은 같은 ID로 봅니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 6-14. 한 행 처리하기 3: 접수와 처리

```text
processRow_의 끝부분을 만들어 주세요. parse 결과에 기록이 없으면(빈 행) 아무것도 하지 않고 끝냅니다.
접수 시각이 비었으면 지금 ISO 시각으로 채웁니다. 설정의 처리 정지(생산은 settings_().factory_paused, 출고는 warehouse_paused)가 true면 처리 시각은 빈 글자, 처리 상태는 "처리 대기"이고, 아니면 처리 시각은 지금 ISO 시각, 처리 상태는 "완료"입니다.
값 배열을 toRow_로 바꿔 그 행에 쓰고, A칸 메모에 값 배열의 JSON 글자를 씁니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 6-15. 편집기에서 실행할 기록 함수 두 개

```text
gas/Code.gs에 편집기에서 실행할 함수 두 개를 더해 주세요. 둘 다 withLock_ 안에서 실행하고, 끝에 rememberSettings_()를 부릅니다.
processPendingRecords(): 생산 기록·출고 기록 탭의 2행부터 마지막 행까지 processRow_(탭, 행, true)를 부릅니다.
addDemoProductionRecord(): 생산 기록 탭 끝에 ["P-" + Utilities.getUuid(), 10, 지금 ISO 시각, "", "", "대기"]를 toRow_로 바꿔 더하고, 그 마지막 행에 processRow_(탭, 마지막 행 번호, true)를 부릅니다.
```

- 확인: `gas\Code.gs`에 `rememberSettings_`, `processRow_`, `processPendingRecords`, `addDemoProductionRecord`가 더해졌습니다.

## 6-16. 올리고 데모 기록 더하기 (직접)

```powershell
npm.cmd run gas:push
```

1. 편집기 탭을 새로고침하고 `Code.gs`에서 `addDemoProductionRecord`를 골라 실행합니다.

- 확인: 생산 기록 탭 끝에 `P-`로 시작하는 행 하나(수량 10, 처리 상태 "완료")가 더해지고, 시각 칸은 날짜가 아니라 글자 그대로 보입니다.
- 확인: 10~15초 안에 화면이 "생산 110개 · 목표 120개"가 됩니다.

## 6-17. 처리 정지와 다시 처리 (직접)

1. 시트 설정 탭에서 `factory_paused`의 값 칸을 `TRUE`로 바꾸고, 편집기에서 `addDemoProductionRecord`를 한 번 더 실행합니다.
   - 확인: 새 행의 처리 시각이 비고 처리 상태가 "처리 대기"입니다. 화면 수량은 110개 그대로이고 생산 카드에 "기록 처리가 일시 정지됐습니다."가 나옵니다.
2. `factory_paused`를 `FALSE`로 되돌리고 `processPendingRecords`를 실행합니다.
   - 확인: 그 행이 "완료"가 되고 화면이 "생산 120개 · 목표 120개"가 됩니다.

- 설정 탭을 고치기만 해서는 화면이 바뀌지 않습니다. 기록 함수가 실행될 때 설정이 이력에 남고, 웹 앱은 그 이력을 읽습니다. 6-23에서 트리거를 설치하면 고치는 즉시 남습니다.

## 6-18. 접수한 기록을 고쳐 보기 (직접)

1. 생산 기록 탭 2행(`P-seed-0`)의 수량을 20에서 25로 바꿉니다.
   - 확인: 10~15초 안에 화면 위 `알림 N건`을 누르면 "입력값을 확인할 기록이 있습니다."와 "할 일: 생산 기록 2행: 접수한 기록의 수정은 반영하지 않습니다. 새 실습 시트를 만들어 주세요."가 보입니다. 생산 수량은 그대로입니다.
2. 편집기에서 `processPendingRecords`를 실행합니다.
   - 확인: 그 칸이 20으로 돌아오고 그 알림이 목록에서 빠집니다.

## 6-19. 시트에 직접 기록 쓰기 (직접)

1. 생산 기록 탭의 빈 행 A칸에 `P-hand-1`, B칸에 `5`를 씁니다.
2. 발생 시각은 바로 위 행의 C칸(발생 시각)만 복사해 붙여 넣습니다. **A칸은 복사하지 않습니다.** A칸에는 원본 메모가 들어 있어 메모까지 옮겨집니다.
   - 확인: 화면 생산 카드가 "처리를 기다리는 기록이 있습니다."가 되고, 생산 기록 보기에서 그 행이 "접수 대기"입니다.
3. 편집기에서 `processPendingRecords`를 실행합니다.
   - 확인: 그 행의 접수 시각·처리 시각이 채워지고 처리 상태가 "완료"가 됩니다. 화면이 "생산 125개"가 됩니다.

## 6-20. 편집 트리거 함수

이제 편집기에서 손으로 실행하던 처리를 시트를 고치는 순간 자동으로 하게 합니다.

```text
gas/Code.gs에 설치형 편집 트리거가 부를 onEditInstalled(e)를 더해 주세요. 다른 함수와 다른 파일은 고치지 마세요.
e나 e.range가 없거나, e.source.getId()가 스크립트 속성 SPREADSHEET_ID와 다르면 아무것도 하지 않습니다. 그 밖에는 withLock_ 안에서 아래를 합니다.
편집한 탭이 "설정"이면 rememberSettings_()만 부르고 끝냅니다. 생산 기록·출고 기록 탭이 아니거나 편집한 범위의 첫 행이 1행이면 끝냅니다.
그 밖에는 편집한 범위의 첫 행부터 마지막 행까지 processRow_(탭, 행, true)를 부르고, 끝에 rememberSettings_()를 부릅니다.
```

- 확인: Antigravity가 함수를 더했다고 알려 줍니다.

## 6-21. 늦은 기록 검사 함수

```text
gas/Code.gs에 시간 트리거가 부를 checkRecordDelays()를 더해 주세요. withLock_ 안에서 data = readData_()로 지금 자료를 읽습니다.
TumbleCore.snapshot(data.records, data.settings, data.meta, alerts_(), null, data.now, data.errors)를 만들고, 그 incidents 가운데 scope가 "service"가 아닌 것마다 sendAlert_(사건의 id, alertMessage_(사건))를 부릅니다.
```

- 확인: Antigravity가 함수를 더했다고 알려 줍니다.

## 6-22. 트리거 설치 함수

```text
gas/Code.gs에 편집기에서 실행할 installTrainingTriggers()를 더해 주세요. 스크립트 속성 SPREADSHEET_ID가 없으면 throw Error("시트를 먼저 생성해 주세요.")입니다.
이 프로젝트의 트리거 가운데 실행 함수가 onEditInstalled나 checkRecordDelays인 것을 모두 지운 뒤 두 트리거를 새로 만듭니다.
ScriptApp.newTrigger("onEditInstalled").forSpreadsheet(SPREADSHEET_ID 값).onEdit().create()와 ScriptApp.newTrigger("checkRecordDelays").timeBased().everyMinutes(1).create()입니다. 여러 번 실행해도 트리거는 두 개만 남습니다.
```

- 확인: `gas\Code.gs` 끝에 `onEditInstalled`, `checkRecordDelays`, `installTrainingTriggers`가 있습니다.

## 6-23. 올리고 트리거 설치 (직접)

```powershell
npm.cmd run gas:push
```

1. 편집기 탭을 새로고침하고 `Code.gs`에서 `installTrainingTriggers`를 골라 실행합니다. 새 승인 창이 나오면 "모두 선택"으로 승인합니다.
2. 편집기 왼쪽 트리거(시계 모양) 메뉴를 엽니다.

- 확인: 트리거 목록에 두 줄이 있습니다. `onEditInstalled`(스프레드시트에서, 수정 시)와 `checkRecordDelays`(시간 기반)입니다. 목록에는 "시간 기반"으로만 보이고 1분 간격은 나오지 않습니다.
- 확인: `installTrainingTriggers`를 한 번 더 실행해도 두 줄만 남습니다.
- 새 시트를 만든 지 30분이 넘었으면 1~2분 안에 시험 채널에 "새 기록이 늦게 들어오고 있습니다." 알림이 올 수 있습니다. 정상입니다(6-25에서 봅니다).

## 6-24. 시트를 고치면 바로 처리되는지 확인 (직접)

1. 생산 기록 탭 빈 행에 `P-hand-2`, 수량 `5`를 쓰고, 발생 시각은 위 행의 C칸만 복사해 붙여 넣습니다.
   - 확인: 세 칸을 다 채우고 몇 초 안에 접수·처리 시각이 채워지고 처리 상태가 "완료"가 됩니다.
   - 칸을 하나씩 채우는 동안 처리 상태가 "입력 확인 필요"가 되고, 시험 채널에 "텀블공장: 수량은 1~10000의 정수입니다." 같은 입력 알림이 한 번 갈 수 있습니다. 세 칸을 다 채우면 "완료"로 바뀝니다.
2. `P-seed-0`의 수량을 25로 바꿉니다.
   - 확인: 몇 초 안에 20으로 돌아옵니다.
3. 설정 탭 `factory_target`을 `150`으로 바꿉니다.
   - 확인: 10~15초 안에 화면이 "목표 150개"가 됩니다. 확인했으면 `120`으로 되돌립니다.

- 설정 값에 범위를 벗어난 값(예: 목표에 글자)을 쓰면 화면이 바뀌지 않습니다. 편집기 왼쪽 실행 메뉴에서 `onEditInstalled`의 오류 문구(예: "목표는 양의 정수 또는 빈칸입니다.")를 보고 값을 고칩니다.

## 6-25. 늦은 기록 자동 알림 확인 (직접)

1. 설정 탭 `delay_minutes`를 `1`로 바꾸고 1~2분 기다립니다.
   - 확인: 화면 두 현장이 "새 기록이 늦게 들어오고 있습니다."가 되고, 시험 채널에 아래 두 알림이 옵니다. 알림 기록 탭에는 사건 ID `FACTORY-FEED`, `WAREHOUSE-FEED`로 남습니다.
     - "텀블공장: 새 기록이 늦게 들어오고 있습니다. 담당자: 기록 담당자 / 할 일: 시트의 기록과 처리 상태를 확인해 주세요."
     - "물류창고: 새 기록이 늦게 들어오고 있습니다. 담당자: 기록 담당자 / 할 일: 시트의 기록과 처리 상태를 확인해 주세요."
   - "텀블공장: 텀블공장: …"이나 "텀블공장: 물류창고: …"로 오면 6-4를 다시 붙여 넣고 `gas:push`합니다.
2. 편집기 왼쪽 실행 메뉴를 엽니다.
   - 확인: `checkRecordDelays`가 1분 간격으로, `onEditInstalled`가 시트를 고칠 때마다 실행된 줄이 보입니다.
3. `delay_minutes`를 `30`으로 되돌립니다.

- 같은 알림은 10분(`cooldown_minutes`) 안에는 다시 오지 않습니다.

## 6-26. 실습이 끝나면 트리거 지우기 (직접)

발표 준비(아래)를 마친 뒤 마지막에 합니다.

1. 편집기 왼쪽 트리거(시계 모양) 메뉴를 엽니다.
2. 두 줄 각각 오른쪽 점 세 개, "트리거 삭제", "완전삭제"를 누릅니다.

- 확인: 트리거 목록이 비었습니다.
- 지우지 않으면 수업 뒤에도 1분마다 실행되고, 현장이 확인 필요인 동안 10분마다 알림이 옵니다. 무료 Google 계정은 트리거 실행 시간에 하루 한도가 있습니다.
- 나중에 다시 쓰려면 `installTrainingTriggers`를 실행합니다. 새 실습 시트를 만든 뒤에도 다시 실행해야 합니다(편집 트리거는 만든 때의 시트에 걸립니다).

## 발표 준비

완성한 화면에서 아래 세 가지를 보여 줍니다. 캡처와 화면 공유에 웹훅 주소, GAS 웹 앱 주소, 시트 주소, 메일 주소가 보이지 않게 합니다.

1. **내 시트 값으로 도는 화면**: 오늘 운영 화면의 생산·출고 카드와 "조회 정상", 운영 상태 알림 카드의 "전송 성공".
2. **기록이 화면까지 오는 길**: 편집기에서 `addDemoProductionRecord`를 실행하고 10~15초 뒤 생산 수량이 10 오르는 것. 트리거를 지운 뒤에도 됩니다.
3. **자동 알림**: 6-25에서 시험 채널에 온 두 알림(캡처)과 알림 기록 탭의 `FACTORY-FEED`, `WAREHOUSE-FEED` 행.

- 덧붙일 이야기: 붙여 넣은 프롬프트 가운데 결과가 기대와 달랐던 것 하나와, 그때 보낸 수정 요청.

## 6회차 끝 확인

| 확인할 것 | 기대 결과 |
|---|---|
| 시험 알림 | 시험 채널에 "텀블공장: 알림 연결 테스트입니다.", 알림 기록 탭에 `sent`·`HTTP 200` |
| 화면 알림 카드 | "전송 성공", "알림 전송이 완료됐습니다." |
| 웹훅 주소 위치 | 스크립트 속성 `DISCORD_WEBHOOK_URL`에만 있고, `gas\Code.gs`와 시트에는 없음 |
| 편집기 기록 함수 | `addDemoProductionRecord`로 생산 수량이 10 오르고, `processPendingRecords`로 "처리 대기"·"접수 대기" 행이 "완료" |
| 접수한 기록 고치기 | 수량을 바꿔도 화면 값은 그대로, 처리하면 원래 값으로 돌아옴 |
| 트리거 두 개 | 시트를 고치면 몇 초 안에 처리, `delay_minutes` 1에서 두 현장 늦은 기록 알림이 1~2분 안에 옴 |
| 트리거 정리 | 실습 뒤 트리거 목록이 비어 있음 |
| `gas:redeploy` | 이번 회차에는 실행하지 않음, `public\config.js` 주소는 5회차 그대로 |
