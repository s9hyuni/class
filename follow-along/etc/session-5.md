지난 판(10-29, 한 번에 3~4줄 방식). 수업에는 쉬운판을 씁니다.

# 5회차: 내 구글 시트와 GAS 웹 앱

- 시작 상태: 4회차를 끝낸 `C:\ai-class\tumble-dashboard`에서 이어 합니다(완료 브랜치 `milestone-4`와 같은 출발점). 화면이 내 NestJS 서버(`http://127.0.0.1:3000`)의 값으로 "조회 정상"입니다. 4회차를 못 끝냈으면 회차 공통 안내대로 `milestone-4` 브랜치를 받습니다.
- 끝나면 되는 것
  - `public\config.js`의 `apiBaseUrl`이 내 Google Apps Script(GAS) 웹 앱 주소(`…/exec`로 끝남)이고 `timeoutMs`가 `15000`입니다. 이 두 값은 배포 명령이 적습니다.
  - 웹 앱이 내 Google 시트의 기록을 읽어, 화면이 4회차와 같은 배치로 나옵니다. 생산 기록 보기와 출고 기록 보기도 됩니다.
  - 4회차의 내 서버(`backend`)는 켜지 않아도 됩니다. 화면 코드(`public\app.js` 등)는 고치지 않습니다.
- 준비물: **개인 Google 계정**으로 로그인한 Chrome, 인터넷. 회사·학교 Google 계정은 관리자 정책으로 Apps Script API나 "로그인 없이 누구나" 웹 앱 배포가 막혀 있을 수 있습니다. 막히면 개인 계정으로 처음부터 합니다.

| 번호 | 하는 일 |
|---|---|
| 5-1 | Apps Script API 켜기 (직접) |
| 5-2 ~ 5-11 | clasp(Google이 만든 Apps Script 명령줄 도구) 명령 만들기 |
| 5-12 | clasp 로그인 (직접) |
| 5-13 ~ 5-37 | Google에서 돌아갈 코드(`gas\` 폴더) 만들기 |
| 5-38 ~ 5-43 | 올리기, 권한 승인과 실습 시트, 배포, 화면 확인 (직접) |
| 5-44 ~ 5-46 | 기록 조회를 더하고 다시 배포 |

## 시작 전에 (프롬프트 없이 직접 합니다)

1. Antigravity에서 `C:\ai-class\tumble-dashboard` 폴더를 엽니다.
2. 4회차 서버(`backend`)를 켜 둔 터미널이 있으면 Ctrl+C로 꺼도 됩니다. 이번 회차에는 쓰지 않습니다.
3. Chrome에서 수업에 쓸 개인 Google 계정으로 로그인해 둡니다. 이 회차의 Google 작업은 모두 이 계정 하나로 합니다.

## 진행 방법

- 프롬프트 블록은 하나씩, 첫 줄부터 끝 줄까지 그대로 복사해 Antigravity 대화창에 붙여 넣습니다. 앞 번호가 끝나기 전에 다음 번호를 보내지 않습니다.
- 제목에 (직접)이 붙은 단계는 Antigravity에 맡기지 않고 내가 Antigravity 아래쪽 터미널에 명령을 직접 칩니다. Google 로그인과 권한 승인도 내가 브라우저에서 직접 합니다.
- 5-13부터 만드는 `gas\` 폴더의 파일은 내 컴퓨터가 아니라 Google에서 실행됩니다. 일반 JavaScript로 쓰고 `import`, `require` 같은 Node.js 기능은 쓰지 않습니다. 5-39에서 Google에 올리기 전까지는 Antigravity가 "만들었다"고 알려 주는 것까지만 확인합니다.
- 화면 서버는 4회차와 같이 내가 직접 `npm.cmd start`로 켜고 http://127.0.0.1:4173 을 엽니다. 이번 회차에는 화면 코드가 바뀌지 않으니 화면 서버를 다시 켤 일은 없고 브라우저만 새로고침합니다.
- **꼭 지킬 것**: 웹 앱 주소를 아는 사람은 누구나 내 시트의 기록을 읽을 수 있습니다. 배포 주소와 그 주소가 든 `public\config.js`는 다른 사람에게 보내지 않고, 채팅·화면 공유·문서에 옮기지 않습니다. Antigravity 대화창에도 붙여 넣지 않습니다.

## 5-1. Apps Script API 켜기 (직접)

1. Chrome에서 개인 Google 계정으로 https://script.google.com/home/usersettings 를 엽니다.
2. "Google Apps Script API"를 사용(켜짐)으로 바꿉니다.

- 확인: 설정이 "사용"으로 보입니다.
- 이 설정이 꺼져 있으면 5-38 이후 명령이 `User has not enabled the Apps Script API`로 실패합니다. 그 문구가 나오면 이 단계를 다시 하고 1~2분 뒤 같은 명령을 다시 칩니다.

## 5-2. clasp 명령 파일의 틀

```text
scripts/gas-clasp.mjs를 Node.js 파일로 만들어 주세요. node scripts/gas-clasp.mjs create|deploy|redeploy|open 네 가지로 실행하는 파일입니다.
이번에는 틀만 만들고, 네 명령의 내용은 다음 단계부터 하나씩 채웁니다.
네 이름이 아닌 것으로 실행하면 "사용법: node scripts/gas-clasp.mjs create|deploy|redeploy|open"을 오류로 출력하고 종료 코드 1로 끝냅니다.
이 파일은 끝까지 주석과 빈 줄을 빼고 60줄 안으로 짧게 유지합니다. 다른 파일은 고치지 마세요.
```
- 확인: 터미널에서 `node scripts\gas-clasp.mjs`를 치면 `사용법: node scripts/gas-clasp.mjs create|deploy|redeploy|open`이 나오고 끝납니다.

## 5-3. clasp를 부르는 함수

```text
scripts/gas-clasp.mjs에 clasp를 부르는 함수를 하나 더해 주세요. clasp는 npx --yes @google/clasp@3.4.1 로 부릅니다.
Windows에서도 되도록 "npx " 뒤에 인자들을 공백으로 이은 한 줄 글자를 만들어 spawnSync에 shell: true로 넘기고, 출력(stdout, stderr)은 받아 둡니다.
받은 출력은 화면에 그대로 보여 주고, 둘을 이은 글자를 돌려줍니다. 이 함수가 공백이 든 인자만 큰따옴표로 감싸서 이어 붙입니다.
```
- 확인: Antigravity가 함수를 더했다고 알려 줍니다. 아직 아무것도 실행하지 않습니다.

## 5-4. npm 명령 일곱 개

```text
package.json의 scripts에 아래 일곱 개를 더해 주세요. 지금 있는 start와 check는 그대로 둡니다.
"gas:login": "npx --yes @google/clasp@3.4.1 login", "gas:push": "npx --yes @google/clasp@3.4.1 push --force", "gas:editor": "npx --yes @google/clasp@3.4.1 open-script"
"gas:create", "gas:deploy", "gas:redeploy", "gas:open"은 각각 "node scripts/gas-clasp.mjs create"(deploy, redeploy, open)로 둡니다.
.gitignore에 .clasp.json과 .runtime/ 줄이 없으면 더해 주세요. 있으면 그대로 둡니다.
```
- 확인: 터미널에서 `npm.cmd run`을 치면 목록에 `gas:login`, `gas:create`, `gas:push`, `gas:deploy`, `gas:redeploy`, `gas:open`, `gas:editor` 일곱 개가 보입니다.

## 5-5. 프로젝트 만들기 명령 1

```text
scripts/gas-clasp.mjs의 create를 채워 주세요. .runtime/gas-create 폴더를 지우고 빈 폴더로 다시 만든 뒤, clasp create-script --type standalone --title "텀블공장 개인 백엔드" --rootDir .runtime/gas-create 를 실행합니다.
--rootDir를 gas로 바로 주면 clasp가 gas 폴더를 기본 파일로 덮어쓰기 때문에, 빈 폴더에 먼저 만드는 것입니다.
출력에 Created new script가 없으면 "clasp가 프로젝트를 만들지 못했습니다. 위 출력을 확인하고, 로그인이 만료됐으면 npm.cmd run gas:login(macOS: npm run gas:login)을 다시 실행하세요."를 오류로 출력하고 종료 코드 1로 끝냅니다.
```
- 확인: Antigravity가 create를 채웠다고 알려 줍니다. 실행은 5-38에서 합니다.

## 5-6. 프로젝트 만들기 명령 2

```text
scripts/gas-clasp.mjs의 create가 성공하면 .clasp.json에서 rootDir 값만 "gas"로 바꾸고, 두 칸 들여쓰기 JSON 끝에 줄바꿈을 붙여 저장하게 해 주세요.
그다음 ".clasp.json이 gas 폴더를 가리키게 했습니다. 다음: npm.cmd run gas:push(macOS: npm run gas:push)"를 출력합니다.
.clasp.json은 아직 없으니 지금 열어 보지 않아도 됩니다.
```
- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 5-7. 배포 명령 1: 성공했을 때

```text
scripts/gas-clasp.mjs의 deploy를 채워 주세요. clasp create-deployment --description dashboard 를 실행하고, 출력에서 AKfyc로 시작하는 배포 ID(영문·숫자·_·-)를 모두 찾습니다.
같은 ID가 여러 번 나오면 하나로 셉니다. 서로 다른 ID가 정확히 하나일 때만 성공으로 봅니다. clasp는 실패해도 종료 코드 0으로 끝날 수 있기 때문입니다.
성공하면 public/config.js에서 apiBaseUrl 값을 https://script.google.com/macros/s/<배포 ID>/exec 로, timeoutMs 값을 15000으로 바꾸고 나머지 글자는 그대로 둡니다.
끝에 "public/config.js에 웹 앱 주소와 timeoutMs 15000을 적었습니다. 이 파일에는 내 웹 앱 주소가 들어가니 커밋하거나 남에게 보내지 마세요."를 출력합니다.
```
- 확인: Antigravity가 deploy를 채웠다고 알려 줍니다. `public\config.js`는 아직 그대로(`timeoutMs: 5000`)입니다.

## 5-8. 배포 명령 2: 하지 않을 때

```text
웹 앱 주소는 apiBaseUrl이 https://script.google.com/macros/s/ 뒤에 AKfyc로 시작하는 배포 ID가 오고 /exec로 끝날 때만 있다고 봅니다. 이 검사는 deploy, redeploy, open이 함께 씁니다.
deploy는 주소가 이미 있으면 clasp를 부르지 않고 "이미 배포 주소가 있습니다. npm.cmd run gas:redeploy(macOS: npm run gas:redeploy)로 갱신하세요."를 오류로 출력하고 종료 코드 1로 끝냅니다.
배포 ID가 하나가 아니면 config.js를 바꾸지 않고 "clasp 출력에서 배포 ID를 찾지 못했습니다. 위 출력을 확인하고, 로그인이 만료됐으면 npm.cmd run gas:login(macOS: npm run gas:login)을 다시 실행하세요."로 같은 방식으로 끝냅니다.
```
- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 5-9. 다시 배포 명령

```text
scripts/gas-clasp.mjs의 redeploy를 채워 주세요. 웹 앱 주소가 없으면 "public/config.js에 웹 앱 주소가 없습니다. 먼저 npm.cmd run gas:deploy(macOS: npm run gas:deploy)를 실행하세요."를 오류로 출력하고 종료 코드 1로 끝냅니다.
있으면 주소에서 배포 ID를 꺼내 clasp update-deployment <배포 ID> --description dashboard 를 실행합니다. 새 배포를 만들지 않으니 주소는 그대로입니다.
출력에 "Redeployed <배포 ID> @"가 있으면 "같은 배포를 새 버전으로 갱신했습니다. 주소는 그대로입니다."를 출력하고, 없으면 deploy의 "배포 ID를 찾지 못했습니다" 문구와 같은 문구로 실패합니다.
```
- 확인: 터미널에서 `npm.cmd run gas:redeploy`를 치면 `public/config.js에 웹 앱 주소가 없습니다. …`가 나오고 끝납니다. 아직 배포하지 않았으니 정상입니다(npm이 종료 코드 1을 알리는 줄이 더 나와도 괜찮습니다).

## 5-10. 웹 앱 열기 명령

```text
scripts/gas-clasp.mjs의 open을 채워 주세요. 웹 앱 주소가 없으면 redeploy와 같은 "웹 앱 주소가 없습니다" 문구로 실패합니다.
있으면 "브라우저로 엽니다. JSON이 보이면 웹 앱이 동작합니다."를 출력하고, 다음 줄에 그 주소 뒤에 ?path=/api/v1/snapshot을 붙인 주소를 출력합니다.
그 주소를 기본 브라우저로 엽니다. Windows는 start "", macOS는 open, 그 밖은 xdg-open을 셸로 부릅니다.
```
- 확인: 터미널에서 `npm.cmd run gas:open`을 치면 `public/config.js에 웹 앱 주소가 없습니다. …`가 나오고 끝납니다.

## 5-11. clasp 명령 파일 점검

```text
scripts/gas-clasp.mjs를 읽고, 주석과 빈 줄을 뺀 코드 줄 수와 아래 글자가 파일에 모두 있는지만 알려 주세요. 파일은 고치지 마세요.
shell: true / standalone / .runtime/gas-create / Created new script / create-deployment / update-deployment / Redeployed / ?path=/api/v1/snapshot
```
- 확인: 코드 줄이 60줄 이하이고, 여덟 글자가 모두 있다고 나옵니다. 빠진 글자가 있으면 그 글자가 나온 단계(5-3 ~ 5-10)의 프롬프트를 다시 붙여 넣습니다.
- 60줄이 넘으면 "동작과 문구는 그대로 두고, 주석과 빈 줄을 뺀 코드를 60줄 안으로 줄여 주세요."라고 요청한 뒤 이 단계를 다시 붙여 넣습니다.
- 확인: `public\config.js`는 아직 4회차 그대로(`http://127.0.0.1:3000`, `timeoutMs: 5000`)입니다.

## 5-12. clasp 로그인 (직접)

```powershell
npm.cmd run gas:login
```
- 처음 실행하면 clasp를 내려받느라 시간이 조금 걸립니다(인터넷 필요).
- 기본 브라우저가 열리면 5-1과 같은 개인 Google 계정을 고르고 허용합니다. "확인하지 않은 앱" 경고가 나오면 clasp가 맞는지 보고 계속 진행합니다. 브라우저가 열리지 않으면 터미널에 나온 주소를 직접 엽니다.
- 확인: 터미널에 로그인됐다는 문구가 나오고 명령이 끝납니다. 끝났다는 글이 나온 브라우저 탭은 닫습니다.
- 어느 계정으로 로그인됐는지는 5-40에서 편집기 오른쪽 위로 확인합니다. 다른 계정이면 이 명령을 다시 쳐서 바른 계정을 고릅니다.

## 5-13. 웹 앱 설정 파일

```text
gas 폴더를 만들고 gas/appsscript.json을 아래 내용 그대로, 두 칸 들여쓰기로 만들어 주세요. gas 폴더의 파일은 Google Apps Script에서 실행되는 일반 JavaScript이고, 다른 파일은 고치지 마세요.
{"timeZone": "Asia/Seoul", "runtimeVersion": "V8", "exceptionLogging": "STACKDRIVER", "oauthScopes": ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/script.external_request", "https://www.googleapis.com/auth/script.scriptapp"], "webapp": {"access": "ANYONE_ANONYMOUS", "executeAs": "USER_DEPLOYING"}}
```
- 확인: 왼쪽 파일 목록에 `gas\appsscript.json`이 생기고, 안에 `ANYONE_ANONYMOUS`와 `USER_DEPLOYING`이 있습니다. 이 두 값이 다르면 화면이 로그인 없이 웹 앱을 부르지 못합니다.
- 권한 세 가지(시트, 외부 서비스 연결, 트리거)를 지금 적어 두면 5-40에서 한 번에 승인합니다. 뒤의 두 권한은 6회차에 씁니다.

## 5-14. 다섯 함수 1: 행 읽기와 합계

여러 GAS 파일이 함께 쓰는 작은 함수 다섯 개를 `gas\Exercises.gs`에 두 번에 나눠 만듭니다.

```text
gas/Exercises.gs를 만들고 다른 GAS 파일이 함께 쓸 함수 두 개를 일반 JavaScript로 넣어 주세요. 이름 끝의 _는 편집기 실행 목록에서 숨기는 표시이므로 이름을 글자 그대로 씁니다.
readRecordRows_(sheet): sheet.getDataRange().getValues()에서 첫 행(머리글)을 뺀 행 배열을 돌려줍니다.
sumQuantities_(records): 기록마다 quantity를 더한 합을 돌려줍니다. 빈 배열이면 0입니다.
```
- 확인: 왼쪽 파일 목록에 `gas\Exercises.gs`가 생깁니다.

## 5-15. 다섯 함수 2: 시간별 합, 늦음 판단, 알림 문장

```text
gas/Exercises.gs에 함수 세 개를 더해 주세요. 앞의 두 함수는 고치지 마세요.
groupHourly_(records): 기록의 occurredAt을 UTC 정시로 내린 ISO 글자(예: "2026-10-26T01:00:00.000Z")를 키로, 그 시간 quantity 합을 값으로 하는 객체를 돌려줍니다.
isDelayed_(latest, at, minutes): latest가 있고, at에서 latest.occurredAt을 뺀 시간이 minutes분보다 길면 true, 아니면 false입니다.
alertMessage_(incident): incident.title + " 담당자: " + incident.owner + " / 할 일: " + incident.action을 돌려줍니다.
```
- 확인: `Exercises.gs`에 함수 다섯 개(`readRecordRows_`, `sumQuantities_`, `groupHourly_`, `isDelayed_`, `alertMessage_`)가 있고, `import`, `export`, `require`나 `: string` 같은 형 표시가 없습니다. 있으면 "TypeScript 문법을 빼고 일반 JavaScript로 바꿔 주세요."라고 요청합니다.

## 5-16. 계산 모음 1: 시각 검사와 한국 날짜

```text
gas/Core.gs를 만들고, Google 서비스(SpreadsheetApp, PropertiesService 등)를 쓰지 않는 계산 함수를 TumbleCore 하나에 모아 주세요. var TumbleCore = (function () { (함수들) return { iso: iso, day: day }; })(); 꼴의 일반 JavaScript입니다.
iso(value): Date면 먼저 toISOString()으로 바꿉니다. 글자가 아니거나, /^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/에 맞지 않거나, Date.parse로 읽을 수 없으면 throw Error("시간대를 포함한 시각을 입력해 주세요.")입니다. 통과하면 new Date(value).toISOString()을 돌려줍니다.
day(value): Date.parse(value)에 9시간을 더한 시각의 toISOString() 앞 10자, 곧 한국 날짜 "YYYY-MM-DD"를 돌려줍니다.
```
- 확인: 왼쪽 파일 목록에 `gas\Core.gs`가 생기고, 파일 안에 `SpreadsheetApp`이 없습니다.

## 5-17. 계산 모음 2: 기준 시각

```text
gas/Core.gs의 TumbleCore에 view(at, now)를 더하고, 돌려주는 객체에도 넣어 주세요. 다른 함수는 고치지 마세요.
now는 iso(now)로 바꾸고, at이 있으면 iso(at), 없으면 now를 기준 시각으로 씁니다.
기준 시각의 한국 날짜(day)가 now와 다르거나 기준 시각이 now보다 늦으면 throw Error("오늘의 현재 이전 시각을 선택해 주세요."), 아니면 기준 시각을 돌려줍니다.
```
- 확인: `Core.gs` 마지막 `return` 객체에 `view`가 더해졌습니다.

## 5-18. 계산 모음 3: 시트 행 읽기와 기록 ID

```text
gas/Core.gs의 TumbleCore에 parse(rows, kind, now)를 더하고 돌려주는 객체에도 넣어 주세요. 시트 행 배열을 { records, errors }로 바꿉니다. 행의 칸 순서는 기록 ID, 수량, 발생 시각, 접수 시각, 처리 시각, 처리 상태입니다.
모든 칸이 빈 글자나 null인 행은 건너뜁니다. 행에 문제가 있으면 errors에 { row: 배열 순번 + 2, message: 오류 문구 }를 넣고 다음 행으로 갑니다. 통과한 행은 records에 { id, kind, quantity, occurredAt, receivedAt, processedAt }로 넣습니다.
이번에는 기록 ID만 검사합니다. 첫 칸이 null이나 undefined면 빈 글자, 아니면 String(첫 칸)이 ID입니다(숫자 0도 "0"). /^[A-Za-z0-9_-]{1,100}$/에 맞지 않거나 앞 행에서 나온 ID면 "고유한 영문·숫자 기록 ID가 필요합니다."입니다.
나온 ID는 new Set()에 모아 has와 add로 확인하고, ID 검사를 통과하면 그 자리에서 바로 넣습니다. 나머지 칸 검사는 다음 단계에서 더합니다.
```
- 확인: `parse` 안에 `new Set()`이 있고, 기록 ID를 `String(row[0] || "")`처럼 만들지 않았습니다. 그렇게 만들어졌으면 "기록 ID는 첫 칸이 null이나 undefined일 때만 빈 글자로 만들어 주세요."라고 요청합니다.

## 5-19. 계산 모음 4: 수량과 시각 검사

```text
gas/Core.gs의 parse에서 기록 ID 다음에 아래 검사를 차례로 더해 주세요. 오류 문구는 글자 그대로 씁니다.
수량: 칸이 글자나 숫자가 아니거나 빈 칸이거나, Number로 바꾼 값이 1~10000의 정수(Number.isSafeInteger)가 아니면 "수량은 1~10000의 정수입니다." 기록의 quantity는 Number(수량)입니다.
시각: 발생 시각은 iso로 바꾸고, 접수·처리 시각은 값이 있을 때만 iso로 바꿉니다(없으면 null). iso의 오류 문구는 그대로 씁니다.
순서: 발생 시각이 now보다 늦거나, 접수 시각이 발생 시각보다 이르거나 now보다 늦거나, 처리 시각이 있는데 접수 시각이 없거나 접수 시각보다 이르거나 now보다 늦으면 "발생·접수·처리 시각의 순서를 확인해 주세요."
```
- 확인: `Core.gs`에 "수량은 1~10000의 정수입니다."와 "발생·접수·처리 시각의 순서를 확인해 주세요."가 글자 그대로 있습니다.

## 5-20. 계산 모음 5: 기록 고르기 구간

```text
gas/Core.gs의 TumbleCore에 recordsAt(records, kind, at, from, to)를 더하고 돌려주는 객체에도 넣어 주세요. 기준 시각 at까지 보이는 기록을 고르는 함수입니다.
kind가 "production"이나 "shipment"가 아니면 "생산 또는 출고를 선택해 주세요."입니다. 시작은 from이 있으면 iso(from), 없으면 iso(day(at) + "T00:00:00+09:00")이고, 끝은 to가 있으면 iso(to), 없으면 at입니다.
시작이나 끝의 한국 날짜가 at과 다르거나, 시작이 끝보다 늦거나, 끝이 at보다 늦으면 "조회 시간 구간을 확인해 주세요."입니다.
```
- 확인: `Core.gs`에 `T00:00:00+09:00`이 있습니다. 하루의 시작을 한국 시각 0시로 잡는 곳입니다.

## 5-21. 계산 모음 6: 기록 고르기 결과

```text
gas/Core.gs의 recordsAt이 돌려줄 목록을 만들어 주세요. 그 kind이고 발생 시각이 시작 이상 끝 이하인 기록을 발생 시각 순으로 정렬해 { id, kind, quantity, occurredAt, receivedAt, processedAt, status }로 돌려줍니다.
이때 at보다 늦은 접수·처리 시각은 null로 바꿉니다. status는 처리 시각이 있으면 "completed", 접수 시각만 있으면 "processing-wait", 둘 다 없으면 "receipt-wait"입니다.
```
- 확인: `Core.gs` 마지막 `return` 객체에 `iso`, `day`, `view`, `parse`, `recordsAt` 다섯 개가 있습니다.

## 5-22. 오늘 운영 계산 1: 현장별 재료

다음 다섯 단계는 오늘 운영 화면이 받는 JSON을 만드는 `snapshot`입니다. 1~4회차 화면이 받던 것과 같은 모양입니다.

```text
gas/Core.gs의 TumbleCore에 snapshot(records, settings, meta, alerts, at, now, errors)를 더하고 돌려주는 객체에도 넣어 주세요. Exercises.gs의 sumQuantities_, groupHourly_, isDelayed_를 그대로 부르고, 같은 계산을 새로 만들지 않습니다.
기준 시각 cutoff는 view(at, now)입니다. factory(kind "production")를 먼저, warehouse(kind "shipment")를 다음에 계산합니다.
현장마다 rows = recordsAt(records, kind, cutoff), latest = rows의 마지막 기록, completed = 처리 시각이 있는 기록입니다.
pending은 처리 시각이 없는 기록이 하나라도 있는지, paused는 pending이면서 settings의 factory_paused(창고는 warehouse_paused)가 true인지, stale은 isDelayed_(latest, cutoff, settings.delay_minutes)입니다.
```
- 확인: Antigravity가 `snapshot`을 더했다고 알려 줍니다.

## 5-23. 오늘 운영 계산 2: 안내 문구와 수량

```text
gas/Core.gs의 snapshot에서 현장 안내 문구 note를 정해 주세요. 차례로 latest가 없으면 "기록이 없습니다.", paused면 "기록 처리가 일시 정지됐습니다.", pending이면 "처리를 기다리는 기록이 있습니다.", stale이면 "새 기록이 늦게 들어오고 있습니다.", 아니면 "기록이 반영되고 있습니다."입니다.
sites.factory와 sites.warehouse에 label "텀블공장"(창고는 "물류창고"), target은 settings의 factory_target(창고는 warehouse_target), completed는 completed가 있으면 sumQuantities_(completed), 없으면 null을 넣습니다.
lastEventAt, receivedAt, processedAt은 latest의 occurredAt, receivedAt, processedAt입니다(latest가 없으면 셋 다 null).
```
- 확인: `Core.gs`에 안내 문구 다섯 개가 글자 그대로 있습니다.

## 5-24. 오늘 운영 계산 3: 상태, 그래프, 사진

```text
gas/Core.gs의 snapshot에서 sites의 각 현장에 아래 필드를 더해 주세요. 문구는 글자 그대로 씁니다.
processingState: paused면 "paused", pending이거나 latest가 없으면 "waiting", 아니면 "completed". status: latest가 없거나 pending이거나 stale이면 "warning", 아니면 "normal". note: 앞에서 정한 문구.
history: groupHourly_(completed)의 키를 정렬해 { timestamp: 키, quantity: 그 시간 합 } 배열로 만듭니다.
image: { url: "./assets/approved/factory.png", alt: "공장 생산 참고 사진" }(창고는 "./assets/approved/warehouse.png", "창고 출고 참고 사진")
```
- 확인: `Core.gs`에 `./assets/approved/`가 글자 그대로 있습니다.

## 5-25. 오늘 운영 계산 4: 확인할 일

```text
gas/Core.gs의 snapshot에서 incidents(빈 배열에서 시작)를 이 순서로 채워 주세요. 현장 status가 "warning"이면 { id: "FACTORY-FEED"(창고는 "WAREHOUSE-FEED"), scope: "factory"(창고는 "warehouse"), level: "warning", title: label + ": " + note, owner: "기록 담당자", action: "시트의 기록과 처리 상태를 확인해 주세요." }
errors에 항목이 있으면 { id: "INPUT-ERROR", scope: "service", level: "warning", title: "입력값을 확인할 기록이 있습니다.", owner: "기록 담당자", action: 오류마다 sheet + " " + row + "행: " + message를 만들어 " / "로 이은 글자 }
alerts(항목은 { at, status, message }) 가운데 at이 cutoff와 같거나 이른 것의 마지막을 last라 합니다. last.status가 "failed"면 { id: "ALERT-DELIVERY", scope: "service", level: "error", title: "알림 전송에 실패했습니다.", owner: "서비스 담당자", action: "알림 기록과 웹훅 설정을 확인해 주세요." }
```
- 확인: `Core.gs`에 "시트의 기록과 처리 상태를 확인해 주세요."가 글자 그대로 있습니다.

## 5-26. 오늘 운영 계산 5: 돌려주는 모양

```text
gas/Core.gs의 snapshot이 돌려주는 객체를 만들어 주세요. { schemaVersion: 1, scenarioId: "normal", revision: meta.revision, changedAt: meta.changedAt, serverTime: iso(now), viewTime: cutoff, mode: at이 있으면 "past" 아니면 "current", sessionId: meta.sessionId, trainingOnly: true, sites, services, incidents }입니다.
services는 { api: { status: "normal", note: "시트 조회가 가능합니다." }, alerts: { status: last가 있으면 last.status 아니면 "unknown", lastAttemptAt: last가 있으면 last.at 아니면 null, note: last가 있으면 last.message 아니면 "알림 발송 기록이 없습니다." } }입니다.
```
- 확인: `Core.gs` 마지막 `return` 객체에 `snapshot`이 더해져 여섯 개(`iso`, `day`, `view`, `parse`, `recordsAt`, `snapshot`)입니다. "시트 조회가 가능합니다."와 "알림 발송 기록이 없습니다."가 글자 그대로 있습니다.

## 5-27. 시트 도구 1: 이름표와 시트 열기

```text
gas/Code.gs를 만들고 시트를 여는 공통 도구를 일반 JavaScript로 넣어 주세요. 이름은 다른 파일에서 부르므로 글자 그대로 씁니다. 웹 앱 진입점(doGet)은 나중에 만듭니다.
전역 변수 두 개: var TUMBLE_SHEETS = { production: "생산 기록", shipment: "출고 기록", settings: "설정", alerts: "알림 기록" }; var TUMBLE_HEADERS = ["기록 ID", "수량", "발생 시각", "접수 시각", "처리 시각", "처리 상태"];
properties_(): PropertiesService.getScriptProperties()를 돌려줍니다.
spreadsheet_(): 스크립트 속성 SPREADSHEET_ID의 시트 파일을 돌려줍니다. 값이 없으면 throw Error("먼저 createTrainingSpreadsheet를 실행해 주세요."). 전역 var opened_ = null에 { id, file }로 기억해 같은 ID면 다시 열지 않고, SpreadsheetApp.openById는 이 함수 안에서만 부릅니다.
```
- 확인: 왼쪽 파일 목록에 `gas\Code.gs`가 생기고, `SpreadsheetApp.openById`가 `spreadsheet_` 안 한 곳에만 있습니다.

## 5-28. 시트 도구 2: 칸 값 바꾸기와 행 읽기

```text
gas/Code.gs에 칸 값을 바꾸는 도구를 더해 주세요. Sheets는 "2026-10-20T01:00:00.000Z"처럼 숫자로 시작하는 글자를 날짜로 바꾸므로, 글자 그대로 남기려는 것입니다.
var KEEP_AS_TEXT_ = /^[0-9=+\-@]/; 를 두고, toCell_(value)는 글자이고 KEEP_AS_TEXT_에 맞으면 앞에 '를 붙여, 아니면 그대로 돌려줍니다. toRow_(row)는 칸마다 toCell_을 적용한 배열을 돌려줍니다.
fromCell_(value)는 Date면 toISOString()을, '로 시작하고 그 뒤 글자가 KEEP_AS_TEXT_에 맞으면 '를 뗀 글자를, 아니면 그대로 돌려줍니다.
rows_(name)은 spreadsheet_()에서 이름이 name인 탭을 readRecordRows_로 읽고, 칸마다 fromCell_을 적용한 행 배열을 돌려줍니다.
```
- 확인: `KEEP_AS_TEXT_`에 숫자 말고 `=`, `+`, `-`, `@`도 들어 있습니다. 이 글자로 시작하는 값도 Sheets가 수식이나 숫자로 바꾸기 때문입니다.

## 5-29. 시트 도구 3: 설정과 처음 정보 읽기

```text
gas/Code.gs에 settings_()와 meta_()를 더해 주세요. settings_()는 6회차에서 쓰니 이번 회차에는 다른 곳에서 부르지 마세요. 오류는 throw Error("문구")로 내고 문구는 글자 그대로 씁니다.
settings_(): rows_("설정")의 행을 { 첫 칸: 둘째 칸 } 객체로 모읍니다. factory_target·warehouse_target은 빈 글자·null·undefined면 null, 아니면 Number로 바꾸고, 1 이상의 정수(Number.isSafeInteger)가 아니면 "목표는 양의 정수 또는 빈칸입니다."
delay_minutes·cooldown_minutes는 Number로 바꾸고, 유한한 숫자가 아니거나 1~1440 밖이면 "대기 기준은 1~1440분입니다." factory_paused·warehouse_paused는 true, false, "TRUE", "FALSE"가 아니면 "처리 정지는 TRUE 또는 FALSE입니다.", 맞으면 true와 "TRUE"만 true로 바꿉니다.
meta_(): 스크립트 속성 TUMBLE_META의 JSON 글자를 객체로 돌려줍니다. 없으면 "초기 자료가 없습니다."입니다.
```
- 확인: 설정 이름이 `factory_target`, `delay_minutes`처럼 밑줄 이름입니다. `factoryTarget`처럼 바뀌었으면 5-32에서 만드는 설정 탭과 맞지 않으니 밑줄 이름으로 바꿔 달라고 요청합니다.

## 5-30. 실습 시트 만들기 1: 파일과 탭

```text
gas/Setup.gs에 편집기에서 실행할 createTrainingSpreadsheet 함수를 일반 JavaScript로 만들어 주세요. 실행할 때마다 새 실습 시트 파일을 만들고, 이전 시트는 지우거나 덮어쓰지 않습니다. Code.gs와 Core.gs의 이름을 그대로 씁니다.
SpreadsheetApp.create("텀블공장 개인 실습 " + 지금 ISO 시각)으로 만들고 setSpreadsheetTimeZone("Asia/Seoul")로 시간대를 둡니다. 첫 탭 이름을 "생산 기록"으로 바꾸고 "출고 기록", "설정", "알림 기록" 탭을 차례로 더합니다(이름은 TUMBLE_SHEETS 값).
만든 파일의 ID를 properties_()의 스크립트 속성 SPREADSHEET_ID에 저장합니다.
```
- 확인: 왼쪽 파일 목록에 `gas\Setup.gs`가 생기고, 안에 `Asia/Seoul`이 있습니다. 시트에 날짜를 직접 쓸 때 한국 시각으로 읽게 합니다.

## 5-31. 실습 시트 만들기 2: 시드 기록

```text
gas/Setup.gs의 createTrainingSpreadsheet에 시드 기록을 더해 주세요. now = Date.now(), 오늘 한국 0시 midnight = Date.parse(TumbleCore.day(new Date(now).toISOString()) + "T00:00:00+09:00")입니다.
생산 기록·출고 기록 탭마다 첫 행에 TUMBLE_HEADERS를 넣고 i = 0부터 4까지 5행을 넣습니다. happened = midnight + Math.floor((now - midnight) * (i + 1) / 5), gap = Math.min(2000, Math.floor((now - happened) / 2))입니다.
행 = ["P-seed-" + i(출고는 "S-seed-" + i), 수량 20(출고는 15), happened의 ISO 시각, happened + gap의 ISO 시각, Math.min(now, happened + gap * 2)의 ISO 시각, "완료"]입니다.
행을 toRow_로 바꿔 appendRow로 넣고, 그 행의 A칸 메모(setNote)에는 바꾸기 전 행을 JSON.stringify한 글자를 씁니다. 이 메모가 접수한 기록의 원본입니다.
```
- 확인: 시드 기록 ID가 `"P-seed-" + i`, `"S-seed-" + i`이고 `i`가 0부터 시작합니다.

## 5-32. 실습 시트 만들기 3: 설정과 마무리

```text
gas/Setup.gs의 createTrainingSpreadsheet를 마무리해 주세요. 설정 탭에는 첫 행 "설정 이름", "값" 아래에 factory_target 120, warehouse_target 100, delay_minutes 30, cooldown_minutes 10, factory_paused false, warehouse_paused false를 한 행씩 숫자·불리언 그대로 씁니다.
설정 탭 A1 메모에는 설정 이력 JSON [{ at: midnight의 ISO 시각, revision: 1, settings: 위 여섯 값의 객체 }]를 씁니다. 알림 기록 탭 첫 행은 "시각", "사건 ID", "내용", "발송 상태", "상세"입니다.
네 탭 모두 첫 행을 고정하고(setFrozenRows(1)) 1열부터 마지막 열까지 너비를 내용에 맞춥니다(autoResizeColumns).
스크립트 속성 TUMBLE_META에 { sessionId: Utilities.getUuid(), revision: 1, changedAt: now의 ISO 시각 }을 JSON 글자로 저장하고, Logger.log("새 실습 시트: " + 시트 주소)를 남긴 뒤 시트 주소를 돌려줍니다.
```
- 확인: `Setup.gs`에 `setNote`가 두 곳(시드 행 A칸, 설정 탭 A1)에 있습니다.

## 5-33. 웹 앱 1: 응답 도구와 알림 기록 읽기

```text
gas/Code.gs에 웹 앱이 쓸 도구 두 개를 더해 주세요. 지금 있는 함수는 고치지 마세요.
json_(value): ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON)을 돌려줍니다. { ok, data } 같은 봉투로 감싸지 않습니다.
alerts_(): rows_("알림 기록")에서 첫 칸이 있는 행만 { at: TumbleCore.iso(첫 칸), status: 넷째 칸, message: 셋째 칸 }으로 바꿔 돌려줍니다.
```
- 확인: `Code.gs`에 `ContentService`가 있고, `{ ok:`나 `data:`로 응답을 감싸는 코드가 없습니다.

## 5-34. 웹 앱 2: 기록 탭 읽기

```text
gas/Code.gs에 readData_(at, kinds)를 더해 주세요. now = 지금 ISO 시각, cutoff = TumbleCore.view(at, now), meta = meta_()이고, kinds가 없으면 ["production", "shipment"]입니다.
kind마다 TUMBLE_SHEETS의 탭을 rows_로 읽고, 같은 탭의 getDataRange().getNotes()에서 첫 행을 뺀 A열 메모를 행과 짝짓습니다. 행마다 앞 여섯 칸(slice(0, 6))만 보고, 아래 규칙으로 고른 여섯 칸을 그 탭의 배열 chosen에 모읍니다(다음 단계에서 씁니다). G열부터는 읽지도 비교하지도 않습니다.
메모가 없는 행은 아직 접수하지 않은 기록이라, 여섯 칸을 복사해 접수 시각(4번째 칸)과 처리 시각(5번째 칸)을 빈 글자로 바꿔 씁니다.
메모가 있는 행은 메모의 JSON 배열(접수한 원본)을 씁니다. 여섯 칸을 String(행의 칸) === String(원본의 같은 칸)으로 비교해 하나라도 다르면 errors에 { sheet: 탭 이름, row: 시트 행 번호, message: "접수한 기록의 수정은 반영하지 않습니다. 새 실습 시트를 만들어 주세요." }를 넣습니다.
```
- 확인: `Code.gs`에 `getNotes`와 `slice(0, 6)`이 있습니다. 행 전체를 비교하게 만들어졌으면 "수정 감지는 앞 여섯 칸만 비교해 주세요."라고 요청합니다.

## 5-35. 웹 앱 3: 기록과 설정 이력 고르기

```text
gas/Code.gs의 readData_를 마무리해 주세요. 탭마다 chosen을 TumbleCore.parse(chosen, kind, now)로 기록으로 바꾸고, parse의 errors도 { sheet: 탭 이름, row, message }로 errors에 더합니다.
설정은 설정 탭 A1 메모의 설정 이력(JSON 배열, 메모가 없으면 빈 배열)에서 at이 cutoff와 같거나 이른 항목의 마지막을 씁니다. 없으면 throw Error("이 시점의 설정 자료가 없습니다.")입니다.
{ now, at: cutoff, records, errors, settings: 그 항목의 settings, meta: { sessionId: meta.sessionId, revision: 그 항목의 revision, changedAt: 그 항목의 at } }을 돌려줍니다.
```
- 확인: `Code.gs`에 "이 시점의 설정 자료가 없습니다."가 글자 그대로 있습니다.

## 5-36. 웹 앱 4: 진입점 doGet

```text
gas/Code.gs에 웹 앱 진입점 doGet(e)를 더해 주세요. 화면은 경로를 path 매개변수로 넘깁니다(주소/exec?path=/api/v1/snapshot&at=시각). e.parameter(없으면 빈 객체)의 path를 글자로 바꿔 앞뒤의 /를 모두 떼고 비교합니다.
path가 "api/v1/snapshot"이면 data = readData_(at)으로 읽고 json_(TumbleCore.snapshot(data.records, data.settings, data.meta, alerts_(), at, data.now, 입력 오류))를 돌려줍니다. at은 e.parameter.at이고, 입력 오류는 at이 없을 때만 data.errors, 있으면 빈 배열입니다.
그 밖의 path는 throw Error("웹 앱 주소 뒤에 ?path=/api/v1/snapshot 또는 ?path=/api/v1/records를 붙여 주세요.")입니다. records 경로는 나중에 따로 더하므로 지금은 만들지 않습니다.
웹 앱은 상태 코드를 정할 수 없으므로 모든 오류를 잡아 json_({ error: 오류 문구 })로 돌려줍니다.
```
- 확인: `Code.gs`에 `doGet`이 있고, path를 `"api/v1/records"`와 비교하는 코드는 아직 없습니다. 오류 문구 안의 `?path=/api/v1/records`는 있어야 맞습니다. 만들어졌으면 "records 경로 처리는 빼 주세요. 오류 문구는 그대로 둡니다."라고 요청합니다. 5-44에서 더합니다.

## 5-37. 올리기 전 점검

```text
gas 폴더의 다섯 파일(appsscript.json, Exercises.gs, Core.gs, Code.gs, Setup.gs)을 읽고 아래 두 가지만 알려 주세요. 파일은 고치지 마세요.
1. import, export, require, TypeScript 형 표시(: string 같은 것)가 있는 곳
2. 다른 파일에서 부르는데 gas 폴더 어디에도 만들어지지 않은 이름
```
- 확인: 두 가지 모두 "없음"이라고 나옵니다. 있다고 나오면 "그 부분만 일반 JavaScript로 고쳐 주세요." 또는 "빠진 이름을 만든 단계의 설명대로 더해 주세요."라고 요청합니다.
- `gas\` 안에 파일이 정확히 다섯 개입니다.

## 5-38. 프로젝트 만들기 (직접)

```powershell
npm.cmd run gas:create
```
- 확인: clasp 출력에 `Created new script`가 있고, 이어서 `.clasp.json이 gas 폴더를 가리키게 했습니다. 다음: npm.cmd run gas:push(macOS: npm run gas:push)`가 나옵니다.
- 확인: `notepad .clasp.json`으로 열면 `"rootDir": "gas"`가 보입니다. 확인했으면 메모장을 닫습니다(Antigravity에게 이 파일을 열게 하지 않습니다).
- `gas\` 안의 다섯 파일이 그대로인지 봅니다. `Code.gs`가 빈 `myFunction`으로 바뀌었으면 5-5의 조건이 빠진 것입니다. Antigravity의 되돌리기로 복구하고 5-5를 다시 붙여 넣습니다.
- `clasp가 프로젝트를 만들지 못했습니다`가 나오면 그 위의 clasp 출력을 봅니다. `invalid_grant`처럼 로그인 문제면 5-12를 다시 합니다.
- `Project file already exists.`가 나오면 이미 만든 프로젝트가 있는 것입니다. 그대로 5-39로 갑니다. 이 명령은 한 번만 칩니다.

## 5-39. 코드 올리기 (직접)

```powershell
npm.cmd run gas:push
```
- 확인: `Pushed 5 files`와 `gas/appsscript.json`, `gas/Code.gs`, `gas/Core.gs`, `gas/Exercises.gs`, `gas/Setup.gs` 목록이 나옵니다(순서는 다를 수 있습니다).
- `public/app.js`처럼 `gas\` 밖의 파일이 목록에 있으면 `.clasp.json`의 `rootDir`가 `gas`가 아닌 것입니다. 5-38의 확인으로 돌아갑니다.
- `Syntax error`가 나오면 그 줄을 Antigravity에 붙여 넣고 "이 오류가 난 파일만 고쳐 주세요. 일반 JavaScript로 씁니다."라고 요청한 뒤 이 명령을 다시 칩니다.

## 5-40. 첫 권한 승인과 실습 시트 만들기 (직접)

이 승인을 하기 전에는 웹 앱이 응답하지 않고, 화면에는 연결 실패로 보입니다.

```powershell
npm.cmd run gas:editor
```
1. 브라우저에 Apps Script 편집기가 열립니다. 열리지 않으면 터미널에 나온 편집기 주소를 직접 엽니다. 다른 계정으로 열렸으면 오른쪽 위에서 계정을 바꿉니다.
2. 왼쪽 파일 목록에서 `Setup.gs`를 누르고, 위쪽 함수 선택에 `createTrainingSpreadsheet`가 잡혔는지 봅니다(아니면 직접 고릅니다). "실행"을 누릅니다.
3. "승인 필요" 창에서 "권한 검토"를 누르고 개인 계정을 고릅니다. "Google에서 확인하지 않은 앱" 화면이 나오면 "고급", "텀블공장 개인 백엔드(으)로 이동" 순서로 누릅니다. 내가 올린 코드라서 나오는 화면입니다.
4. 권한 목록의 세 줄("모든 Google Sheets 스프레드시트 확인, 수정, 생성, 삭제", "외부 서비스에 연결", "부재중에 이 애플리케이션을 실행하도록 허용")을 위쪽 "모두 선택"으로 모두 체크합니다. 하나라도 빠지면 6회차 알림이나 트리거에서 권한 오류가 납니다.
5. 아래쪽 "계속"을 누릅니다. 아래로 내리는 화살표에 가려 있으면 그 화살표를 눌러 끝까지 내린 뒤 누릅니다.

- 확인: 아래 실행 로그에 실행 완료와 `새 실습 시트: https://docs.google.com/spreadsheets/…` 한 줄이 나옵니다.
- 확인: 로그의 시트 주소를 열면 탭 넷(생산 기록, 출고 기록, 설정, 알림 기록)이 있습니다. 생산 기록 탭에는 `P-seed-0`~`P-seed-4`가 수량 20씩, 처리 상태 "완료"로 있고, 출고 기록 탭에는 `S-seed-0`~`S-seed-4`가 15씩 있습니다.
- 확인: 시각 칸이 `2026-10-26T01:00:00.000Z` 같은 글자 그대로(왼쪽 정렬) 보입니다. `2026. 10. 26` 같은 날짜로 보이면 5-28의 `toCell_`이나 5-31의 `toRow_`가 빠진 것입니다. 끝의 `Z`는 세계 표준시라 한국 시각보다 9시간 이르게 적힙니다. 화면에는 한국 시각으로 나옵니다.
- 확인: 기록 행 A칸 오른쪽 위에 작은 검은 삼각형(메모)이 있고, 마우스를 올리면 `["P-seed-0",20,…]`처럼 그 행의 값이 보입니다. 설정 탭에는 여섯 행(`factory_target` 120 … `warehouse_paused` FALSE)이 있고, 알림 기록 탭에는 첫 행만 있습니다.
- 편집기 왼쪽 프로젝트 설정(톱니바퀴)의 스크립트 속성에 `SPREADSHEET_ID`와 `TUMBLE_META`가 있습니다. 값은 캡처하거나 옮겨 적지 않습니다.
- 편집기 오른쪽 위 계정이 5-1의 개인 계정인지 봅니다.

## 5-41. 웹 앱 배포 (직접)

```powershell
npm.cmd run gas:deploy
```
- 확인: clasp 출력에 `Deployed AKfyc… @1` 같은 줄이 나오고, 이어서 `public/config.js에 웹 앱 주소와 timeoutMs 15000을 적었습니다. 이 파일에는 내 웹 앱 주소가 들어가니 커밋하거나 남에게 보내지 마세요.`가 나옵니다.
- 확인: `notepad public\config.js`로 열면 `apiBaseUrl`이 `https://script.google.com/macros/s/…/exec`이고 `timeoutMs`가 `15000`이며 다른 줄은 그대로입니다.
- 이 주소는 내 컴퓨터의 메모에만 적어 둡니다. 다른 사람에게 보내거나 채팅·문서에 붙여 넣지 않습니다. 잃어버리면 `npm.cmd run gas:editor`로 편집기를 열고 위쪽 "배포", "배포 관리"에서 설명이 `dashboard`인 배포의 웹 앱 URL을 다시 볼 수 있습니다.
- `clasp 출력에서 배포 ID를 찾지 못했습니다`가 나오면 그 위의 clasp 출력을 봅니다. `invalid_grant`가 보이면 5-12를 다시 한 뒤 이 명령을 다시 칩니다.
- 한 번 더 쳤을 때 `이미 배포 주소가 있습니다. …`가 나오는 것은 정상입니다. 배포를 하나 더 만들면 주소가 바뀌기 때문입니다.

## 5-42. 웹 앱 응답 확인 (직접)

```powershell
npm.cmd run gas:open
```
- 확인: 터미널에 `브라우저로 엽니다. JSON이 보이면 웹 앱이 동작합니다.`와 `…/exec?path=/api/v1/snapshot` 주소가 나오고, 기본 브라우저가 그 주소를 엽니다.
- 확인: 브라우저에 `"schemaVersion":1`로 시작하는 JSON이 보이고, 그 안에 `"completed":100`(공장), `"completed":75`(창고), `"시트 조회가 가능합니다."`가 있습니다.
- JSON 대신 `{"error":"먼저 createTrainingSpreadsheet를 실행해 주세요."}`가 보이면 5-40을 다시 합니다.
- JSON 대신 Google 로그인 화면이 나오면 `gas\appsscript.json`의 `webapp` 값을 5-13대로 고치고 `npm.cmd run gas:push`, `npm.cmd run gas:redeploy`를 차례로 칩니다.

## 5-43. 화면 확인 (직접)

화면 서버 터미널에서 `npm.cmd start`를 치고(이미 켜져 있으면 그대로) http://127.0.0.1:4173 을 열어 새로고침합니다.

- 확인: "생산 100개 · 목표 120개", "출고 75개 · 목표 100개", 사진 두 장, 시간별 그래프가 나옵니다. 4회차 서버는 켜지 않아도 됩니다.
- 확인: 시트를 만든 뒤 30분 안에는 두 현장 모두 "기록이 반영되고 있습니다."이고 "우선 확인할 문제가 없습니다."가 보입니다. 30분이 지나면 두 현장이 "새 기록이 늦게 들어오고 있습니다."로 바뀌고, "먼저 확인할 일"에 "텀블공장: 새 기록이 늦게 들어오고 있습니다."와 "담당자: 기록 담당자"가 나옵니다. 마지막 시드 기록이 시트를 만든 시각이라 그렇습니다.
- 확인: 첫 조회는 5~7초, 그 뒤는 2~3초 걸릴 수 있습니다. "데이터 조회 기록"의 응답시간이 그 정도입니다.
- 확인: 기준 시각에서 앞 시각을 고르면 그 시각까지의 기록만 세어 수량이 줄어듭니다.
- 확인: 생산 기록 보기를 누르면 아직 표 대신 "서버가 알린 이유: 웹 앱 주소 뒤에 ?path=/api/v1/snapshot 또는 ?path=/api/v1/records를 붙여 주세요."가 나옵니다. 다음 단계에서 고칩니다.
- "API 서버에 연결하지 못했습니다"가 나오면 5-40의 권한 승인을 했는지, 5-42의 JSON이 보이는지부터 봅니다. "틀린 항목: …"이 나오면 그 필드를 만든 단계(5-22 ~ 5-26)의 프롬프트와 Core.gs를 비교해 달라고 Antigravity에 요청합니다.

## 5-44. 기록 조회 경로 더하기

```text
gas/Code.gs의 doGet에 기록 조회 경로를 더해 주세요. 다른 곳은 고치지 마세요. 문구는 글자 그대로 씁니다.
path가 "api/v1/records"이면 e.parameter.kind가 "production"이나 "shipment"가 아닐 때 throw Error("생산 또는 출고 기록을 선택해 주세요.")입니다.
맞으면 data = readData_(at, [kind])로 그 탭만 읽고 json_({ sessionId: data.meta.sessionId, viewTime: data.at, records: TumbleCore.recordsAt(data.records, kind, data.at, from, to) })를 돌려줍니다. at, kind, from, to는 e.parameter에서 읽습니다.
```
- 확인: `Code.gs`의 `doGet`에 `api/v1/records`와 "생산 또는 출고 기록을 선택해 주세요."가 생겼습니다.

## 5-45. 올리기만 해 보기 (직접)

```powershell
npm.cmd run gas:push
```
- 확인: `Pushed 5 files`가 나옵니다.
- 확인: 화면에서 생산 기록 보기를 다시 열어도 여전히 "서버가 알린 이유: 웹 앱 주소 뒤에 …"가 보입니다. 웹 앱은 배포한 때의 코드로 응답하기 때문입니다. 올리기만 해서는 웹 앱이 바뀌지 않습니다.

## 5-46. 같은 주소로 다시 배포 (직접)

```powershell
npm.cmd run gas:redeploy
```
- 확인: clasp 출력에 `Redeployed AKfyc… @2`가 나오고, `같은 배포를 새 버전으로 갱신했습니다. 주소는 그대로입니다.`가 이어집니다.
- 확인: 10~20초 뒤 생산 기록 보기를 다시 열면 시드 기록 5행이 발생 시각 순으로 나오고 상태가 모두 "완료"입니다. 바로 바뀌지 않으면 한 번 더 엽니다. 출고 기록 보기에도 5행이 나옵니다.
- 확인: `public\config.js`의 `apiBaseUrl`이 5-41에서 적힌 주소와 같습니다.

## 참고

- **Google 쪽 코드를 고친 뒤에는** `npm.cmd run gas:push`와 `npm.cmd run gas:redeploy`를 차례로 칩니다. 둘 다 해야 웹 앱이 바뀌고, 주소는 그대로입니다.
- **로그인이 만료되면** 명령에서 `invalid_grant`가 나옵니다. `npm.cmd run gas:login`을 다시 치고 같은 명령을 다시 칩니다.
- **1·2단계로 돌아갈 때**는 `public\config.js`의 `apiBaseUrl`과 `timeoutMs`를 `README.md`의 단계별 값 표에 있는 그 단계 값으로 바꿉니다.
- **다시 3단계로 올 때는 `gas:deploy`를 다시 하지 않습니다.** 주소가 없는 `config.js`에서 `gas:deploy`를 하면 배포가 하나 더 생겨 주소가 바뀝니다. 메모해 둔 `/exec` 주소를 `apiBaseUrl`에 직접 넣고 `timeoutMs`를 `15000`으로 바꿉니다.
- 실습 시트를 새로 만들고 싶으면 편집기에서 `createTrainingSpreadsheet`를 다시 실행합니다. 새 시트가 생기고 웹 앱은 새 시트를 읽습니다. 이전 시트는 그대로 남습니다.

## 5회차 끝 확인

| 확인할 것 | 기대 결과 |
|---|---|
| `public\config.js` | `apiBaseUrl`이 `https://script.google.com/macros/s/…/exec`, `timeoutMs`가 `15000` |
| `npm.cmd run gas:open` | 브라우저에 `"schemaVersion":1`로 시작하는 JSON, 공장 `completed` 100, 창고 75 |
| 화면 http://127.0.0.1:4173 (4회차 서버는 끈 채로) | "생산 100개 · 목표 120개", "출고 75개 · 목표 100개", 사진 두 장, 시간별 그래프 |
| 생산 기록 보기, 출고 기록 보기 | 시드 기록 5행씩, 발생 시각 순, 상태 모두 "완료" |
| 기준 시각을 앞 시각으로 | 그 시각까지의 기록만 세어 수량이 줄어듦 |
| `npm.cmd run gas:deploy`를 한 번 더 | "이미 배포 주소가 있습니다. …"로 끝나고 주소가 바뀌지 않음 |
| `git check-ignore -v .clasp.json` | `.gitignore`의 `.clasp.json` 줄이 나옴 |
| `gas\` 폴더 | `appsscript.json`, `Exercises.gs`, `Core.gs`, `Code.gs`, `Setup.gs` 다섯 파일 |

못 끝냈으면 6회차 전에 [README.md](README.md)의 "5회차 이후 브랜치" 안내대로 `milestone-5` 브랜치를 받고, 옛 폴더의 `.clasp.json`과 웹 앱 주소를 옮깁니다. `gas:deploy`는 다시 하지 않습니다. 옛 폴더에 둘 다 없으면(프로젝트를 만들기 전에 멈췄으면) 새 폴더에서 5-1, 5-12, 5-38 ~ 5-43을 차례로 합니다. 그 브랜치 코드에는 기록 조회가 이미 들어 있어 5-44 ~ 5-46은 하지 않습니다.
