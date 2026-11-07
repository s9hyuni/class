# 5회차 보충 문서: 내 구글 시트와 GAS 웹 앱

> 이 문서는 5회차 프롬프트가 만드는 내용의 자세한 약속입니다. 앞 회차 문서에 이어지며, 앞 문서와 다르면 이 문서를 따릅니다.

## 이 문서를 읽는 법

- 백틱 안의 글은 이름이나 값입니다. 글자 그대로 씁니다.
- 큰따옴표 안의 글은 화면에 나오는 글자이거나 코드에 들어가는 값입니다. 한 글자도 바꾸지 않습니다. 단, 프롬프트 마지막 참고 줄의 큰따옴표 안은 이 문서의 절 제목입니다.
- "쓰는 단계"는 그 내용을 만드는 프롬프트 번호입니다. 프롬프트 맨 앞의 `[2-14]` 같은 표시가 이번 단계입니다. 그 번호가 "쓰는 단계"나 줄 앞에 적힌 내용만 만들고, 다른 번호의 내용은 그 프롬프트를 받기 전에 만들지 않습니다.
- "만들지 않는 것" 절에 적힌 기능은 완료 브랜치 코드에 있어도 만들지 않습니다.
- 창고 쪽 이름은 공장 쪽 이름의 `factory`를 `warehouse`로 바꾼 같은 이름입니다.

## 이 회차에서 만드는 것

- 시작 상태: 4회차를 끝낸 폴더입니다. 화면이 내 NestJS 서버(`http://127.0.0.1:3000`)의 값으로 "조회 정상"입니다.
- 끝 상태: 내 Google 시트의 기록을 읽는 GAS 웹 앱이 생기고 화면이 그 웹 앱의 값으로 4회차와 같은 배치로 나옵니다. 생산 기록 보기와 출고 기록 보기도 됩니다.
- 건드리지 않는 곳: 화면 코드(`public`)와 내 서버(`backend`)입니다. `public/config.js`의 두 값만 배포 명령이 바꿉니다.

화면은 웹 앱 주소로 자료를 받고 웹 앱은 시트를 읽어 답합니다.

`gas` 폴더의 코드는 내 컴퓨터가 아니라 Google에서 실행됩니다. 5-16에서 Google에 올리기 전까지는 파일 안의 글자를 찾는 것까지만 확인할 수 있습니다.

### 약속

- 3단계는 Google Apps Script(GAS) 웹 앱이 내 Google 시트를 읽어 1·2단계와 같은 모양으로 답합니다.
- 화면 코드(`public`)와 `backend`는 고치지 않습니다.
- 웹 앱 주소가 들어간 뒤로는 `public/config.js`를 열거나 출력하지 않습니다.

## 앞 회차에서 바뀌는 것

- `public/config.js`의 `apiBaseUrl`과 `timeoutMs`는 4회차 값(`http://127.0.0.1:3000`, `5000`) 그대로 두었다가, 5-18에서 배포 명령(`gas:deploy`)이 바꿉니다. AI 도구가 이 파일을 직접 열거나 고치지 않습니다.
- 4회차까지 AI 도구는 Google 명령을 실행하지 않았습니다. 이번 회차부터 `gas:create`, `gas:push`, `gas:deploy`, `gas:redeploy`는 그 명령을 실행하라는 프롬프트를 받았을 때만 AI 도구가 실행합니다('Google 명령을 실행할 때').
- 내 서버(`backend`)는 지우지 않습니다. 이 회차에는 켜지 않아도 됩니다.
- 그 밖에 앞 회차 약속을 바꾸거나 지우는 것은 없습니다.

## 만드는 차례

쓰는 단계: 5-3 ~ 5-18

이 문서는 완성된 모양을 한 번에 적었습니다. 프롬프트가 부탁한 범위만 만듭니다.

- Google 명령 파일을 만드는 동안(5-3 ~ 5-5) 어떤 명령도 실행하지 않습니다. Google 명령은 5-16, 5-18처럼 실행하라는 프롬프트를 받았을 때만 실행합니다.
- 네 명령의 내용은 5-4, 5-5에서 채웁니다. 틀을 만드는 5-3에는 넣지 않습니다.
- 웹 앱 입구는 오늘 운영 자료 길, 기록 조회 길과 함께 5-15에서 만듭니다. 그 앞 단계에서 만들지 않습니다.

## 프롬프트의 말과 실제 이름

쓰는 단계: 5-3 ~ 5-18

프롬프트에는 파일과 함수 이름을 적지 않습니다. 프롬프트의 말이 가리키는 이름은 다음과 같습니다.

| 프롬프트의 말 | 실제 이름 |
|---|---|
| Google 명령 파일 | `scripts/gas-clasp.mjs` |
| npm 명령 목록의 Google 명령 일곱 개 | `gas:login`, `gas:create`, `gas:push`, `gas:deploy`, `gas:redeploy`, `gas:open`, `gas:editor` |
| npm 명령 gas:create, gas:push, gas:deploy, gas:redeploy | `npm.cmd run gas:create`처럼 `npm.cmd run` 뒤에 그 이름 |
| 연결 설정 | `public/config.js` |
| Google 쪽 코드 폴더 | `gas` |
| 웹 앱 설정 파일 | `gas/appsscript.json` |
| 연습 파일(작은 계산 다섯 가지) | `gas/Exercises.gs` |
| 계산 파일 | `gas/Core.gs`의 `TumbleCore` |
| 시각과 기준 시각 검사(시각 바꾸기, 한국 날짜 구하기, 기준 시각 검사) | `iso`, `day`, `view` |
| 시트 행 바꾸기(시트에 적힌 행을 화면이 쓸 기록으로 바꾸고 틀린 행은 오류 목록에 모으는 일) | `parse` |
| 기록 고르기(기준 시각까지의 기록을 고르는 일) | `recordsAt` |
| 오늘 운영 화면이 받는 자료, 오늘 운영 자료 | `snapshot` |
| 확인할 일 목록(먼저 확인할 일 상자에 나올 목록) | `incidents` |
| 시트 작업 파일 | `gas/Code.gs` |
| 칸 값 쓰고 읽기, 이름으로 탭 읽기 | `toCell_`, `toRow_`, `fromCell_`, `rows_` |
| 설정 탭에 지금 적힌 값을 읽어 검사하는 일(설정 탭 읽기), 세션 정보를 읽는 일 | `settings_`, `meta_` |
| 웹 앱 응답 만들기(웹 앱이 JSON으로 답하는 일), 알림 기록 탭 읽기 | `json_`, `alerts_` |
| 생산 기록·출고 기록 탭 읽기 | `readData_` |
| 웹 앱 입구, 오늘 운영 자료를 답하는 길, 기록 조회 길 | `doGet`, `api/v1/snapshot`, `api/v1/records` |
| 실습용 Google 시트를 새로 만드는 기능 | `gas/Setup.gs`의 `createTrainingSpreadsheet` |

## Google 명령 파일의 틀

쓰는 단계: 5-3

이 바탕은 네 명령이 함께 씁니다. Windows에서도 되게 하고 clasp가 낸 출력은 화면에 그대로 보여 줍니다.

### 약속

- `scripts/gas-clasp.mjs`(Google 명령 파일)는 node scripts/gas-clasp.mjs create|deploy|redeploy|open으로 실행하는 Node.js 파일이고, 주석과 빈 줄을 빼고 60줄 안입니다.
- 네 이름이 아니거나 이름이 없으면 "사용법: node scripts/gas-clasp.mjs create|deploy|redeploy|open"을 오류로 출력하고 종료 코드 1로 끝냅니다.
- clasp는 "npx " + 인자를 공백으로 이은 한 줄 글자를 `spawnSync`에 `shell: true`로 넘겨 부르고(공백이 든 인자는 큰따옴표로 감쌈), 받은 출력을 화면에 그대로 보여 줍니다.
- 실패는 모두 오류로 출력하고 종료 코드 1로 끝냅니다.
- 로그인 안내 글은 "로그인이 만료됐으면 npm.cmd run gas:login(macOS: npm run gas:login)을 다시 실행하세요."입니다.
- 웹 앱 주소가 있다는 것은 `apiBaseUrl`이 https://script.google.com/macros/s/(AKfyc로 시작하는 배포 ID)/exec 꼴이라는 뜻입니다.

## npm 명령 일곱 개

쓰는 단계: 5-3

만들기만 하고 실행하지 않습니다.

### 약속

- clasp는 늘 `npx --yes @google/clasp@3.4.1` 로 부릅니다.
- `package.json` `scripts`에 아래 일곱 개를 더합니다(이미 있는 명령은 그대로). 완료 브랜치의 `package.json`에 있는 `check` 줄은 4회차 '만들지 않는 것'이라 더하지 않습니다.

| 명령 | 내용 |
|---|---|
| "gas:login" | "npx --yes @google/clasp@3.4.1 login" |
| "gas:push" | "npx --yes @google/clasp@3.4.1 push --force" |
| "gas:editor" | "npx --yes @google/clasp@3.4.1 open-script" |
| "gas:create" | "node scripts/gas-clasp.mjs create" |
| "gas:deploy" | "node scripts/gas-clasp.mjs deploy" |
| "gas:redeploy" | "node scripts/gas-clasp.mjs redeploy" |
| "gas:open" | "node scripts/gas-clasp.mjs open" |

- `.gitignore`에는 1회차에 가져온 `.clasp.json`과 `.runtime/` 줄이 이미 있습니다. `.gitignore`는 고치지 않습니다.

## 프로젝트 만들기 명령

쓰는 단계: 5-4

빈 폴더에 Google 프로젝트를 만들고, 실패하면 약속한 안내로 끝납니다. 성공한 뒤에는 만든 프로젝트가 Google 쪽 코드 폴더를 가리키게 합니다.

### 약속

프로젝트 만들기(create):

- `.runtime/gas-create`를 지우고 빈 폴더로 만든 뒤 clasp create-script --type standalone --title "텀블공장 개인 백엔드" --rootDir .runtime/gas-create 를 실행합니다.
- 출력에 `Created new script`가 없으면 "clasp가 프로젝트를 만들지 못했습니다. 위 출력을 확인하고, " + 로그인 안내 글입니다.
- 성공하면 `.clasp.json`의 `rootDir`만 "gas"로 바꿔 2칸 들여쓴 JSON + 줄바꿈으로 저장합니다.
- 이어서 ".clasp.json이 gas 폴더를 가리키게 했습니다. 다음: npm.cmd run gas:push(macOS: npm run gas:push)"를 출력합니다.

## 배포 명령

쓰는 단계: 5-4, 5-18

웹 앱 주소가 있는지 보는 검사는 배포, 다시 배포, 웹 앱 열기 명령이 함께 쓰도록 하나로 만듭니다.

### 약속

배포(deploy):

- 웹 앱 주소가 이미 있으면 clasp를 부르지 않고 "이미 배포 주소가 있습니다. npm.cmd run gas:redeploy(macOS: npm run gas:redeploy)로 갱신하세요."입니다.
- 없으면 clasp create-deployment --description dashboard 출력에서 AKfyc로 시작하는 ID(영문·숫자·_·-)를 모아 겹친 것을 빼고 정확히 하나일 때만 성공입니다.
- 성공하면 `public/config.js`에서 `apiBaseUrl` 값을 https://script.google.com/macros/s/(배포 ID)/exec 로, `timeoutMs` 값을 `15000`으로 바꾸고 나머지 글자는 그대로 둡니다.
- 그 뒤 "public/config.js에 웹 앱 주소와 timeoutMs 15000을 적었습니다. 이 파일은 저장소에 올리지 않습니다."를 출력합니다.
- ID가 하나가 아니면 `config.js`를 바꾸지 않고 "clasp 출력에서 배포 ID를 찾지 못했습니다. 위 출력을 확인하고, " + 로그인 안내 글입니다.

## 다시 배포와 웹 앱 열기 명령

쓰는 단계: 5-5

다시 배포는 새 배포를 만들지 않고 같은 주소를 새 버전으로 바꿉니다. 웹 앱 열기는 웹 앱 주소를 기본 브라우저로 엽니다.

### 약속

다시 배포(redeploy):

- 웹 앱 주소가 없으면 "public/config.js에 웹 앱 주소가 없습니다. 먼저 npm.cmd run gas:deploy(macOS: npm run gas:deploy)를 실행하세요."입니다.
- 있으면 clasp update-deployment (배포 ID) --description dashboard 를 실행합니다.
- 출력에 "Redeployed (배포 ID) @"가 있으면 "같은 배포를 새 버전으로 갱신했습니다. 주소는 그대로입니다.", 없으면 deploy('배포 명령')의 배포 ID 문장으로 실패합니다.

웹 앱 열기(open):

- 웹 앱 주소가 없으면 redeploy와 같은 문장으로 실패합니다.
- 있으면 "브라우저로 엽니다. JSON이 보이면 웹 앱이 동작합니다."와 주소 + "?path=/api/v1/snapshot"을 출력하고 그 주소를 기본 브라우저로 엽니다(Windows `start ""`, macOS `open`, 그 밖 `xdg-open`).

## 웹 앱 설정 파일

쓰는 단계: 5-7

권한 세 가지(시트, 외부 서비스 연결, 트리거)를 지금 적어 두면 5-17에서 한 번에 승인합니다. 뒤의 두 권한은 6회차에 씁니다. `ANYONE_ANONYMOUS`와 `USER_DEPLOYING` 두 값이 다르면 화면이 로그인 없이 웹 앱을 부르지 못합니다.

### 약속

- `gas` 폴더의 파일은 정확히 다섯 개입니다: `appsscript.json`, `Exercises.gs`, `Core.gs`, `Code.gs`, `Setup.gs`.
- `.gs` 파일은 Apps Script용 일반 JavaScript(`import`·`export`·`require`·TypeScript 형 표시 없음)이고 파일끼리 전역 이름을 함께 씁니다.

### 값과 모양

`appsscript.json`은 2칸 들여쓰기로 다음 내용을 한 글자도 바꾸지 않고 그대로 씁니다.

```json
{
  "timeZone": "Asia/Seoul",
  "runtimeVersion": "V8",
  "exceptionLogging": "STACKDRIVER",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.scriptapp"
  ],
  "webapp": {
    "access": "ANYONE_ANONYMOUS",
    "executeAs": "USER_DEPLOYING"
  }
}
```

## 작은 함수

쓰는 단계: 5-8

### 약속

`Exercises.gs`는 교재와 함께 쓰는 작은 함수 다섯 개입니다(이름 그대로). 다른 파일은 같은 계산을 새로 만들지 않고 이 함수를 부릅니다.

| 함수 | 하는 일 |
|---|---|
| `readRecordRows_(sheet)` | 첫 행을 뺀 행 배열 |
| `sumQuantities_(records)` | `quantity` 합(빈 배열 0) |
| `groupHourly_(records)` | `occurredAt`을 UTC 정시 ISO로 내린 키별 `quantity` 합 객체 |
| `isDelayed_(latest, at, minutes)` | `latest`가 있고 `at` − `latest.occurredAt`이 `minutes`분보다 길면 `true` |
| `alertMessage_(incident)` | `title + " 담당자: " + owner + " / 할 일: " + action` |

## 시각과 기준 시각

쓰는 단계: 5-9

이 단계에서 계산 파일을 만듭니다. 이 파일에 넣는 함수는 단계마다 늘어나고 5-11이 끝나면 돌려주는 이름이 여섯 개가 됩니다.

### 약속

`Core.gs`는 Google 서비스를 쓰지 않는 계산을 다음 하나에 모읍니다.

```javascript
var TumbleCore = (function () { … return { iso, day, view, parse, recordsAt, snapshot }; })();
```

| 함수 | 규칙 |
|---|---|
| `iso(value)` | `Date`면 `toISOString()`, 날짜T…(Z 또는 ±hh:mm) 꼴이고 `Date.parse`로 읽히는 글자면 Z로 끝나는 ISO, 아니면 "시간대를 포함한 시각을 입력해 주세요." |
| `day(value)` | 한국 날짜 "YYYY-MM-DD" |
| `view(at, now)` | 기준 시각(`at`, 빈 글자이거나 없으면 `now`)의 한국 날짜가 `now`와 다르거나 `now`보다 늦으면 "오늘의 현재 이전 시각을 선택해 주세요." |

`iso`와 `view`는 문제가 있으면 표의 문장으로 오류를 던집니다(`throw Error(문장)`). 웹 앱 입구가 그 오류를 잡아서 답합니다.

## 시트 행 바꾸기

쓰는 단계: 5-9

시트에 적힌 행을 화면이 쓸 기록으로 바꾸고 틀린 행은 오류 목록에 모읍니다.

### 약속

- `parse(rows, kind, now)`는 시트 행 [기록 ID, 수량, 발생 시각, 접수 시각, 처리 시각, 처리 상태]를 `{ records, errors }`로 바꿉니다.
- 모두 빈 행은 건너뜁니다.
- 여섯째 칸(처리 상태)은 기록에 넣지 않습니다. 기록의 상태는 세 시각으로 정합니다.
- ID 형식을 통과한 행은 뒤 검사에서 틀려도 그 ID를 나온 ID로 칩니다. 발생 시각이 비었으면 `iso`의 "시간대를 포함한 시각을 입력해 주세요."가 그 행의 오류입니다.
- 문제 행은 `errors`에 { row: 순번 + 2, message }를 넣고 다음 행으로 갑니다.
- 검사는 기록 ID, 수량, 세 시각 차례입니다. `parse` 검사(차례로): ID는 `null`·`undefined`면 "", 아니면 String(값)(숫자 0도 "0")이고 `/^[A-Za-z0-9_-]{1,100}$/`에 맞지 않거나 앞에서 나온 ID면 "고유한 영문·숫자 기록 ID가 필요합니다."(`new Set`으로 확인), 수량이 숫자나 글자가 아니거나(TRUE·FALSE 포함) 빈칸이거나 1~10000 정수가 아니면 "수량은 1~10000의 정수입니다.", 시각은 `iso`(접수·처리는 있을 때만, 없으면 `null`), 발생 ≤ `now`, 발생 ≤ 접수 ≤ `now`, 처리가 있으면 접수가 있고 접수 ≤ 처리 ≤ `now`가 아니면 "발생·접수·처리 시각의 순서를 확인해 주세요.".

## 기록 고르기

쓰는 단계: 5-10

하루의 시작을 한국 시각 0시로 잡습니다. 아래 약속의 `T00:00:00+09:00`이 그 자리입니다. status 세 가지의 이름은 4회차 보충 문서에 있는 `completed`, `processing-wait`, `receipt-wait`입니다.

### 약속

`recordsAt(records, kind, at, from, to)`:

- `kind`가 틀리면 "생산 또는 출고를 선택해 주세요."입니다.
- 시작은 `from` 또는 `at` 날짜의 한국 0시(`day(at) + "T00:00:00+09:00"`), 끝은 `to` 또는 `at`입니다.
- 시작이나 끝의 날짜가 `at`과 다르거나, 시작 > 끝 또는 끝 > `at`이면 "조회 시간 구간을 확인해 주세요."입니다.
- 결과는 4회차 records 결과와 같은 규칙(정렬, `at` 뒤 시각 `null`, status 세 가지)입니다.

## 오늘 운영 자료의 현장별 값

쓰는 단계: 5-10

오늘 운영 화면이 받는 자료는 1~4회차 화면이 받던 것과 같은 모양입니다. 현장은 공장, 창고 차례로 구합니다.

### 약속

`snapshot(records, settings, meta, alerts, at, now, errors)`의 기준 시각은 `view(at, now)`입니다. 현장마다 아래 재료를 구합니다.

| 재료 | 구하는 법 |
|---|---|
| `latest` | `recordsAt`의 마지막 기록 |
| `completed` | 처리 시각이 있는 기록 |
| `pending` | 처리 시각이 없는 기록이 있는지 |
| `paused` | `pending`이면서 설정 `factory_paused`(창고 `warehouse_paused`)가 `true`인지 |
| `stale` | isDelayed_(latest, 기준 시각, delay_minutes) |

`note`는 아래 차례로 봅니다.

| 조건 | `note` |
|---|---|
| `latest` 없음 | "기록이 없습니다." |
| `paused` | "기록 처리가 일시 정지됐습니다." |
| `pending` | "처리를 기다리는 기록이 있습니다." |
| `stale` | "새 기록이 늦게 들어오고 있습니다." |
| 그 밖 | "기록이 반영되고 있습니다." |

- `processingState`는 `paused`면 `paused`, `pending`이거나 `latest`가 없으면 `waiting`, 아니면 `completed`입니다.
- `status`는 `latest` 없음·`pending`·`stale`이면 `warning`, 아니면 `normal`입니다.

`sites` 값:

| 값 | 내용 |
|---|---|
| `label` | "텀블공장"·"물류창고" |
| `target` | 설정 `factory_target`·`warehouse_target` |
| `completed` | `completed`의 `sumQuantities_`(없으면 `null`) |
| 세 시각(`lastEventAt`·`receivedAt`·`processedAt`) | `latest` 값(`lastEventAt`은 `occurredAt`, 없으면 `null`) |
| `note`·`processingState`·`status` | 위에서 구한 값 |
| `history` | `groupHourly_(completed)`를 시각 순 `{ timestamp, quantity }` 배열로 |
| `image` | { url: "./assets/approved/factory.png"(창고 warehouse.png), alt: "공장 생산 참고 사진"(창고 "창고 출고 참고 사진") } |

사진 주소는 화면 서버 기준이라 `public`의 사진이 보입니다.

## 오늘 운영 자료의 확인할 일과 돌려주는 모양

쓰는 단계: 5-11

### 약속

`incidents`는 아래 차례로 넣습니다.

| 언제 | `id` | `scope` | `level` | `title` | `owner` | `action` |
|---|---|---|---|---|---|---|
| `warning` 현장마다 | FACTORY-FEED·WAREHOUSE-FEED | factory·warehouse | "warning" | `label + ": " + note` | "기록 담당자" | "시트의 기록과 처리 상태를 확인해 주세요." |
| `errors`가 있으면 | "INPUT-ERROR" | "service" | "warning" | "입력값을 확인할 기록이 있습니다." | "기록 담당자" | 오류마다 `sheet + " " + row + "행: " + message`를 " / "로 이은 글 |
| 이어서 `alerts`(`{ at, status, message }` 목록) 가운데 기준 시각 이전 항목만 남긴 목록의 맨 뒤 항목(`last`, 시각 비교가 아니라 시트 행 순서)이 `failed`면 | "ALERT-DELIVERY" | "service" | "error" | "알림 전송에 실패했습니다." | "서비스 담당자" | "알림 기록과 웹훅 설정을 확인해 주세요." |

`snapshot`이 돌려주는 값:

| 값 | 내용 |
|---|---|
| `schemaVersion` | `1` |
| `scenarioId` | "normal" |
| `revision`·`changedAt` | `meta` |
| `serverTime` | `iso(now)` |
| `viewTime` | 기준 시각 |
| `mode` | `at`이 있으면 "past", 아니면 "current" |
| `sessionId` | `meta` |
| `trainingOnly` | `true` |
| `sites` | '오늘 운영 자료의 현장별 값'의 `sites` 값 |
| `services` | { api: { status "normal", note "시트 조회가 가능합니다." }, alerts: { status: last.status 또는 "unknown", lastAttemptAt: last.at 또는 null, note: last.message 또는 "알림 발송 기록이 없습니다." } } |
| `incidents` | 위 `incidents` 표 |

## 실습 시트의 탭과 설정

쓰는 단계: 5-12, 5-13, 5-14

### 약속

- 실습 시트 탭은 "생산 기록", "출고 기록", "설정", "알림 기록"입니다(`var TUMBLE_SHEETS = { production, shipment, settings, alerts }`).
- 기록 탭 첫 행은 `TUMBLE_HEADERS = ["기록 ID", "수량", "발생 시각", "접수 시각", "처리 시각", "처리 상태"]`입니다.
- 알림 기록 탭 첫 행은 `["시각", "사건 ID", "내용", "발송 상태", "상세"]`입니다.
- 설정 탭은 첫 행 `["설정 이름", "값"]` 아래 다음 여섯 행입니다. 설정 이름은 밑줄 이름 그대로 씁니다.

| 설정 이름 | 값 |
|---|---|
| `factory_target` | 120 |
| `warehouse_target` | 100 |
| `delay_minutes` | 30 |
| `cooldown_minutes` | 10 |
| `factory_paused` | false |
| `warehouse_paused` | false |

스크립트 속성은 `SPREADSHEET_ID`(실습 시트 ID)와 `TUMBLE_META`(세션 정보(초기 자료)인 `{ sessionId, revision, changedAt }`의 JSON 글자)입니다. 6회차에 `DISCORD_WEBHOOK_URL`과 `ALERT_`로 시작하는 속성이 더해집니다.

## 시트 작업 파일의 이름

쓰는 단계: 5-12, 5-14

아래 이름은 한 번에 만들지 않습니다. 각 단계의 절에 적힌 것만 그 단계에서 만듭니다.

### 약속

`Code.gs`의 공통 이름(다른 파일이 부름):

- `TUMBLE_SHEETS`, `TUMBLE_HEADERS`, `properties_()`
- `spreadsheet_()`(`SPREADSHEET_ID`가 없으면 "먼저 createTrainingSpreadsheet를 실행해 주세요.")
- `toCell_`, `toRow_`, `fromCell_`, rows_(탭 이름), `settings_()`
- `meta_()`(없으면 "초기 자료가 없습니다.")
- json_(값), `readData_(at, kinds)`, `alerts_()`

## 시트 열기와 칸 값

쓰는 단계: 5-12

이 단계에서는 `TUMBLE_SHEETS`, `TUMBLE_HEADERS`, `properties_()`, `spreadsheet_()`, `toCell_`, `toRow_`, `fromCell_`, rows_(탭 이름)을 넣습니다. 이름의 뜻은 '실습 시트의 탭과 설정'과 '시트 작업 파일의 이름'에 있습니다. `'`를 붙이는 것은 아래 글자로 시작하는 값을 시트가 숫자·날짜·수식으로 바꾸기 때문입니다.

### 약속

- 시트에 쓸 때 숫자·=·+·-·@로 시작하는 글자는 앞에 '를 붙여 글자 그대로 남깁니다(`toCell_`, 행은 `toRow_`).
- 읽을 때는 `Date`면 ISO로 바꾸고, `toCell_`이 붙인 '만 뗍니다(' 뒤가 숫자·=·+·-·@일 때, `fromCell_`).
- 시각 칸은 늘 Z로 끝나는 ISO 글자입니다.

## 설정과 세션 정보 읽기

쓰는 단계: 5-12

이 단계에서는 `settings_()`와 `meta_()`를 넣습니다. `settings_()`는 이 회차에서는 다른 곳에서 부르지 않습니다. 6회차에 씁니다.

### 약속

- `settings_()`는 설정 탭의 행(설정 이름, 값)을 읽어 { 설정 이름: 값 } 객체로 만듭니다(A1 메모의 설정 이력이 아님).
- 검사를 통과한 값은 목표는 수(빈칸은 `null`), 분은 수, 처리 정지는 `true`·`false`로 바꿉니다.

| 검사하는 값 | 통과하지 못하는 경우 | 문장 |
|---|---|---|
| 목표 | 빈칸도 1 이상 정수도 아니면 | "목표는 양의 정수 또는 빈칸입니다." |
| `delay_minutes`·`cooldown_minutes` | 1~1440 밖이면 | "대기 기준은 1~1440분입니다." |
| 처리 정지 | true·false·"TRUE"·"FALSE" 밖이면 | "처리 정지는 TRUE 또는 FALSE입니다." |

## 실습 시트 만들기

쓰는 단계: 5-13

탭 이름과 첫 행, 설정 값은 '실습 시트의 탭과 설정'을 따릅니다. 시드 기록의 메모는 '기록 탭 읽기'에서 읽습니다.

### 약속

`Setup.gs`의 `createTrainingSpreadsheet`(편집기에서 실행)는 실행할 때마다 다음을 합니다. 시드 기록과 설정 값까지 모든 탭에 쓴 뒤에 첫 행 고정과 열 폭 맞춤을 합니다. 로그와 돌려주기는 맨 끝에 합니다.

- 새 시트 "텀블공장 개인 실습 " + 지금 ISO 시각을 만듭니다(이전 시트는 그대로).
- 시간대 `Asia/Seoul`, 네 탭, `SPREADSHEET_ID` 저장, 모든 탭 첫 행 고정과 열 폭 자동 맞춤(`autoResizeColumns`)을 합니다.
- 로그 "새 실습 시트: " + 시트 주소를 남기고 시트 주소를 돌려줍니다.

시드 기록은 탭마다 5행(i = 0~4)입니다. 코드에 `P-seed-`, `S-seed-` 글자를 이어 붙이지 말고 그대로 씁니다.

| 칸 | 값 |
|---|---|
| ID | "P-seed-" + i(출고 "S-seed-" + i) |
| 수량 | 20(출고 15) |
| 발생 | 오늘 한국 0시와 지금 사이를 다섯으로 나눈 (i+1)번째 시각 |
| 접수 | 발생 + gap |
| 처리 | 발생 + gap × 2(지금보다 늦지 않게) |
| 처리 상태 | "완료" |
| A칸 메모 | 원본 |

`gap` = min(2초, (지금 − 발생) ÷ 2)입니다.

설정 탭 A1 메모에는 [{ at: 오늘 한국 0시, revision: 1, settings: 여섯 값 }], `TUMBLE_META`에는 { sessionId: Utilities.getUuid(), revision: 1, changedAt: 지금 }을 저장합니다.

## 웹 앱 응답과 알림 기록 읽기

쓰는 단계: 5-14, 5-15

이 절의 json_(값)과 `alerts_()`는 5-14에서 만듭니다. 오류를 모두 잡아 답하는 부분은 5-15의 웹 앱 입구에서 씁니다.

### 약속

- `alerts_()`는 알림 기록 탭에서 첫 칸(시각)이 있는 행만 읽어 { at: 시각(iso), status: 발송 상태, message: 내용 } 목록으로 돌려줍니다.
- 웹 앱 응답은 `{ ok, data }` 같은 봉투 없이 JSON 그대로입니다(`ContentService`, `MimeType.JSON`).
- 웹 앱은 상태 코드를 정할 수 없으므로 모든 오류를 잡아 { error: 문장 }으로 답합니다.

## 기록 탭 읽기

쓰는 단계: 5-14

기록 줄의 A칸 메모에는 접수한 기록의 원본이 들어 있습니다. 접수한 기록은 시트에서 고쳐도 화면 값이 바뀌지 않게 합니다.

### 약속

접수한 원본:

- 기록 행의 A칸 메모는 접수한 원본(그 행 여섯 칸의 JSON 배열)입니다.
- 읽을 때 메모가 없는 행은 아직 접수 전이라 접수·처리 시각을 비우고, 메모가 있는 행은 원본을 씁니다.
- 앞 여섯 칸이 원본과 하나라도 다르면 `errors`에 "접수한 기록의 수정은 반영하지 않습니다. 새 실습 시트를 만들어 주세요."를 넣습니다(G열부터는 보지 않음).

설정 이력:

- 설정은 설정 탭이 아니라 설정 탭 A1 메모의 설정 이력 `[{ at, revision, settings }]`에서 기준 시각 이전 마지막 항목을 씁니다. 없으면 "이 시점의 설정 자료가 없습니다."입니다.
- `meta`의 `revision`·`changedAt`은 그 항목의 `revision`·`at`입니다.

`readData_(at, kinds)`(`kinds`가 없으면 생산·출고 둘 다)는 `{ now, at, records, errors, settings, meta }`를 돌려줍니다.

| 값 | 내용 |
|---|---|
| `now` | 지금 ISO 시각 |
| `at` | 기준 시각(`view(at, now)`) |
| `records`·`errors` | 기록 탭을 `parse`한 결과(`errors` 항목은 `{ sheet, row, message }`) |
| `settings`·`meta` | 위 설정 이력 항목에서 고른 값(`meta`의 `sessionId`는 `TUMBLE_META` 값) |

## 웹 앱 입구

쓰는 단계: 5-15

5-15에서 오늘 운영 자료 길, 기록 조회 길("생산 또는 출고 기록을 선택해 주세요."가 든 부분), 그 밖의 길에 답하는 안내 문장을 함께 만듭니다. 모든 오류는 '웹 앱 응답과 알림 기록 읽기'대로 여기서 잡아 답합니다.

### 약속

웹 앱 입구 `doGet(e)`는 `path` 매개변수의 앞뒤 /를 모두 떼고 아래처럼 답합니다. 아래의 오류 문장은 모두 { error: 문장 }으로 답합니다.

| `path` | 답 |
|---|---|
| "api/v1/snapshot" | `snapshot`(입력 오류는 `at`이 없을 때만 넘김) |
| "api/v1/records" | `kind`가 `production`이나 `shipment`가 아니면 오류 "생산 또는 출고 기록을 선택해 주세요."이고, `at`·`from`·`to`로 `{ sessionId, viewTime, records }`를 돌려줍니다 |
| 그 밖 | 오류 "웹 앱 주소 뒤에 ?path=/api/v1/snapshot 또는 ?path=/api/v1/records를 붙여 주세요." |

## Google 명령을 실행할 때

쓰는 단계: 5-16, 5-18

`gas:create`, `gas:push`, `gas:deploy`, `gas:redeploy`는 AI 도구가 실행합니다. `gas:login`, `gas:editor`, `gas:open`은 브라우저를 여는 명령이라 사용자가 칩니다.

### 약속

- 네 명령은 그 명령을 실행하라는 프롬프트를 받았을 때만, 프롬프트에 적힌 차례대로 한 번씩 실행합니다. Windows에서는 `npm.cmd run gas:create`처럼 칩니다.
- `gas:create`가 "Project file already exists."로 실패하면(이어서 "clasp가 프로젝트를 만들지 못했습니다. …"가 나와도) 이미 만든 프로젝트가 있는 것입니다. 다시 실행하지 않고 다음 명령으로 갑니다.
- `gas:deploy`는 처음 한 번만 합니다. 실패해도 다시 실행하지 않고 결과를 그대로 알립니다. "이미 배포 주소가 있습니다. …"가 나오면 배포가 이미 있는 것입니다.
- Google 쪽 코드를 고치면 `gas:push` 뒤 `gas:redeploy`를 합니다. 웹 앱은 배포한 때의 코드로 답하므로 올리기만 해서는 바뀌지 않습니다. 주소는 그대로입니다.
- 명령이 "User has not enabled the Apps Script API"나 `invalid_grant`로 실패하면 다시 실행하지 않고 그대로 알립니다. 사용자가 Apps Script API 켜기(5-2)나 Google 로그인(5-6)을 다시 합니다.
- 결과는 프롬프트가 말한 줄만 알립니다. 명령 출력의 배포 ID, 스크립트 ID, 웹 앱 주소는 대화에 옮겨 쓰지 않습니다.

## 사용자가 직접 하는 일

쓰는 단계: 5-2, 5-6, 5-17 ~ 5-20

아래 일은 사용자가 합니다. AI 도구는 실행하지 않습니다.

- Apps Script API 켜기(5-2), Google 로그인(5-6)
- 편집기에서 권한 승인과 실습 시트 만들기(5-17)
- 웹 앱 열기(`gas:open`)와 화면 확인(5-18, 5-19), 커밋(5-20)
- 화면 서버 켜기와 끄기

[session-5 문서 끝]
