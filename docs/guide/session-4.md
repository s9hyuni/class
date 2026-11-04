# 4회차 보충 문서: 1단계 정리와 내 NestJS 서버

> 이 문서는 4회차 프롬프트가 만드는 내용의 자세한 약속입니다. 앞 회차 문서에 이어지며, 앞 문서와 다르면 이 문서를 따릅니다.

## 이 문서를 읽는 법

- 백틱 안의 글은 이름이나 값입니다. 글자 그대로 씁니다.
- 큰따옴표 안의 글은 화면에 나오는 글자이거나 코드에 들어가는 값입니다. 한 글자도 바꾸지 않습니다.
- "쓰는 단계"는 그 내용을 만드는 프롬프트 번호입니다. 프롬프트 맨 앞의 `[2-14]` 같은 표시가 이번 단계입니다. 그 번호가 "쓰는 단계"나 줄 앞에 적힌 내용만 만들고, 다른 번호의 내용은 그 프롬프트를 받기 전에 만들지 않습니다.
- 창고 쪽 이름은 공장 쪽 이름의 `factory`를 `warehouse`로 바꾼 같은 이름입니다.

## 이 회차에서 만드는 것

- 시작 상태: 화면이 강사 API 값으로 10초마다 바뀌고 실패 안내·과거 시각·조회 기록이 동작합니다. `backend` 폴더는 아직 없습니다.
- 끝 상태: 쓰지 않는 코드를 지웠고 `npm.cmd run check`로 문법을 검사하며 `README.md`에 실행 방법과 단계별 설정 값이 있습니다. `backend` 폴더의 NestJS 서버가 `http://127.0.0.1:3000`에서 켜지고, 처음 켤 때 오늘 기록(생산 100개, 출고 75개)을 만들어 `backend/var/state.json`에 저장합니다. 화면은 1단계와 같은 모습으로 이 서버의 값을 보여 줍니다.
- 이번에 건드리지 않는 곳: 화면 코드입니다. 쓰지 않는 코드를 지우는 일을 빼면 `public` 폴더에서는 마지막에 `public/config.js`의 `apiBaseUrl` 한 값만 바꿉니다.

프롬프트가 만드는 순서입니다. 이번 프롬프트 번호가 쓰는 단계에 있는 내용만 만듭니다. 아직 번호가 오지 않은 주소와 값은 미리 만들지 않습니다.

| 프롬프트 | 만드는 것 |
|---|---|
| 4-1, 4-2 | 쓰지 않는 코드를 찾고 지우기 |
| 4-3 | 문법 검사 명령 |
| 4-4 | 시험용 응답 파일 |
| 4-6 | `README.md`의 실행 방법과 단계별 값 |
| 4-7 | 시험용 응답 폴더 지우기, 1단계 값 확인 |
| 4-8 | `backend` 폴더, 패키지 목록, TypeScript 설정, Git 제외 목록 |
| 4-10 | 시작 파일, 앱 모듈, 상태 확인 주소 |
| 4-12 | 기록 한 건의 모양, 시드 기록, 상태 파일 저장 |
| 4-15 | 상태 파일 검사 |
| 4-17 | 기준 시각 검사, 기록 고르기, 기록 목록 주소 |
| 4-19 | 오늘 운영 자료의 모양과 주소. 두 현장은 이름과 목표만 |
| 4-21 | 두 현장의 수량, 시각, 그래프, 사진 주소, 상태, 확인할 일 |
| 4-24 | 현장 사진 주소 |
| 4-27 | 화면의 연결 주소 |

4-14와 4-30은 파일을 고치지 않고 답만 합니다.

## 앞 회차에서 바뀌는 것

- 1회차 문서의 package.json scripts는 `start` 하나였습니다. 4-3에서 `check`를 더합니다.
- 3회차 문서의 `apiBaseUrl`은 `API_CONTRACT.md` 9절의 1단계 주소였습니다. 4-27에서 `http://127.0.0.1:3000`으로 바꿉니다. `timeoutMs`는 그대로입니다.

## 1단계 정리

쓰는 단계: 4-1 ~ 4-4, 4-6, 4-7

1단계 정리는 쓰지 않는 코드, 문법 검사, 시험용 응답, README, 되돌리기입니다. 시험용 응답 파일로 강사 API로는 볼 수 없는 실패 두 가지(정상 응답 안에 든 오류, JSON이 아닌 응답)를 내 PC에서 봅니다. 5회차 GAS에서 실제로 나올 수 있는 모양입니다.

### 약속

- 쓰지 않는 것을 찾을 때는 더 쓰지 않는 파일과 어디서도 부르지 않는 함수·변수를 찾되, 검증표·강사가 준 파일·README·그림은 뺍니다. 연결 설정 파일이 네 줄인지(3회차 문서의 약속), 화면이 그 파일을 먼저 읽는지도 함께 알립니다.
- 지울 때는 화면 동작에 쓰이지 않는 것만 지우고 화면 동작은 바꾸지 않습니다.
- 1단계 정리: package.json scripts에 "check": "node --check public/app.js && node --check public/config.js && node --check scripts/serve.mjs"를 더합니다.
- 시험용 응답 파일(확장자 없음): public/test/error/api/v1/snapshot 내용 {"error":"시험용 오류입니다."}, public/test/not-json/api/v1/snapshot 내용은 JSON이 아닌 글 한 줄(예: 시험용 글자입니다)입니다. public/test 폴더는 사용자가 지우라고 할 때 지웁니다.
- 프롬프트에서 프로젝트 소개 글이라고 하면 맨 위 `README.md`입니다.
- README.md 끝에 "실행", "검사", "화면 주소", "단계별 public/config.js 값" 절을 더합니다. 단계별 값은 API_CONTRACT.md 9절 표와 같고 3단계 주소는 "<GAS 웹앱 주소>" 그대로 둡니다. 웹 앱 주소를 받아도 README에 옮겨 적지 않습니다(5회차 배포 명령이 public/config.js에 씁니다).
- 실행 절에는 Windows와 macOS 명령, 여는 주소, 멈추는 방법을 적고 화면 주소 다섯 개는 표로 씁니다.
- 단계별 값 표 아래에는 단계를 바꿀 때는 두 값만 바꾸고, 3단계 주소는 여기 적지 않으며 5회차 배포 명령이 연결 설정 파일에 쓴다는 안내를 한 줄 넣습니다.
- 1단계 값은 `API_CONTRACT.md` 9절 표의 값입니다.

## 내 서버의 구성

쓰는 단계: 4-8, 4-10, 4-27

여기부터 대시보드 폴더 안 `backend` 폴더에 내 서버를 만듭니다. 4-8은 패키지 목록과 설정 파일까지이고 설치는 사용자가 합니다. 시작 파일과 앱 모듈은 4-10에서 함께 만듭니다. 연결 주소를 바꾸는 일은 4-27에서 합니다.

### 약속: 4-8에 만드는 파일

- 내 서버는 backend 폴더의 NestJS(TypeScript)입니다. nest new나 npm init을 쓰지 않고 파일을 직접 만듭니다. 화면 코드는 고치지 않고, 마지막에 public/config.js의 apiBaseUrl만 "http://127.0.0.1:3000"으로 바꿉니다(timeoutMs 5000 그대로).
- backend/package.json: name "aiops-dashboard-student-api", version "1.0.0", private true, description "학생용 텀블러 생산·출고 교육 API", engines node ">=22", scripts build "tsc -p tsconfig.json", start "node dist/main.js", start:local "node --env-file=.env dist/main.js".
- 패키지는 이것만, 버전 앞에 ^·~ 없이 씁니다: dependencies @nestjs/common 11.2.7, @nestjs/core 11.2.7, @nestjs/platform-express 11.2.7, reflect-metadata 0.2.2, rxjs 7.8.2 / devDependencies @types/node 24.4.0, typescript 5.9.3.
- backend/tsconfig.json: target ES2022, module CommonJS, moduleResolution Node, lib ["ES2022", "DOM"], outDir dist, rootDir src, include ["src/**/*.ts"], strict·skipLibCheck·esModuleInterop·experimentalDecorators·emitDecoratorMetadata·forceConsistentCasingInFileNames true. backend/.gitignore는 node_modules/, dist/, var/, .env 네 줄입니다.

### 약속: 4-10에 만드는 시작 파일

- src/main.ts 첫 줄은 import "reflect-metadata";입니다. CORS는 origin "*", methods ["GET"], credentials false입니다. 포트는 PORT, 없으면 3000(1~65535 정수가 아니면 "PORT 값이 잘못되었습니다." 오류), 주소는 HOST, 없으면 127.0.0.1입니다. 전역 주소 접두어·검증 파이프·예외 필터·환경 설정 패키지는 넣지 않습니다.
- listen 뒤에 주소 줄을 따로 찍지 않습니다. 서버 창의 마지막 줄은 Nest가 찍는 `Nest application successfully started`입니다.

## 주소와 응답

쓰는 단계: 4-10, 4-17, 4-19, 4-24

주소 네 개는 한 번에 만들지 않고 프롬프트마다 하나씩 더합니다. 상태 확인은 4-10, 기록 목록은 4-17, 오늘 운영 자료는 4-19, 현장 사진은 4-24입니다. 서버 창에는 켤 때의 줄과 오류 줄만 나오고 요청마다 줄이 남지 않습니다.

### 약속

- 주소는 GET 네 개입니다: /api/v1/health(상태 확인), /api/v1/snapshot(오늘 운영 자료), /api/v1/records(기록 목록), /api/v1/images/:id(현장 사진). images 말고는 응답 헤더 Cache-Control: no-store를 붙입니다. health는 { status: "ok", releaseId: 환경 변수 RELEASE_ID, 없으면 "local" }입니다.
- 응답 모양은 API_CONTRACT.md 2·3·5절과 같습니다. 잘못된 요청은 NestJS 기본 400 모양({"message": 문장, "error": "Bad Request", "statusCode": 400})이고, 정하지 않은 주소는 NestJS 기본 404입니다. 예외 필터는 만들지 않습니다.

## 상태 파일

쓰는 단계: 4-12, 4-15

상태 파일 내용이 잘못됐으면 서버가 켜지지 않고 이유를 서버 창에 남기게 합니다. 잘못된 파일은 고치거나 지우지 않습니다.

### 약속: 4-12에 만드는 저장

- 상태 파일은 환경 변수 STATE_FILE, 없으면 서버를 켠 폴더 기준 ./var/state.json입니다. 없으면 처음 켤 때 폴더와 함께 만들고, 있으면 읽은 내용을 그대로 씁니다. 저장은 2칸 들여쓴 JSON 끝에 줄바꿈을 붙여 같은 이름 + ".next"에 쓴 뒤 이름을 바꿔 옮깁니다.
- 상태 파일 맨 위 키는 sessionId("lesson-" + 만든 시각 ISO + "-1"), records, scenarioId("normal"), revision(1), changedAt(만든 시각)입니다. 화면이 쓰지 않는 예측 상태(services.prediction)와 그 이력은 만들지 않아도 됩니다.

### 약속: 4-15에 만드는 검사

- 상태 파일이 잘못되면 파일을 고치거나 지우지 않고 오류를 내서 서버가 켜지지 않게 합니다. scenarioId가 "normal"이 아니거나 revision이 1 이상 정수가 아니거나 changedAt이 시각이 아니면 "STATE_FILE 내용이 잘못되었습니다. 기존 파일을 보존하고 확인해 주세요.", 기록이 틀리거나 id가 겹치면 "저장된 기록을 확인해 주세요."입니다.
- 상태 파일 검사는 기본 칸을 먼저, 기록을 그다음에 합니다. 기본 칸은 scenarioId, revision, changedAt이고 기록은 '기록과 시드 기록' 절의 기록 한 건 약속으로 검사합니다.
- JSON 문법이 틀린 파일은 JSON.parse의 SyntaxError를 잡지 않고 그대로 내보냅니다. 서버 창에 `SyntaxError: …in JSON at position …`이 나오고 서버가 끝납니다.
- 원인을 물어볼 때 서버 코드에 오류 처리를 더하거나 화면 코드를 고치지 않습니다. 이 서버는 상태 파일이 잘못되면 켜지지 않게 정해져 있습니다.

## 기록과 시드 기록

쓰는 단계: 4-12, 4-15

서버를 처음 켤 때 오늘 0시부터 켠 시각까지의 기록을 만들어 둡니다. 이 기록을 시드 기록이라고 부릅니다. 기록 한 건의 약속은 4-12에서 모양을 만들 때와 4-15에서 저장된 기록을 검사할 때 함께 씁니다.

### 약속

- 기록 한 건은 id(영문·숫자·_·- 1~100자), kind("production"·"shipment"), quantity(1 이상 정수), occurredAt, receivedAt, processedAt(없으면 null) 순서의 키입니다. 시각은 Z로 끝나는 ISO 글자이고 발생 ≤ 접수 ≤ 처리, 처리가 있으면 접수도 있습니다.
- 시각을 받아 한국 시간 날짜("2026-11-09" 꼴)로 바꾸는 도구도 함께 둡니다.
- 시드 기록(상태 파일을 만들 때): 오늘 한국 0시부터 지금보다 2분 이른 시각까지를 같은 간격 점으로 나눕니다(점 개수 = 올림(구간 ÷ 20분) + 1, 첫 점 0시, 마지막 점 구간 끝). 생산을 모두 만든 뒤 출고를 잇습니다.
- 시드 수량은 생산 합계 100, 출고 합계 75를 점 개수로 나눈 몫이고 나머지는 앞 기록부터 1씩 더합니다. id는 "seed-production-0"…, "seed-shipment-0"…입니다. 생산 발생은 점 그대로, 출고 발생은 점보다 1초 뒤이고, 두 종류 모두 접수는 발생 2초 뒤, 처리는 접수 3초 뒤입니다. 어느 시각도 지금보다 늦지 않습니다.

## 기준 시각과 기록 목록

쓰는 단계: 4-17

기록 화면(`#/records/factory`, `#/records/warehouse`)이 읽는 기록 목록을 만듭니다.

### 약속

- 기준 시각 at(없으면 지금)은 "2026-11-09T"처럼 날짜와 T로 시작하고 끝이 Z나 +09:00 꼴이며, 시각으로 읽히고, 지금 이전이고, 한국 날짜가 오늘이어야 합니다. 아니면 400 "오늘의 현재 이전 시각을 선택해 주세요."입니다. at=처럼 값이 빈 at은 없는 것이 아니라 이 400입니다. 통과하면 Z로 끝나는 ISO로 바꿔 씁니다.
- records는 kind가 production·shipment가 아니면 시각을 보기 전에 400 "생산 또는 출고 기록을 선택해 주세요."입니다. from(없으면 기준 날짜 한국 0시)·to(없으면 기준 시각, from=·to=처럼 값이 비어도 없는 것으로 봄)는 Z나 +09:00 꼴이고 기준 날짜와 같은 한국 날짜이며 from ≤ to ≤ 기준 시각이어야 하고, 아니면 400 "조회 시간 구간을 확인해 주세요."입니다.
- records 결과는 { sessionId, viewTime(기준 시각), records }입니다. 그 kind이고 발생 시각이 from~to(양 끝 포함)인 기록을 발생 시각 순으로 담습니다. 기준 시각보다 늦은 접수·처리 시각은 null로 바꾸고 status를 더합니다(처리가 있으면 completed, 접수만 있으면 processing-wait, 둘 다 없으면 receipt-wait). 시각은 글자가 아니라 숫자로 바꿔 비교합니다.
- 저장된 기록 자체는 바꾸지 않습니다.
- 기준 시각 검사와 기록 고르기, 기준 시각 뒤의 시각 가리기는 오늘 운영 자료에서도 다시 쓰도록 따로 둡니다.

## 오늘 운영 자료

쓰는 단계: 4-19, 4-21

오늘 운영 화면(`#/today`)이 10초마다 읽는 자료는 두 번에 나눠 만듭니다. 4-19에서 모양과 주소를 만들고 기준 시각 검사는 기록 목록과 같은 것을 씁니다. 4-21에서 두 현장의 값을 채웁니다.

### 약속: 4-19에 만드는 모양

- snapshot은 schemaVersion 1, scenarioId, revision, changedAt(상태 파일 값, 단 기준 시각보다 늦으면 기준 시각), serverTime(지금), trainingOnly true, sites, services, incidents 뒤에 viewTime(기준 시각), mode(at이 없으면 "current", 있으면 "past"), sessionId를 붙입니다.
- sites.factory는 label "텀블공장", target 120, 생산 기록이고 sites.warehouse는 label "물류창고", target 100, 출고 기록입니다.
- 4-19에서는 두 현장에 이름과 목표만 넣고 수량과 시각은 비워 둡니다(`null`). 4-21에서 채웁니다.
- services는 api { status: "normal", note: "조회 서비스가 정상입니다." }, alerts { status: "sent", lastAttemptAt: 그 snapshot의 changedAt보다 1분 이른 시각, note: "모의 전송 성공 기록입니다. 실제 알림을 보내지 않았습니다." }입니다.

### 약속: 4-21에 채우는 현장 값

이 서버는 켠 뒤로 기록이 늘지 않습니다. 마지막 시드 기록이 처음 켠 시각의 2분 전이므로, 처음 켠 지 28분이 지나면 "기록이 30분 넘게 들어오지 않았습니다." 경고가 나오는 것이 맞습니다.

- completed는 발생 시각의 한국 날짜가 기준 날짜와 같고 처리 시각이 기준 시각 이전인 기록의 수량 합이며, 합이 0이면 null입니다.
- lastEventAt·receivedAt·processedAt은 0시~기준 시각 기록 목록(records와 같은 계산)의 마지막 기록 값(없으면 null)이고, processingState는 그 마지막 기록에 처리 시각이 있으면 "completed", 아니면 "waiting"입니다.
- history는 같은 목록에서 처리 시각이 있는 기록을 발생 시각의 UTC 정시(ISO)별로 더한 { timestamp, quantity } 배열(시각 순)입니다. image는 { url: (PUBLIC_BASE_URL 끝 / 뗀 값, 없으면 "http://127.0.0.1:" + (PORT 또는 3000)) + "/api/v1/images/factory"(창고 warehouse), alt: "생산 라인 참고 사진"(창고 "물류창고 참고 사진") }입니다.
- 현장 status는 마지막 기록이 없거나, 기준 시각이 마지막 발생보다 30분 넘게 늦거나, processingState가 completed가 아니면 "warning", 아니면 "normal"입니다. note는 normal이면 "기록이 반영되고 있습니다."입니다. warning이면 마지막 기록이 없으면 label + "의 기록이 없습니다.", 마지막 기록에 처리 시각이 없으면 label + " 기록 처리를 기다리고 있습니다.", 30분 넘게 늦으면 label + " 기록이 30분 넘게 들어오지 않았습니다." 순서로 먼저 맞는 것 하나입니다.
- warning 현장마다 incidents에 { id: "FACTORY-FEED"(창고 "WAREHOUSE-FEED"), scope: "factory"(창고 "warehouse"), level: "warning", title: 그 note, owner: "공장 데이터 담당자"(창고 "창고 데이터 담당자"), action: "기록 수집과 처리 상태를 확인해 주세요." }를 넣습니다.

## 현장 사진

쓰는 단계: 4-24

사진 파일은 사용자가 4-23에서 복사해 둡니다.

### 약속

- images는 id가 factory나 warehouse면 backend/assets/(id).png를 Content-Type image/png로 보냅니다(빌드된 dist 폴더 기준 ../assets). 다른 id는 문장 없이 NestJS 기본 404입니다. 사진은 사용자가 public/assets/approved에서 backend/assets로 복사해 둡니다. 파일은 StreamableFile(createReadStream)로 보내고 res.sendFile은 쓰지 않습니다.
- 사진 파일은 열거나 바꾸지 않습니다.

## 기록을 다시 만들 때

쓰는 단계: 4-26(직접 하기)

수업을 시작할 때(날짜가 바뀌면 "…의 기록이 없습니다." 경고가 나옵니다), 처음 켠 지 28분이 지났을 때, `state.json`을 고쳤다가 되돌리기 어려울 때 씁니다.

### 약속

- 이 서버에는 기록을 더하는 기능이 없습니다. 기록을 지금 기준으로 다시 만들 때는 사용자가 서버를 끄고 backend/var/state.json을 지운 뒤 다시 켭니다.

## 사용자가 직접 하는 일

쓰는 단계: 4-3, 4-5, 4-7, 4-9, 4-11, 4-13, 4-16, 4-18, 4-20, 4-22, 4-23, 4-25, 4-26, 4-28, 4-29

아래는 사용자가 PowerShell 창이나 브라우저에서 직접 합니다. AI 도구는 서버를 켜거나 끄지 않고, `backend` 폴더의 설치와 빌드를 실행하지 않으며, 브라우저를 열어 확인하지 않습니다.

- 문법 검사 명령 `npm.cmd run check` 치기, 시험용 응답을 볼 때 `public/config.js`의 `apiBaseUrl`을 잠시 바꾸고 되돌리기
- `backend` 폴더의 `npm.cmd install`, `npm.cmd run build`, `npm.cmd start`, 서버 끄고 다시 켜기
- 현장 사진을 `public/assets/approved`에서 `backend/assets`로 복사하기
- `backend/var/state.json`을 고쳐 검사를 시험하고 되돌리기, 지우고 새로 만들기
- 화면과 응답을 브라우저에서 확인하기

[session-4 문서 끝]
