# 4회차: 1단계 정리와 내 NestJS 서버

- **시작 상태**: 3회차를 끝낸 `C:\ai-class\tumble-dashboard` 폴더에서 이어 합니다. 3회차를 끝내지 못했으면 [README.md](README.md)의 공통 안내대로 `milestone-3` 브랜치를 받습니다. 화면이 강사 API 값으로 10초마다 바뀌고, 실패 안내·과거 시각·조회 기록이 동작하는 상태입니다.
- **끝나면 되는 것**
  - 1단계 정리: 쓰지 않는 코드를 지우고, `npm.cmd run check`로 문법 검사를 하고, `README.md`에 실행 방법과 단계별 설정 값이 있습니다.
  - 대시보드 폴더 안 `backend` 폴더에 내가 만든 NestJS 서버가 `http://127.0.0.1:3000`에서 켜집니다. 처음 켤 때 오늘 기록(생산 100개, 출고 75개)을 만들어 `backend\var\state.json`에 저장합니다.
  - 화면 코드는 그대로 두고 연결 주소만 `http://127.0.0.1:3000`으로 바꾸면, 1단계와 같은 화면이 내 서버 값으로 "조회 정상"으로 나옵니다.
- **준비물**: 3회차까지 만든 대시보드 폴더, Node.js 22 이상, 패키지를 받을 인터넷, Chrome.

## 시작 전에 (프롬프트 없이 직접 합니다)

1. Antigravity로 `C:\ai-class\tumble-dashboard` 폴더를 엽니다.
2. 아래쪽 터미널(이하 "화면 창")에서 `npm.cmd start`를 치고 Chrome에서 `http://127.0.0.1:4173`을 엽니다. 머리 부분에 "조회 정상"이 보이는지 봅니다.
3. `public\config.js`의 두 값이 `API_CONTRACT.md` 9절 표의 1단계 값(강사 API 주소, `5000`)과 같은지 눈으로 봅니다.

## 진행 방법

- 프롬프트 블록은 하나씩 통째로 복사해 AI 대화창에 붙여 넣습니다. 제목에 "(직접 하기)"가 붙은 단계의 명령 상자는 AI에게 보내지 않고 터미널에 직접 칩니다. 4-1의 `---- 아래 글 그대로 ----` 줄 아래 글도 함께 들어가야 합니다.
- 프롬프트에 "4회차 약속대로"라고 적힌 곳은 AI가 `AGENTS.md`에 덧붙인 약속을 읽고 이름과 규칙을 찾습니다. 약속 내용을 이해하지 않아도 됩니다.
- Antigravity가 더 나은 방법이나 기능을 제안해도 받아들이지 말고 "프롬프트에 적힌 대로만 해 주세요"라고 답합니다.
- 이번 회차는 터미널을 세 개 씁니다.
  - 화면 창: 대시보드 폴더, `npm.cmd start`(4173). 켜 둔 채로 둡니다.
  - 서버 창: `backend` 폴더, `npm.cmd start`(3000). 4-15부터 씁니다.
  - 확인용 창: 설치, 검사, `curl.exe` 같은 명령을 칩니다.
- 서버 코드를 바꾼 뒤 확인할 때는 서버 창에서 Ctrl+C로 끄고(Y/N을 물으면 `Y`), `npm.cmd run build`, `npm.cmd start`를 차례로 칩니다. 빌드를 하지 않으면 예전 코드가 그대로 돕니다.
- 서버 창에는 켤 때의 줄과 오류 줄만 나오고, 요청마다 줄이 남지 않습니다. 요청은 Chrome의 F12, Network 탭에서 봅니다.
- 명령은 `npm.cmd`, `curl.exe`로 칩니다. PowerShell에서 `curl`만 치면 다른 명령이 실행됩니다.
- 주소창에 시각을 넣을 때는 `Z`로 끝나는 꼴만 씁니다. `+09:00`의 `+`는 주소에서 공백으로 바뀌어 400이 나옵니다.

| 번호 | 하는 일 |
|---|---|
| 4-1 | 4회차 약속 더하기 |
| 4-2 ~ 4-9 | 1단계 정리(쓰지 않는 코드, 문법 검사, 시험용 응답, README, 되돌리기) |
| 4-10 ~ 4-15 | 서버 뼈대와 상태 확인 주소(설치·빌드·켜기는 직접) |
| 4-16 ~ 4-24 | 시드 기록, 상태 파일, 상태 파일 검사 |
| 4-25 ~ 4-29 | 기록 목록 |
| 4-30 ~ 4-37 | 오늘 운영 자료 |
| 4-38 ~ 4-40 | 현장 사진 |
| 4-41 ~ 4-43 | 상태 파일 새로 만들기, 화면 연결 |
| 4-44 ~ 4-45 | 확인 실습(서버 끄기, 상태 파일 고장, 잘못된 요청) |

## 4-1. 4회차 약속 더하기

이번 회차에 AI가 지킬 약속을 규칙 파일에 더합니다. 내용을 이해하지 않아도 됩니다.

```text
AGENTS.md 끝에 아래 글을 그대로 덧붙여 주세요. "## 4회차 약속" 절이 이미 있으면 그대로 둡니다.

---- 아래 글 그대로 ----
## 4회차 약속
- 1단계 정리: package.json scripts에 "check": "node --check public/app.js && node --check public/config.js && node --check scripts/serve.mjs"를 더합니다.
- 시험용 응답 파일(확장자 없음): public/test/error/api/v1/snapshot 내용 {"error":"시험용 오류입니다."}, public/test/not-json/api/v1/snapshot 내용은 JSON이 아닌 글 한 줄(예: 시험용 글자입니다)입니다. public/test 폴더는 사용자가 지우라고 할 때 지웁니다.
- README.md 끝에 "실행", "검사", "화면 주소", "단계별 public/config.js 값" 절을 더합니다. 단계별 값은 API_CONTRACT.md 9절 표와 같고 3단계 주소는 "<GAS 웹앱 주소>" 그대로 둡니다. 웹 앱 주소를 받아도 README에 옮겨 적지 않습니다(5회차 배포 명령이 public/config.js에 씁니다).
- 내 서버는 backend 폴더의 NestJS(TypeScript)입니다. nest new나 npm init을 쓰지 않고 파일을 직접 만듭니다. 화면 코드는 고치지 않고, 마지막에 public/config.js의 apiBaseUrl만 "http://127.0.0.1:3000"으로 바꿉니다(timeoutMs 5000 그대로).
- backend/package.json: name "aiops-dashboard-student-api", version "1.0.0", private true, description "학생용 텀블러 생산·출고 교육 API", engines node ">=22", scripts build "tsc -p tsconfig.json", start "node dist/main.js", start:local "node --env-file=.env dist/main.js".
- 패키지는 이것만, 버전 앞에 ^·~ 없이 씁니다: dependencies @nestjs/common 11.2.7, @nestjs/core 11.2.7, @nestjs/platform-express 11.2.7, reflect-metadata 0.2.2, rxjs 7.8.2 / devDependencies @types/node 24.4.0, typescript 5.9.3.
- backend/tsconfig.json: target ES2022, module CommonJS, moduleResolution Node, lib ["ES2022", "DOM"], outDir dist, rootDir src, include ["src/**/*.ts"], strict·skipLibCheck·esModuleInterop·experimentalDecorators·emitDecoratorMetadata·forceConsistentCasingInFileNames true. backend/.gitignore는 node_modules/, dist/, var/, .env 네 줄입니다.
- src/main.ts 첫 줄은 import "reflect-metadata";입니다. CORS는 origin "*", methods ["GET"], credentials false입니다. 포트는 PORT, 없으면 3000(1~65535 정수가 아니면 "PORT 값이 잘못되었습니다." 오류), 주소는 HOST, 없으면 127.0.0.1입니다. 전역 주소 접두어·검증 파이프·예외 필터·환경 설정 패키지는 넣지 않습니다.
- 주소는 GET 네 개입니다: /api/v1/health(상태 확인), /api/v1/snapshot(오늘 운영 자료), /api/v1/records(기록 목록), /api/v1/images/:id(현장 사진). images 말고는 응답 헤더 Cache-Control: no-store를 붙입니다. health는 { status: "ok", releaseId: 환경 변수 RELEASE_ID, 없으면 "local" }입니다.
- 응답 모양은 API_CONTRACT.md 2·3·5절과 같습니다. 잘못된 요청은 NestJS 기본 400 모양({"message": 문장, "error": "Bad Request", "statusCode": 400})이고, 정하지 않은 주소는 NestJS 기본 404입니다. 예외 필터는 만들지 않습니다.
- 상태 파일은 환경 변수 STATE_FILE, 없으면 서버를 켠 폴더 기준 ./var/state.json입니다. 없으면 처음 켤 때 폴더와 함께 만들고, 있으면 읽은 내용을 그대로 씁니다. 저장은 2칸 들여쓴 JSON 끝에 줄바꿈을 붙여 같은 이름 + ".next"에 쓴 뒤 이름을 바꿔 옮깁니다.
- 상태 파일 맨 위 키는 sessionId("lesson-" + 만든 시각 ISO + "-1"), records, scenarioId("normal"), revision(1), changedAt(만든 시각)입니다. 화면이 쓰지 않는 예측 상태(services.prediction)와 그 이력은 만들지 않아도 됩니다.
- 상태 파일이 잘못되면 파일을 고치거나 지우지 않고 오류를 내서 서버가 켜지지 않게 합니다. scenarioId가 "normal"이 아니거나 revision이 1 이상 정수가 아니거나 changedAt이 시각이 아니면 "STATE_FILE 내용이 잘못되었습니다. 기존 파일을 보존하고 확인해 주세요.", 기록이 틀리거나 id가 겹치면 "저장된 기록을 확인해 주세요."입니다.
- 기록 한 건은 id(영문·숫자·_·- 1~100자), kind("production"·"shipment"), quantity(1 이상 정수), occurredAt, receivedAt, processedAt(없으면 null) 순서의 키입니다. 시각은 Z로 끝나는 ISO 글자이고 발생 ≤ 접수 ≤ 처리, 처리가 있으면 접수도 있습니다.
- 시드 기록(상태 파일을 만들 때): 오늘 한국 0시부터 지금보다 2분 이른 시각까지를 같은 간격 점으로 나눕니다(점 개수 = 올림(구간 ÷ 20분) + 1, 첫 점 0시, 마지막 점 구간 끝). 생산을 모두 만든 뒤 출고를 잇습니다.
- 시드 수량은 생산 합계 100, 출고 합계 75를 점 개수로 나눈 몫이고 나머지는 앞 기록부터 1씩 더합니다. id는 "seed-production-0"…, "seed-shipment-0"…입니다. 생산 발생은 점 그대로, 출고 발생은 점보다 1초 뒤이고, 두 종류 모두 접수는 발생 2초 뒤, 처리는 접수 3초 뒤입니다. 어느 시각도 지금보다 늦지 않습니다.
- 기준 시각 at(없으면 지금)은 "2026-11-09T"처럼 날짜와 T로 시작하고 끝이 Z나 +09:00 꼴이며, 시각으로 읽히고, 지금 이전이고, 한국 날짜가 오늘이어야 합니다. 아니면 400 "오늘의 현재 이전 시각을 선택해 주세요."입니다. at=처럼 값이 빈 at은 없는 것이 아니라 이 400입니다. 통과하면 Z로 끝나는 ISO로 바꿔 씁니다.
- records는 kind가 production·shipment가 아니면 시각을 보기 전에 400 "생산 또는 출고 기록을 선택해 주세요."입니다. from(없으면 기준 날짜 한국 0시)·to(없으면 기준 시각, from=·to=처럼 값이 비어도 없는 것으로 봄)는 Z나 +09:00 꼴이고 기준 날짜와 같은 한국 날짜이며 from ≤ to ≤ 기준 시각이어야 하고, 아니면 400 "조회 시간 구간을 확인해 주세요."입니다.
- records 결과는 { sessionId, viewTime(기준 시각), records }입니다. 그 kind이고 발생 시각이 from~to(양 끝 포함)인 기록을 발생 시각 순으로 담습니다. 기준 시각보다 늦은 접수·처리 시각은 null로 바꾸고 status를 더합니다(처리가 있으면 completed, 접수만 있으면 processing-wait, 둘 다 없으면 receipt-wait). 시각은 글자가 아니라 숫자로 바꿔 비교합니다.
- snapshot은 schemaVersion 1, scenarioId, revision, changedAt(상태 파일 값, 단 기준 시각보다 늦으면 기준 시각), serverTime(지금), trainingOnly true, sites, services, incidents 뒤에 viewTime(기준 시각), mode(at이 없으면 "current", 있으면 "past"), sessionId를 붙입니다.
- sites.factory는 label "텀블공장", target 120, 생산 기록이고 sites.warehouse는 label "물류창고", target 100, 출고 기록입니다. completed는 발생 시각의 한국 날짜가 기준 날짜와 같고 처리 시각이 기준 시각 이전인 기록의 수량 합이며, 합이 0이면 null입니다.
- lastEventAt·receivedAt·processedAt은 0시~기준 시각 기록 목록(records와 같은 계산)의 마지막 기록 값(없으면 null)이고, processingState는 그 마지막 기록에 처리 시각이 있으면 "completed", 아니면 "waiting"입니다.
- history는 같은 목록에서 처리 시각이 있는 기록을 발생 시각의 UTC 정시(ISO)별로 더한 { timestamp, quantity } 배열(시각 순)입니다. image는 { url: (PUBLIC_BASE_URL 끝 / 뗀 값, 없으면 "http://127.0.0.1:" + (PORT 또는 3000)) + "/api/v1/images/factory"(창고 warehouse), alt: "생산 라인 참고 사진"(창고 "물류창고 참고 사진") }입니다.
- 현장 status는 마지막 기록이 없거나, 기준 시각이 마지막 발생보다 30분 넘게 늦거나, processingState가 completed가 아니면 "warning", 아니면 "normal"입니다. note는 normal이면 "기록이 반영되고 있습니다."입니다. warning이면 마지막 기록이 없으면 label + "의 기록이 없습니다.", 마지막 기록에 처리 시각이 없으면 label + " 기록 처리를 기다리고 있습니다.", 30분 넘게 늦으면 label + " 기록이 30분 넘게 들어오지 않았습니다." 순서로 먼저 맞는 것 하나입니다.
- warning 현장마다 incidents에 { id: "FACTORY-FEED"(창고 "WAREHOUSE-FEED"), scope: "factory"(창고 "warehouse"), level: "warning", title: 그 note, owner: "공장 데이터 담당자"(창고 "창고 데이터 담당자"), action: "기록 수집과 처리 상태를 확인해 주세요." }를 넣습니다.
- services는 api { status: "normal", note: "조회 서비스가 정상입니다." }, alerts { status: "sent", lastAttemptAt: 그 snapshot의 changedAt보다 1분 이른 시각, note: "모의 전송 성공 기록입니다. 실제 알림을 보내지 않았습니다." }입니다.
- images는 id가 factory나 warehouse면 backend/assets/(id).png를 Content-Type image/png로 보냅니다(빌드된 dist 폴더 기준 ../assets). 다른 id는 문장 없이 NestJS 기본 404입니다. 사진은 사용자가 public/assets/approved에서 backend/assets로 복사해 둡니다. 파일은 StreamableFile(createReadStream)로 보내고 res.sendFile은 쓰지 않습니다.
- 이 서버에는 기록을 더하는 기능이 없습니다. 기록을 지금 기준으로 다시 만들 때는 사용자가 서버를 끄고 backend/var/state.json을 지운 뒤 다시 켭니다.
```

- 확인: `AGENTS.md` 맨 끝에 "## 4회차 약속"이 보입니다.

## 4-2. 쓰지 않는 코드 찾기

```text
더 쓰지 않는 파일과 어디서도 부르지 않는 함수·변수를, 검증표·강사가 준 파일·README·그림은 빼고 목록으로 알려 주세요.
연결 설정 파일이 약속대로 네 줄인지, 화면이 그 파일을 먼저 읽는지도 알려 주되 아직 아무것도 고치지 마세요.
```

- 확인: 답에 목록이 나오고 파일은 바뀌지 않았습니다. 쓰지 않는 함수는 사람마다 다르고, 없을 수도 있습니다.

## 4-3. 쓰지 않는 코드 지우기

답에 나온 "지울 것"이 화면 동작에 쓰이는 것이 아닌지 먼저 훑어봅니다.

```text
방금 알려 준 것 가운데 화면 동작에 쓰이지 않는 것만 지워 주세요. 화면 동작은 바꾸지 마세요.
```

- 확인: 새로고침하면 "조회 정상"이고, 생산 기록 화면(`#/records/factory`)과 조회 기록 화면(`#/queries/factory`)이 전처럼 열립니다.

## 4-4. 문법 검사 명령

```text
4회차 약속의 문법 검사 명령을 더해 주세요. 원래 있던 명령과 다른 파일은 바꾸지 마세요.
```

- 직접 하기: 확인용 창(대시보드 폴더)에서 `npm.cmd run check`를 칩니다.
- 확인: 오류 없이 끝납니다.
- 직접 하기: `public\app.js` 맨 끝에 `{`를 하나 넣고 저장한 뒤 `npm.cmd run check`를 칩니다.
- 확인: `SyntaxError`와 줄 번호가 나옵니다. 그 글자를 지우고 다시 치면 오류가 없어집니다.

## 4-5. 시험용 응답 파일 만들기

강사 API로는 볼 수 없는 실패 두 가지(정상 응답 안에 든 오류, JSON이 아닌 응답)를 내 PC에서 봅니다. 5회차 GAS에서 실제로 나올 수 있는 모양입니다.

```text
실패 화면을 확인하려고 4회차 약속의 시험용 응답 파일 두 개를 만들어 주세요. 다른 파일은 바꾸지 마세요.
```

- 확인: 왼쪽 파일 목록에서 `public\test` 아래에 확장자 없는 `snapshot` 파일이 두 개(`error`, `not-json` 쪽) 보입니다.

## 4-6. 시험용 응답으로 실패 안내 보기 (직접 하기)

확인용 창에서 `notepad public\config.js`로 열어 `apiBaseUrl` 값만 바꾸고 저장한 뒤 Chrome을 새로고침합니다. 하나씩 확인합니다.

1. `"http://127.0.0.1:4173/test/error"`
   - 확인: 노란 안내가 "현재 자료를 가져오지 못했습니다. 서버가 요청을 처리하지 못했습니다. 서버가 알린 이유: 시험용 오류입니다. 조회할 자료가 없습니다."입니다.
2. `"http://127.0.0.1:4173/test/not-json"`
   - 확인: 노란 안내가 "현재 자료를 가져오지 못했습니다. 서버 응답이 JSON 형식이 아닙니다. 연결 주소가 API 서버 주소인지 확인해 주세요. 조회할 자료가 없습니다."입니다.
3. 원래 1단계 주소(`API_CONTRACT.md` 9절)로 되돌려 저장합니다. 4-9에서 한 번 더 확인합니다.

## 4-7. README에 실행 방법 적기

```text
4회차 약속대로 README 끝에 실행, 검사, 화면 주소 절을 더해 주세요. 원래 있던 글은 바꾸지 마세요.
실행 절에는 Windows와 macOS 명령, 여는 주소, 멈추는 방법을 적고, 화면 주소 다섯 개는 표로 써 주세요.
```

- 확인: `README.md` 끝에 "실행", "검사", "화면 주소" 세 절이 생겼고, 화면 주소 표에 `#/today`부터 `#/queries/warehouse`까지 다섯 줄이 있습니다.

## 4-8. README에 단계별 설정 값 적기

```text
4회차 약속대로 README 끝에 단계별 연결 설정 값 표를 더해 주세요.
표 아래에는 단계를 바꿀 때는 두 값만 바꾸고, 3단계 주소는 여기 적지 않으며 5회차 배포 명령이 연결 설정 파일에 쓴다는 안내를 한 줄 넣어 주세요.
```

- 확인: 표의 1단계 값이 지금 `public\config.js`와 글자까지 같습니다. 2단계는 `"http://127.0.0.1:3000"`과 `5000`, 3단계는 `"<GAS 웹앱 주소>"`와 `15000`입니다.

## 4-9. 시험용 파일 지우고 1단계 설정 확인

```text
4회차 약속대로 시험용 응답 폴더를 지워 주세요.
그리고 연결 설정이 1단계 값인지 확인해서, 다르면 그 두 값만 고쳐 주세요.
```

- 직접 하기: 확인용 창에서 `npm.cmd run check`를 치고 Chrome을 새로고침합니다.
- 확인: `public\test`가 없어졌고, 검사가 오류 없이 끝나고, 화면이 "조회 정상"입니다. 여기까지가 1단계 정리입니다.

## 4-10. 내 서버 폴더와 패키지 목록

여기부터 대시보드 폴더 안 `backend` 폴더에 내 서버를 만듭니다. 화면 쪽 파일은 4-42에서 한 값만 바꿉니다.

```text
4회차 약속대로 내 서버(NestJS) 폴더와 패키지 목록 파일을 만들어 주세요.
설치는 제가 직접 하니 하지 마세요.
```

- 확인: `backend\package.json`이 생겼고, 버전 숫자 앞에 `^`나 `~`가 없습니다. 아직 `node_modules` 폴더는 없습니다.

## 4-11. TypeScript 설정과 Git 제외 목록

```text
4회차 약속대로 내 서버의 TypeScript 설정 파일과 Git 제외 목록 파일을 만들어 주세요.
```

- 확인: `backend` 안에 `tsconfig.json`과 `.gitignore`가 생겼습니다.

## 4-12. 패키지 설치 (직접 하기)

확인용 창에서 칩니다.

```powershell
cd backend
npm.cmd install
npm.cmd ls --depth=0
```

- 확인: `backend\node_modules`와 `backend\package-lock.json`이 생깁니다. 취약점(vulnerabilities) 안내가 나와도 그대로 둡니다(`npm audit fix`를 치지 않습니다).
- 확인: 마지막 명령에 `@nestjs/common@11.2.7`, `@nestjs/core@11.2.7`, `@nestjs/platform-express@11.2.7`, `@types/node@24.4.0`, `reflect-metadata@0.2.2`, `rxjs@7.8.2`, `typescript@5.9.3` 일곱 줄이 나옵니다.

## 4-13. 서버 시작 파일

```text
4회차 약속대로 내 서버를 켜는 시작 파일을 만들어 주세요. 이 PC 안에서만 열리게 합니다.
앱 모듈은 다음 단계에서 만드니 이번에는 이 파일 하나만 만들고 빌드하지 마세요.
```

- 확인: `backend\src` 안에 시작 파일이 하나 생겼습니다. 앱 모듈이 아직 없어서 지금 빌드하면 오류가 나는 것이 정상입니다.

## 4-14. 상태 확인 주소

```text
서버가 켜져 있는지 답하는 상태 확인 주소 하나만 4회차 약속대로 만들어 주세요.
시작 파일이 부르는 앱 모듈도 이때 함께 만듭니다.
```

- 확인: `backend\src` 안에 파일이 세 개 있습니다.

## 4-15. 빌드하고 처음 켜기 (직접 하기)

Antigravity 아래쪽에 터미널을 하나 더 열어 서버 창으로 씁니다.

```powershell
cd backend
npm.cmd run build
npm.cmd start
```

- 확인: `[Nest]`로 시작하는 줄 가운데 `Mapped {/api/v1/health, GET} route`가 있고, 마지막 줄이 `Nest application successfully started`입니다. 창은 열린 채로 있습니다.
- 확인: Chrome에서 `http://127.0.0.1:3000/api/v1/health`를 열면 `{"status":"ok","releaseId":"local"}`이 보입니다.
- 확인: 확인용 창에서 `curl.exe -i "http://127.0.0.1:3000/api/v1/health"`를 치면 `HTTP/1.1 200 OK`, `Access-Control-Allow-Origin: *`, `Cache-Control: no-store` 줄이 보입니다.
- 확인: `http://127.0.0.1:3000/api/v1/nothing`을 열면 `{"message":"Cannot GET /api/v1/nothing","error":"Not Found","statusCode":404}`입니다. 정하지 않은 주소에는 NestJS가 이렇게 답합니다.
- Windows 방화벽 허용 창이 뜨면 취소하고 강사에게 알립니다. 이 서버는 이 PC 안에서만 열려야 합니다.
- 서버 창에 `EADDRINUSE`가 나오고 서버가 끝나면 3000번 포트를 다른 프로그램이 쓰고 있습니다. 그 프로그램을 닫거나 강사에게 알립니다.

## 4-16. 기록 한 건의 모양

서버를 처음 켤 때 오늘 0시부터 켠 시각까지의 기록을 만들어 둡니다. 이 기록을 시드 기록이라고 부릅니다.

```text
4회차 약속의 기록 한 건 모양을 내 서버 코드로 만들어 주세요.
시각을 받아 한국 시간 날짜("2026-11-09" 꼴)로 바꾸는 도구도 함께 둡니다.
```

- 확인: Antigravity가 만들었다고 알려 줍니다.

## 4-17. 시드 기록의 시각

```text
지금 시각을 받아 시드 기록 목록을 만드는 부분을 4회차 약속대로 만들어 주세요. 이번에는 기록의 시각까지만 정합니다.
```

- 확인: Antigravity가 만들었다고 알려 줍니다.

## 4-18. 시드 기록의 수량과 번호

```text
시드 기록의 수량과 번호를 4회차 약속대로 정해 주세요.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다. 생산은 모두 100개, 출고는 모두 75개가 되도록 나눕니다(4-21에서 셉니다).

## 4-19. 상태 파일 저장

```text
4회차 약속대로 상태 파일을 맡는 부분을 만들어 주세요.
서버를 켤 때 파일이 없으면 시드 기록으로 새로 만들어 저장하고, 있으면 그 내용을 그대로 씁니다.
```

- 확인: Antigravity가 만들었다고 알려 줍니다.

## 4-20. 다시 켜고 상태 파일 보기 (직접 하기)

서버 창에서 Ctrl+C로 끄고 `npm.cmd run build`, `npm.cmd start`를 칩니다.

- 확인: 켤 때의 줄은 4-15와 같고, `backend\var\state.json`이 새로 생겼습니다.
- 확인: `state.json`을 열면 맨 위 키가 `sessionId`(`"lesson-"`으로 시작), `records`, `scenarioId`(`"normal"`), `revision`(`1`), `changedAt`입니다.
- 확인: 시각은 UTC 글자라 한국 시간에서 9시간을 뺀 값입니다. 첫 기록은 `"id": "seed-production-0"`이고 `occurredAt`이 전날 `T15:00:00.000Z`(오늘 한국 0시), `receivedAt`은 2초 뒤, `processedAt`은 5초 뒤입니다. 생산 기록이 모두 나온 뒤 `seed-shipment-0`부터 출고 기록이 이어집니다.
- 건수는 켠 시각에 따라 다릅니다. 한국 시간 오전 10시에 처음 켰으면 생산과 출고가 각각 31건(`-0`부터 `-30`까지)입니다.
- 서버를 끄고 다시 켠 뒤 `state.json`을 다시 열면 `sessionId`가 그대로입니다. 이미 있는 파일을 다시 쓴 것입니다.

## 4-21. 합계 세어 보기

```text
상태 파일의 기록을 생산과 출고로 나눠 건수와 수량 합계를 세어 알려 주세요. 파일은 고치지 마세요.
```

- 확인: 생산 합계 100, 출고 합계 75입니다.

## 4-22. 상태 파일 검사 1: 기본 칸

상태 파일 내용이 잘못됐으면 서버가 켜지지 않고 이유를 서버 창에 남기게 합니다. 잘못된 파일은 고치거나 지우지 않습니다.

```text
서버를 켤 때 이미 있는 상태 파일의 기본 칸을 4회차 약속대로 검사해 주세요.
틀리면 파일을 고치거나 지우지 말고, 서버가 켜지지 않게 합니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-23. 상태 파일 검사 2: 기록

```text
이어서 상태 파일에 저장된 기록도 4회차 약속대로 검사해 주세요. 기본 칸을 먼저, 기록을 그다음에 검사합니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-24. 상태 파일 검사 확인 (직접 하기)

1. 서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.
   - 확인: 정상으로 켜지고, `state.json`의 `sessionId`가 그대로입니다.
2. 서버를 끕니다. `backend\var\state.json`을 열고 파일 끝 쪽 `"scenarioId": "normal",`을 `"scenarioId": "test",`로 바꿔 저장한 뒤 `npm.cmd start`를 칩니다.
   - 확인: 서버 창에 `STATE_FILE 내용이 잘못되었습니다. 기존 파일을 보존하고 확인해 주세요.`가 든 오류 줄이 나오고 서버가 끝납니다.
   - 확인: `state.json`을 다시 열면 `"test"`가 그대로 있습니다. 서버가 파일을 덮어쓰지 않았습니다.
3. `"normal"`로 되돌려 저장하고 `npm.cmd start`를 치면 다시 켜집니다.
4. (선택) 첫 기록의 `"quantity"`를 `0`으로 바꾸면 `저장된 기록을 확인해 주세요.`가 든 오류 줄이 나옵니다. 확인한 뒤 원래 숫자로 되돌립니다. 원래 숫자를 잊었으면 4-41로 상태 파일을 새로 만듭니다.

## 4-25. 기준 시각 검사

기록 화면(`#/records/factory`, `#/records/warehouse`)이 읽는 기록 목록을 만듭니다. 여기서 만드는 기준 시각 검사는 오늘 운영 자료에서도 그대로 씁니다.

```text
요청에 담긴 기준 시각을 검사하는 부분을 4회차 약속대로 만들어 주세요. 기준 시각이 없으면 지금 시각을 씁니다.
```

- 확인: Antigravity가 만들었다고 알려 줍니다.

## 4-26. 기록 고르기

```text
한 종류의 기록을 시간 구간으로 골라 발생 시각 순으로 돌려주는 부분을 4회차 약속대로 만들어 주세요.
저장된 기록 자체는 바꾸지 않습니다.
```

- 확인: Antigravity가 만들었다고 알려 줍니다.

## 4-27. 기준 시각 뒤의 접수·처리 가리기

```text
고른 기록에서 기준 시각보다 늦은 접수·처리 시각은 비우고, 4회차 약속대로 기록 상태를 붙여 돌려주세요.
이 부분은 뒤에서 오늘 운영 자료를 만들 때도 다시 씁니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-28. 기록 목록 주소

```text
4회차 약속대로 기록 목록 주소를 더해 주세요. 앞에서 만든 기준 시각 검사와 기록 고르기를 씁니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-29. 기록 목록 확인 (직접 하기)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.

- 확인: 켤 때의 줄에 `Mapped {/api/v1/records, GET} route`가 더해졌습니다.
- 확인: `http://127.0.0.1:3000/api/v1/records?kind=production`을 열면 `{"sessionId":"lesson-…","viewTime":"…","records":[…]}`이고, 기록이 발생 시각 순서이며 모두 `"status":"completed"`입니다. `?kind=shipment`는 출고 기록만 나옵니다.
- 확인: `?kind=abc`는 `{"message":"생산 또는 출고 기록을 선택해 주세요.","error":"Bad Request","statusCode":400}`입니다.
- 확인: `?kind=production&at=2099-01-01T00:00:00Z`는 `"오늘의 현재 이전 시각을 선택해 주세요."`, `?kind=production&from=2099-01-01T00:00:00Z`는 `"조회 시간 구간을 확인해 주세요."`가 들어간 400입니다.
- 확인: 첫 생산 기록의 `occurredAt`을 복사해 초 자리 `00.000Z`를 `03.000Z`로 바꾼 뒤 `at`에 넣어 엽니다(예: `?kind=production&at=2026-11-08T15:00:03.000Z`). 기록이 1건만 나오고 `receivedAt`은 값이 있고 `processedAt`은 `null`, `status`는 `"processing-wait"`입니다. 처리 시각(5초 뒤)이 기준 시각(3초 뒤)보다 늦어서 가려진 것입니다.

## 4-30. 오늘 운영 자료의 기본 모양

오늘 운영 화면(`#/today`)이 10초마다 읽는 자료를 만듭니다. 모양을 먼저 만들고 두 현장 값은 4-34부터 채웁니다.

```text
화면이 10초마다 읽는 오늘 운영 자료의 기본 모양을 4회차 약속대로 만들어 주세요.
두 현장의 이름과 목표만 넣고, 수량과 시각은 아직 비워 둡니다.
```

- 확인: Antigravity가 만들었다고 알려 줍니다.

## 4-31. 조회 서비스와 알림 전송 상태

```text
오늘 운영 자료에 조회 서비스 상태와 알림 전송 상태를 4회차 약속대로 채워 주세요.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-32. 오늘 운영 자료 주소

```text
4회차 약속대로 오늘 운영 자료 주소를 더해 주세요. 기준 시각 검사는 기록 목록과 같은 것을 씁니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-33. 오늘 운영 자료 모양 확인 (직접 하기)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.

- 확인: 켤 때의 줄에 `Mapped {/api/v1/snapshot, GET} route`가 더해졌습니다.
- 확인: `http://127.0.0.1:3000/api/v1/snapshot`을 열면 `schemaVersion`(1), `scenarioId`("normal"), `trainingOnly`(true), `sites`, `services`, `incidents`, `viewTime`, `mode`("current"), `sessionId`가 보입니다. `viewTime`과 `serverTime`이 같고, `sessionId`는 4-29의 기록 목록과 같습니다.
- 확인: `sites`에 `"텀블공장"`(목표 `120`)과 `"물류창고"`(목표 `100`)가 있습니다. 수량과 시각은 아직 비어 있습니다(`null`). 4-34부터 채웁니다.
- 확인: `services.alerts.lastAttemptAt`이 `changedAt`보다 정확히 1분 이릅니다.
- 확인: 첫 생산 기록의 `occurredAt`(전날 `T15:00:00.000Z`)을 `?at=`에 넣어 열면 `mode`가 `"past"`, `viewTime`이 그 시각입니다.
- 확인: `?at=2099-01-01T00:00:00Z`는 400 `"오늘의 현재 이전 시각을 선택해 주세요."`입니다.

## 4-34. 현장 수량과 마지막 기록

```text
오늘 운영 자료의 두 현장에 완료 수량과 마지막 기록의 시각을 4회차 약속대로 채워 주세요.
공장은 생산 기록, 창고는 출고 기록을 씁니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-35. 시간별 그래프와 사진 주소

```text
두 현장에 시간별 그래프 자료와 사진 주소를 4회차 약속대로 더해 주세요.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-36. 현장 상태와 확인할 일

```text
두 현장의 상태와 안내 문장, 확인할 일 목록을 4회차 약속대로 채워 주세요.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-37. 현장 값 확인 (직접 하기)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켠 뒤 `http://127.0.0.1:3000/api/v1/snapshot`을 엽니다.

- 확인: `sites.factory.completed`가 `100`, `sites.warehouse.completed`가 `75`, `target`은 `120`과 `100`입니다. `image.url`은 `http://127.0.0.1:3000/api/v1/images/factory`, `…/warehouse`입니다(사진은 4-39에서 보이게 합니다).
- 확인: 한 현장의 `history`에 있는 `quantity`를 모두 더하면 그 현장의 `completed`와 같습니다.
- 확인: 4-20에서 처음 켠 지 28분이 안 됐으면 두 현장 모두 `"status":"normal"`, note `"기록이 반영되고 있습니다."`, `incidents`는 `[]`입니다. 28분이 넘었으면 두 현장 모두 `"warning"`, note가 `"텀블공장 기록이 30분 넘게 들어오지 않았습니다."`·`"물류창고 기록이 30분 넘게 들어오지 않았습니다."`이고 `incidents`가 2건입니다. 마지막 시드 기록이 처음 켠 시각의 2분 전이고 그 뒤로 기록이 늘지 않아서 이렇게 되는 것이 맞습니다.
- 확인: 첫 생산 기록의 `occurredAt`(전날 `T15:00:00.000Z`)을 `?at=`에 넣으면 공장은 `completed`가 `null`, note가 `"텀블공장 기록 처리를 기다리고 있습니다."`, 창고는 note가 `"물류창고의 기록이 없습니다."`이고 `incidents`에 `FACTORY-FEED`와 `WAREHOUSE-FEED`가 있습니다.
- 확인: 같은 시각의 초 자리를 `30.000Z`로 바꾸면 두 현장 모두 `"normal"`이고, `completed`가 각 현장 첫 기록(`seed-production-0`, `seed-shipment-0`)의 `quantity`와 같습니다.

## 4-38. 현장 사진 복사 (직접 하기)

확인용 창을 대시보드 폴더(`backend`의 한 단계 위, 4-12에서 `cd backend`를 했으면 `cd ..`)로 옮기고 칩니다. 탐색기에서 복사해 붙여 넣어도 됩니다.

```powershell
mkdir backend\assets
copy public\assets\approved\factory.png backend\assets\
copy public\assets\approved\warehouse.png backend\assets\
```

- 확인: `backend\assets` 안에 `factory.png`, `warehouse.png`가 있습니다. `public\assets\approved`의 사진도 그대로 남아 있습니다.

## 4-39. 현장 사진 주소

```text
4회차 약속대로 현장 사진을 보내는 주소를 더해 주세요. 사진 파일은 열거나 바꾸지 마세요.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-40. 현장 사진 확인 (직접 하기)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.

- 확인: 켤 때의 줄에 `Mapped {/api/v1/images/:id, GET} route`가 더해졌습니다.
- 확인: `http://127.0.0.1:3000/api/v1/images/factory`를 열면 컨베이어 위 상자 그림이, `…/images/warehouse`를 열면 물류창고 그림이 보입니다.
- 확인: 확인용 창에서 `curl.exe -I "http://127.0.0.1:3000/api/v1/images/factory"`를 치면 `HTTP/1.1 200 OK`, `Access-Control-Allow-Origin: *`, `Content-Type: image/png` 줄이 보입니다.
- 확인: `…/images/abc`를 열면 `{"message":"Not Found","statusCode":404}`입니다. 이때 서버 창에 `WARN [ExpressAdapter] Content-Type doesn't match Reply body…` 줄이 찍힐 수도 있습니다(찍히지 않아도 정상입니다).
- 그림 대신 깨진 그림 표시가 나오면 확인용 창에서 `curl.exe -i "http://127.0.0.1:3000/api/v1/images/factory"`를 칩니다. `400 Bad Request`와 `ENOENT: no such file or directory`가 나오면 `backend\assets`에 사진이 없는 것입니다. 4-38을 다시 합니다.

## 4-41. 상태 파일 새로 만들기 (직접 하기)

이 서버에는 기록을 더하는 기능이 없어서, 켠 뒤로는 기록이 늘지 않습니다. 시드 기록을 지금 시각 기준으로 다시 만들 때 이 순서를 씁니다. 화면을 처음 연결하기 전에 한 번 합니다.

- 쓰는 때: 수업을 시작할 때(날짜가 바뀌면 "…의 기록이 없습니다." 경고가 나옵니다), 처음 켠 지 28분이 지나 "기록이 30분 넘게 들어오지 않았습니다." 경고가 나올 때, `state.json`을 고쳤다가 되돌리기 어려울 때.

서버 창(`backend` 폴더)에서 Ctrl+C로 끄고 칩니다. Antigravity 파일 목록에서 `backend\var\state.json`을 지워도 됩니다.

```powershell
del var\state.json
npm.cmd start
```

- 확인: `backend\var\state.json`이 다시 생기고 `sessionId`가 방금 켠 시각을 담은 새 글자로 바뀝니다.
- 확인: `http://127.0.0.1:3000/api/v1/snapshot`의 두 현장이 `"normal"`, `incidents`가 `[]`이고, 생산 `completed`는 100, 출고는 75입니다.

## 4-42. 화면을 내 서버에 연결

```text
4회차 약속대로 화면의 연결 주소만 내 서버 주소로 바꿔 주세요. 기다리는 시간과 다른 파일은 그대로 둡니다.
```

- 확인: `public\config.js`가 여전히 네 줄이고 `apiBaseUrl`만 `"http://127.0.0.1:3000"`으로 바뀌었습니다(끝에 `/` 없음). 1단계로 되돌릴 때는 4-8에서 README에 적은 값을 씁니다.

## 4-43. 내 서버 값으로 화면 보기 (직접 하기)

서버 창(`backend`, 3000)과 화면 창(대시보드 폴더, 4173)이 둘 다 켜져 있는지 보고, Chrome에서 `http://127.0.0.1:4173`을 새로고침합니다.

- 확인: 1단계와 같은 배치로 "생산 100개 · 목표 120개", "출고 75개 · 목표 100개", 현장 사진 두 장, 시간별 그래프가 보이고 머리 부분은 "조회 정상"입니다.
- 확인: 알림 전송 기록 카드는 "전송 성공", "알림 전송이 완료됐습니다."와 마지막 전송 시도 시각을 보여 줍니다.
- 확인: F12, Network 탭에서 `snapshot` 요청이 10초마다 `http://127.0.0.1:3000/api/v1/snapshot`으로 나가고 상태가 200입니다. 사진 요청은 `http://127.0.0.1:3000/api/v1/images/factory`, `…/warehouse`입니다. Console 탭에 CORS 오류가 없습니다.
- 확인: 생산 기록 화면과 출고 기록 화면의 줄 수가 `state.json`의 생산·출고 건수와 같습니다.
- 확인: 머리 부분의 기준 시각에서 오늘의 지난 정시를 고르면 Network 탭에 `?at=`이 붙은 요청이 보이고 그때까지의 수량으로 바뀝니다. "현재로 돌아가기"를 누르면 10초 조회가 다시 시작합니다.
- 처음 켠 지 28분이 넘으면 두 현장이 "확인 필요"이고 "기록이 30분 넘게 들어오지 않았습니다." 안내가 보입니다. 4-41로 새로 만들면 정상 표시로 돌아옵니다.

## 4-44. 확인 실습: 서버가 멈추거나 요청이 잘못됐을 때 (직접 하기)

화면의 안내와 서버 쪽에서 보이는 것을 맞춰 봅니다. 서버 코드는 고치지 않습니다.

1. **서버를 끈 경우**: 화면을 연 채 서버 창에서 Ctrl+C로 서버를 끕니다.
   - 확인: 10초 안에 머리 부분이 "조회 실패"로 바뀌고 "API 서버에 연결하지 못했습니다. 연결 주소가 맞는지, 직접 띄운 서버라면 켜져 있는지 확인해 주세요. …"와 "아래 내용은 이전 조회 자료입니다."가 나옵니다. 숫자와 그래프는 마지막 정상 자료 그대로입니다.
   - 확인: `npm.cmd start`로 다시 켜면 다음 조회에서 "조회 정상"으로 돌아오고 숫자도 같습니다. 같은 `state.json`을 다시 읽었기 때문입니다.
2. **상태 파일이 깨진 경우**: 서버를 끄고 `backend\var\state.json`에서 첫 기록의 `"id": "seed-production-0",` 줄 끝 쉼표 하나를 지우고 저장한 뒤 `npm.cmd start`를 칩니다.
   - 확인: 서버가 켜지지 않고 서버 창에 `SyntaxError: …in JSON at position …`이 든 오류 줄이 나온 뒤 끝납니다. 화면은 1번과 같은 연결 실패 안내입니다.
   - 쉼표를 되돌리고 `npm.cmd start`를 치면 다시 켜집니다. 되돌리기 어려우면 4-41로 새로 만듭니다.
3. **요청이 잘못된 경우**: 서버를 켠 채 Chrome 새 탭에서 `http://127.0.0.1:3000/api/v1/records?kind=production&from=2099-01-01T00:00:00Z`를 엽니다.
   - 확인: `{"message":"조회 시간 구간을 확인해 주세요.","error":"Bad Request","statusCode":400}`이 보이고 서버 창에는 줄이 생기지 않습니다.
   - 확인: `http://127.0.0.1:3000/api/v1/snapshot?at=2099-01-01T00:00:00Z`는 `"오늘의 현재 이전 시각을 선택해 주세요."`입니다.
   - 화면은 HTTP 오류가 오면 "서버가 요청 조건을 받아들이지 않았습니다(HTTP 400)."까지만 보여 줍니다. 이유는 F12, Network 탭에서 그 요청을 눌러 Response(응답)에서 봅니다.

## 4-45. 원인 물어보기

4-44의 2번이나 3번을 하면서 아래 프롬프트의 괄호 부분을 채워 붙여 넣습니다.

```text
대시보드 화면에 "(화면에 나온 안내 문구)"가 나옵니다. 아래 서버 창의 줄(또는 브라우저에 나온 응답 본문)을 보고 원인과 되돌리는 방법을 설명해 주세요. 코드는 고치지 마세요.
(서버 창의 줄이나 응답 본문을 여기에 붙여 넣습니다)
```

- 확인: Antigravity가 안내 문구와 서버 창의 줄(또는 400 응답의 `message`)을 이어서 설명합니다. 2번이면 `state.json`의 쉼표 위치를, 3번이면 `from`이나 `at` 값을 가리키면 맞습니다.
- 서버 코드에 오류 처리를 더하거나 화면 코드를 고치자고 하면 받아들이지 않습니다. 이 서버는 상태 파일이 잘못되면 켜지지 않는 것이 정해진 동작입니다.

## 4회차 끝 확인

- [ ] `public\test`가 없고, 쓰지 않는 코드가 정리됐습니다.
- [ ] 대시보드 폴더에서 `npm.cmd run check`가 오류 없이 끝납니다.
- [ ] `README.md`에 실행, 검사, 화면 주소 다섯 개, 단계별 `public/config.js` 값 표가 있습니다.
- [ ] `backend` 폴더에서 `npm.cmd ls --depth=0`을 치면 4-12의 일곱 패키지가 같은 버전으로 나옵니다.
- [ ] 서버 창의 `npm.cmd start`에 `Mapped` 줄이 health, records, snapshot, images 네 개이고 `Nest application successfully started`로 끝납니다.
- [ ] `http://127.0.0.1:3000/api/v1/health`가 `{"status":"ok","releaseId":"local"}`입니다.
- [ ] `http://127.0.0.1:3000/api/v1/snapshot`에서 생산 `completed` 100, 출고 75, `image.url`이 `http://127.0.0.1:3000/api/v1/images/…`입니다.
- [ ] `backend\var\state.json`은 서버를 처음 켤 때 생기고, 다시 켜도 `sessionId`가 그대로입니다. 내용이 잘못되면 서버가 켜지지 않고 파일은 그대로 남습니다.
- [ ] `public\config.js`는 네 줄이고 `apiBaseUrl`만 `"http://127.0.0.1:3000"`, `timeoutMs`는 `5000`입니다.
- [ ] `http://127.0.0.1:4173`에서 1단계와 같은 화면이 내 서버 값으로 "조회 정상", 사진 두 장, 시간별 그래프, 기록 화면 표와 함께 보입니다.
- [ ] 서버를 끄면 "조회 실패"와 이전 자료, 다시 켜면 "조회 정상"입니다. 잘못된 요청은 400 응답 본문에 이유가 있습니다.

다 되지 않았으면 [README.md](README.md)의 공통 안내대로 `milestone-4` 브랜치를 받아 5회차를 시작합니다. 그 브랜치에는 서버 패키지가 설치되어 있지 않으므로, 받은 뒤 서버 창에서 `cd backend`, `npm.cmd ci`, `npm.cmd run build`, `npm.cmd start`를 차례로 칩니다. `backend\var`는 브랜치에 들어 있지 않아서 처음 켤 때 `state.json`이 새로 만들어집니다.

## 부록: AGENTS.md 4회차 약속

4-1에서 덧붙이는 글 전문입니다.

```markdown
## 4회차 약속
- 1단계 정리: package.json scripts에 "check": "node --check public/app.js && node --check public/config.js && node --check scripts/serve.mjs"를 더합니다.
- 시험용 응답 파일(확장자 없음): public/test/error/api/v1/snapshot 내용 {"error":"시험용 오류입니다."}, public/test/not-json/api/v1/snapshot 내용은 JSON이 아닌 글 한 줄(예: 시험용 글자입니다)입니다. public/test 폴더는 사용자가 지우라고 할 때 지웁니다.
- README.md 끝에 "실행", "검사", "화면 주소", "단계별 public/config.js 값" 절을 더합니다. 단계별 값은 API_CONTRACT.md 9절 표와 같고 3단계 주소는 "<GAS 웹앱 주소>" 그대로 둡니다. 웹 앱 주소를 받아도 README에 옮겨 적지 않습니다(5회차 배포 명령이 public/config.js에 씁니다).
- 내 서버는 backend 폴더의 NestJS(TypeScript)입니다. nest new나 npm init을 쓰지 않고 파일을 직접 만듭니다. 화면 코드는 고치지 않고, 마지막에 public/config.js의 apiBaseUrl만 "http://127.0.0.1:3000"으로 바꿉니다(timeoutMs 5000 그대로).
- backend/package.json: name "aiops-dashboard-student-api", version "1.0.0", private true, description "학생용 텀블러 생산·출고 교육 API", engines node ">=22", scripts build "tsc -p tsconfig.json", start "node dist/main.js", start:local "node --env-file=.env dist/main.js".
- 패키지는 이것만, 버전 앞에 ^·~ 없이 씁니다: dependencies @nestjs/common 11.2.7, @nestjs/core 11.2.7, @nestjs/platform-express 11.2.7, reflect-metadata 0.2.2, rxjs 7.8.2 / devDependencies @types/node 24.4.0, typescript 5.9.3.
- backend/tsconfig.json: target ES2022, module CommonJS, moduleResolution Node, lib ["ES2022", "DOM"], outDir dist, rootDir src, include ["src/**/*.ts"], strict·skipLibCheck·esModuleInterop·experimentalDecorators·emitDecoratorMetadata·forceConsistentCasingInFileNames true. backend/.gitignore는 node_modules/, dist/, var/, .env 네 줄입니다.
- src/main.ts 첫 줄은 import "reflect-metadata";입니다. CORS는 origin "*", methods ["GET"], credentials false입니다. 포트는 PORT, 없으면 3000(1~65535 정수가 아니면 "PORT 값이 잘못되었습니다." 오류), 주소는 HOST, 없으면 127.0.0.1입니다. 전역 주소 접두어·검증 파이프·예외 필터·환경 설정 패키지는 넣지 않습니다.
- 주소는 GET 네 개입니다: /api/v1/health(상태 확인), /api/v1/snapshot(오늘 운영 자료), /api/v1/records(기록 목록), /api/v1/images/:id(현장 사진). images 말고는 응답 헤더 Cache-Control: no-store를 붙입니다. health는 { status: "ok", releaseId: 환경 변수 RELEASE_ID, 없으면 "local" }입니다.
- 응답 모양은 API_CONTRACT.md 2·3·5절과 같습니다. 잘못된 요청은 NestJS 기본 400 모양({"message": 문장, "error": "Bad Request", "statusCode": 400})이고, 정하지 않은 주소는 NestJS 기본 404입니다. 예외 필터는 만들지 않습니다.
- 상태 파일은 환경 변수 STATE_FILE, 없으면 서버를 켠 폴더 기준 ./var/state.json입니다. 없으면 처음 켤 때 폴더와 함께 만들고, 있으면 읽은 내용을 그대로 씁니다. 저장은 2칸 들여쓴 JSON 끝에 줄바꿈을 붙여 같은 이름 + ".next"에 쓴 뒤 이름을 바꿔 옮깁니다.
- 상태 파일 맨 위 키는 sessionId("lesson-" + 만든 시각 ISO + "-1"), records, scenarioId("normal"), revision(1), changedAt(만든 시각)입니다. 화면이 쓰지 않는 예측 상태(services.prediction)와 그 이력은 만들지 않아도 됩니다.
- 상태 파일이 잘못되면 파일을 고치거나 지우지 않고 오류를 내서 서버가 켜지지 않게 합니다. scenarioId가 "normal"이 아니거나 revision이 1 이상 정수가 아니거나 changedAt이 시각이 아니면 "STATE_FILE 내용이 잘못되었습니다. 기존 파일을 보존하고 확인해 주세요.", 기록이 틀리거나 id가 겹치면 "저장된 기록을 확인해 주세요."입니다.
- 기록 한 건은 id(영문·숫자·_·- 1~100자), kind("production"·"shipment"), quantity(1 이상 정수), occurredAt, receivedAt, processedAt(없으면 null) 순서의 키입니다. 시각은 Z로 끝나는 ISO 글자이고 발생 ≤ 접수 ≤ 처리, 처리가 있으면 접수도 있습니다.
- 시드 기록(상태 파일을 만들 때): 오늘 한국 0시부터 지금보다 2분 이른 시각까지를 같은 간격 점으로 나눕니다(점 개수 = 올림(구간 ÷ 20분) + 1, 첫 점 0시, 마지막 점 구간 끝). 생산을 모두 만든 뒤 출고를 잇습니다.
- 시드 수량은 생산 합계 100, 출고 합계 75를 점 개수로 나눈 몫이고 나머지는 앞 기록부터 1씩 더합니다. id는 "seed-production-0"…, "seed-shipment-0"…입니다. 생산 발생은 점 그대로, 출고 발생은 점보다 1초 뒤이고, 두 종류 모두 접수는 발생 2초 뒤, 처리는 접수 3초 뒤입니다. 어느 시각도 지금보다 늦지 않습니다.
- 기준 시각 at(없으면 지금)은 "2026-11-09T"처럼 날짜와 T로 시작하고 끝이 Z나 +09:00 꼴이며, 시각으로 읽히고, 지금 이전이고, 한국 날짜가 오늘이어야 합니다. 아니면 400 "오늘의 현재 이전 시각을 선택해 주세요."입니다. at=처럼 값이 빈 at은 없는 것이 아니라 이 400입니다. 통과하면 Z로 끝나는 ISO로 바꿔 씁니다.
- records는 kind가 production·shipment가 아니면 시각을 보기 전에 400 "생산 또는 출고 기록을 선택해 주세요."입니다. from(없으면 기준 날짜 한국 0시)·to(없으면 기준 시각, from=·to=처럼 값이 비어도 없는 것으로 봄)는 Z나 +09:00 꼴이고 기준 날짜와 같은 한국 날짜이며 from ≤ to ≤ 기준 시각이어야 하고, 아니면 400 "조회 시간 구간을 확인해 주세요."입니다.
- records 결과는 { sessionId, viewTime(기준 시각), records }입니다. 그 kind이고 발생 시각이 from~to(양 끝 포함)인 기록을 발생 시각 순으로 담습니다. 기준 시각보다 늦은 접수·처리 시각은 null로 바꾸고 status를 더합니다(처리가 있으면 completed, 접수만 있으면 processing-wait, 둘 다 없으면 receipt-wait). 시각은 글자가 아니라 숫자로 바꿔 비교합니다.
- snapshot은 schemaVersion 1, scenarioId, revision, changedAt(상태 파일 값, 단 기준 시각보다 늦으면 기준 시각), serverTime(지금), trainingOnly true, sites, services, incidents 뒤에 viewTime(기준 시각), mode(at이 없으면 "current", 있으면 "past"), sessionId를 붙입니다.
- sites.factory는 label "텀블공장", target 120, 생산 기록이고 sites.warehouse는 label "물류창고", target 100, 출고 기록입니다. completed는 발생 시각의 한국 날짜가 기준 날짜와 같고 처리 시각이 기준 시각 이전인 기록의 수량 합이며, 합이 0이면 null입니다.
- lastEventAt·receivedAt·processedAt은 0시~기준 시각 기록 목록(records와 같은 계산)의 마지막 기록 값(없으면 null)이고, processingState는 그 마지막 기록에 처리 시각이 있으면 "completed", 아니면 "waiting"입니다.
- history는 같은 목록에서 처리 시각이 있는 기록을 발생 시각의 UTC 정시(ISO)별로 더한 { timestamp, quantity } 배열(시각 순)입니다. image는 { url: (PUBLIC_BASE_URL 끝 / 뗀 값, 없으면 "http://127.0.0.1:" + (PORT 또는 3000)) + "/api/v1/images/factory"(창고 warehouse), alt: "생산 라인 참고 사진"(창고 "물류창고 참고 사진") }입니다.
- 현장 status는 마지막 기록이 없거나, 기준 시각이 마지막 발생보다 30분 넘게 늦거나, processingState가 completed가 아니면 "warning", 아니면 "normal"입니다. note는 normal이면 "기록이 반영되고 있습니다."입니다. warning이면 마지막 기록이 없으면 label + "의 기록이 없습니다.", 마지막 기록에 처리 시각이 없으면 label + " 기록 처리를 기다리고 있습니다.", 30분 넘게 늦으면 label + " 기록이 30분 넘게 들어오지 않았습니다." 순서로 먼저 맞는 것 하나입니다.
- warning 현장마다 incidents에 { id: "FACTORY-FEED"(창고 "WAREHOUSE-FEED"), scope: "factory"(창고 "warehouse"), level: "warning", title: 그 note, owner: "공장 데이터 담당자"(창고 "창고 데이터 담당자"), action: "기록 수집과 처리 상태를 확인해 주세요." }를 넣습니다.
- services는 api { status: "normal", note: "조회 서비스가 정상입니다." }, alerts { status: "sent", lastAttemptAt: 그 snapshot의 changedAt보다 1분 이른 시각, note: "모의 전송 성공 기록입니다. 실제 알림을 보내지 않았습니다." }입니다.
- images는 id가 factory나 warehouse면 backend/assets/(id).png를 Content-Type image/png로 보냅니다(빌드된 dist 폴더 기준 ../assets). 다른 id는 문장 없이 NestJS 기본 404입니다. 사진은 사용자가 public/assets/approved에서 backend/assets로 복사해 둡니다. 파일은 StreamableFile(createReadStream)로 보내고 res.sendFile은 쓰지 않습니다.
- 이 서버에는 기록을 더하는 기능이 없습니다. 기록을 지금 기준으로 다시 만들 때는 사용자가 서버를 끄고 backend/var/state.json을 지운 뒤 다시 켭니다.
```
