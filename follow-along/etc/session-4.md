지난 판(10-29, 한 번에 3~4줄 방식). 수업에는 쉬운판을 씁니다.

# 4회차: 1단계 정리와 내 NestJS 서버

- 시작 상태: 3회차를 끝낸 `C:\ai-class\tumble-dashboard`에서 이어 합니다(완료 브랜치 `milestone-3`과 같은 출발점). 화면이 강사 API 값으로 10초마다 갱신되고, 실패 안내·과거 시각·조회 기록이 동작합니다. 3회차를 못 끝냈으면 맨 아래 안내대로 `milestone-3` 브랜치를 받습니다.
- 끝나면 되는 것
  - 1단계 정리: `npm.cmd run check`로 문법 검사를 하고, `README.md`에 실행 방법과 단계별 설정 값이 있습니다.
  - 대시보드 폴더 안 `backend\`에 내가 만든 NestJS 서버가 `http://127.0.0.1:3000`에서 켜집니다. 처음 켤 때 오늘 기록(생산 100개, 출고 75개)을 만들어 `backend\var\state.json`에 저장합니다.
  - 화면 코드는 그대로 두고 `public\config.js`의 `apiBaseUrl`만 `http://127.0.0.1:3000`으로 바꾸면, 1단계와 같은 화면이 내 서버 값으로 "조회 정상"으로 나옵니다.
- 준비물: 3회차까지 만든 대시보드 폴더, Node.js 22 이상, 패키지를 받을 인터넷, Chrome.

| 번호 | 하는 일 |
|---|---|
| 4-1 ~ 4-8 | 1단계 정리(구성 점검, 문법 검사, 시험용 응답, README, 되돌리기) |
| 4-9 ~ 4-14 | 서버 뼈대와 health(설치·빌드·켜기는 직접) |
| 4-15 ~ 4-27 | 시드 기록, 상태 파일, 상태 파일 검사 |
| 4-28 ~ 4-32 | 기록 목록(`/api/v1/records`) |
| 4-33 ~ 4-41 | 오늘 운영 자료(`/api/v1/snapshot`) |
| 4-42 ~ 4-44 | 현장 사진(`/api/v1/images/...`) |
| 4-45 ~ 4-47 | 상태 파일 새로 만들기, 화면 연결 |
| 4-48 ~ 4-49 | 확인 실습(서버 끄기, 상태 파일 고장, 잘못된 요청) |

## 시작 전에 (프롬프트 없이 직접 합니다)

1. Antigravity로 `C:\ai-class\tumble-dashboard` 폴더를 엽니다.
2. 아래쪽 터미널(이하 "화면 창")에서 `npm.cmd start`를 치고 Chrome에서 `http://127.0.0.1:4173`을 엽니다. 헤더가 "조회 정상"인지 봅니다.
3. `public\config.js`의 두 값이 `API_CONTRACT.md` 9절 표의 1단계 값(강사 API 주소, `5000`)과 같은지 봅니다.

## 진행 방법

- 프롬프트 블록은 하나씩 그대로 복사해 붙여 넣습니다. Antigravity가 더 나은 방법이나 기능을 제안해도 받아들이지 말고 "프롬프트에 적힌 대로만 해 주세요"라고 답합니다.
- 이번 회차는 터미널을 세 개 씁니다.
  - 화면 창: 대시보드 폴더, `npm.cmd start`(4173). 켜 둔 채로 둡니다.
  - 서버 창: `backend` 폴더, `npm.cmd start`(3000). 4-14부터 씁니다.
  - 확인용 창: 설치, 검사, `curl.exe` 같은 명령을 칩니다.
- 서버 코드를 바꾼 뒤 확인할 때는 서버 창에서 Ctrl+C로 끄고("일괄 작업을 끝내시겠습니까 (Y/N)?"가 나오면 `Y`), `npm.cmd run build`, `npm.cmd start`를 차례로 칩니다. 빌드를 하지 않으면 예전 코드가 그대로 돕니다.
- 서버 창에는 켤 때의 줄과 오류 줄만 나오고, 요청마다 줄이 남지 않습니다. 요청은 Chrome의 F12, Network 탭에서 봅니다.
- 명령은 `npm.cmd`, `curl.exe`로 칩니다. PowerShell에서 `curl`만 치면 다른 명령이 실행됩니다.
- 주소창에 시각을 넣을 때는 `Z`로 끝나는 꼴만 씁니다. `+09:00`의 `+`는 주소에서 공백으로 바뀌어 400이 나옵니다.

## 4-1. 프로젝트 구성 점검

```text
이 프로젝트의 파일 목록을 보고, 더 쓰지 않는 파일과 public/app.js 안에서 어디서도 부르지 않는 함수·변수를 목록으로 알려 주세요. 아직 아무것도 고치지 마세요.
public/config.js가 window.DASHBOARD_CONFIG에 apiBaseUrl·timeoutMs 두 키만 있는 네 줄인지, index.html이 config.js를 app.js보다 먼저 부르는지도 알려 주세요.
검증표.md, API_CONTRACT.md, README.md, public/assets 안의 그림은 지울 대상에서 뺍니다.
```

- 확인: 답에 목록이 나오고 파일은 바뀌지 않았습니다. 완료 브랜치에서는 `app.js`의 `fromLocal` 하나가 쓰지 않는 함수였습니다. 사람마다 다를 수 있습니다.

## 4-2. 쓰지 않는 코드 지우기

답에 나온 "지울 것"이 화면 동작에 쓰이는 것이 아닌지 먼저 훑어봅니다.

```text
방금 알려 준 것 가운데 화면 동작에 쓰이지 않는 것만 지워 주세요. 화면 동작과 다른 파일은 바꾸지 마세요.
```

- 확인: 새로고침하면 "조회 정상"이고, 생산 기록 보기(`#/records/factory`)와 조회 기록(`#/queries/factory`) 화면이 전처럼 열립니다.

## 4-3. 문법 검사 명령

```text
package.json의 scripts에 "check": "node --check public/app.js && node --check public/config.js && node --check scripts/serve.mjs"를 더해 주세요. start와 다른 파일은 바꾸지 마세요.
```

- 확인: 확인용 창(대시보드 폴더)에서 `npm.cmd run check`를 치면 오류 없이 끝납니다.
- 확인: `public\app.js` 맨 끝에 `{`를 하나 넣고 저장한 뒤 `npm.cmd run check`를 치면 `SyntaxError`와 줄 번호가 나옵니다. 그 글자를 지우고 다시 치면 오류가 없어집니다.

## 4-4. 시험용 응답 파일 만들기

강사 API로는 볼 수 없는 두 실패(200으로 온 `{"error": ...}`, JSON이 아닌 응답)를 내 PC에서 봅니다. 5회차 GAS에서 실제로 나오는 모양입니다.

```text
실패 화면을 확인하려고 시험용 응답 파일 두 개를 만들어 주세요. 확장자는 붙이지 않습니다.
public/test/error/api/v1/snapshot 파일 내용: {"error":"시험용 오류입니다."}
public/test/not-json/api/v1/snapshot 파일 내용: JSON이 아닌 글자입니다
다른 파일은 바꾸지 마세요.
```

- 확인: 왼쪽 파일 목록에서 `public\test` 아래에 파일 두 개가 보입니다.

## 4-5. 시험용 응답으로 실패 안내 보기 (직접)

확인용 창에서 `notepad public\config.js`로 열어 `apiBaseUrl` 값만 바꾸고 저장한 뒤 Chrome을 새로고침합니다. 하나씩 확인합니다.

1. `"http://127.0.0.1:4173/test/error"`
   - 확인: 노란 안내가 "현재 자료를 가져오지 못했습니다. 서버가 요청을 처리하지 못했습니다. 서버가 알린 이유: 시험용 오류입니다. 조회할 자료가 없습니다."입니다.
2. `"http://127.0.0.1:4173/test/not-json"`
   - 확인: 노란 안내가 "현재 자료를 가져오지 못했습니다. 서버 응답이 JSON 형식이 아닙니다. 연결 주소가 API 서버 주소인지 확인해 주세요. 조회할 자료가 없습니다."입니다.
3. 원래 1단계 주소(`API_CONTRACT.md` 9절)로 되돌려 저장합니다. 4-8에서 한 번 더 확인합니다.

## 4-6. README에 실행 방법 적기

```text
README.md 끝에 "실행", "검사", "화면 주소" 세 절을 더해 주세요. 원래 있던 글과 코드 파일은 바꾸지 않습니다(README.md가 없으면 새로 만듭니다).
실행: Windows npm.cmd start, macOS npm start, 주소 http://127.0.0.1:4173, 창을 닫거나 Ctrl+C로 멈춤, 4173번 포트를 다른 프로그램이 쓰면 그 창을 먼저 닫음. 검사: npm.cmd run check(macOS: npm run check).
화면 주소는 표로 씁니다: #/today 오늘 운영, #/records/factory 오늘 생산 기록, #/records/warehouse 오늘 출고 기록, #/queries/factory 생산 데이터 조회 기록, #/queries/warehouse 출고 데이터 조회 기록.
```

- 확인: `README.md` 끝에 세 절이 생겼습니다.

## 4-7. README에 단계별 설정 값 적기

```text
README.md 끝에 "단계별 public/config.js 값" 절을 더해 주세요. 표의 열은 단계, apiBaseUrl, timeoutMs이고, 값은 API_CONTRACT.md 9절 표와 같게 1단계 강사 API, 2단계 내 서버, 3단계 내 GAS 웹 앱 세 줄입니다. 3단계 주소는 "<GAS 웹앱 주소>" 그대로 둡니다.
표 아래에 "단계를 바꿀 때는 apiBaseUrl과 timeoutMs 두 값만 바꿉니다. 3단계 GAS 웹 앱 주소를 받으면 이 표의 <GAS 웹앱 주소> 자리에 적어 둡니다."를 넣어 주세요.
```

- 확인: 표의 1단계 값이 지금 `public\config.js`와 글자까지 같습니다. 2단계는 `"http://127.0.0.1:3000"`과 `5000`, 3단계는 `15000`입니다.

## 4-8. 시험용 파일 지우고 1단계 설정 확인

```text
public/test 폴더를 지워 주세요. 그리고 public/config.js가 API_CONTRACT.md 9절의 1단계 값(apiBaseUrl 주소, timeoutMs 5000)인지 확인해서, 다르면 그 두 값만 고쳐 주세요. 다른 파일은 바꾸지 마세요.
```

- 확인: `public\test`가 없어졌습니다. `npm.cmd run check`가 오류 없이 끝나고, 새로고침한 화면이 "조회 정상"입니다. 여기까지가 1단계 정리입니다.

## 4-9. 서버 폴더와 패키지 목록

여기부터 대시보드 폴더 안 `backend\`에 내 서버를 만듭니다. 화면 쪽 파일은 4-46에서 한 줄만 바꿉니다.

```text
대시보드 폴더 안에 backend 폴더를 만들고 backend/package.json을 만들어 주세요. Nest CLI(nest new)나 npm init은 쓰지 않습니다. 설치는 제가 직접 하니 하지 마세요.
name "aiops-dashboard-student-api", version "1.0.0", private true, description "학생용 텀블러 생산·출고 교육 API", engines는 node ">=22"입니다. scripts는 build "tsc -p tsconfig.json", start "node dist/main.js", start:local "node --env-file=.env dist/main.js" 세 개입니다.
dependencies는 @nestjs/common 11.2.7, @nestjs/core 11.2.7, @nestjs/platform-express 11.2.7, reflect-metadata 0.2.2, rxjs 7.8.2, devDependencies는 @types/node 24.4.0, typescript 5.9.3입니다. 버전 앞에 ^나 ~를 붙이지 말고, 이 밖의 패키지와 스크립트는 넣지 마세요.
```

- 확인: `backend\package.json`이 생겼고, 버전 숫자 앞에 `^`가 없습니다. 아직 `node_modules` 폴더는 없습니다.

## 4-10. TypeScript 설정과 Git 제외 목록

```text
backend/tsconfig.json과 backend/.gitignore를 만들어 주세요.
tsconfig의 compilerOptions는 target "ES2022", module "CommonJS", moduleResolution "Node", lib ["ES2022", "DOM"], outDir "dist", rootDir "src"이고, strict, skipLibCheck, esModuleInterop, experimentalDecorators, emitDecoratorMetadata, forceConsistentCasingInFileNames는 true입니다. include는 ["src/**/*.ts"]입니다.
.gitignore에는 node_modules/, dist/, var/, .env 네 줄을 이 순서로 씁니다.
```

- 확인: `backend` 안에 `tsconfig.json`과 `.gitignore`가 생겼습니다.

## 4-11. 패키지 설치 (직접)

확인용 창에서 칩니다. 오류가 나면 고치지 말고 빨간 줄을 그대로 Antigravity에 붙여 넣어 원인을 묻습니다.

```text
cd backend
npm.cmd install
npm.cmd ls --depth=0
```

- 확인: `backend\node_modules`와 `backend\package-lock.json`이 생깁니다. 취약점(vulnerabilities) 안내가 나와도 그대로 둡니다(`npm audit fix`를 치지 않습니다).
- 확인: 마지막 명령에 `@nestjs/common@11.2.7`, `@nestjs/core@11.2.7`, `@nestjs/platform-express@11.2.7`, `@types/node@24.4.0`, `reflect-metadata@0.2.2`, `rxjs@7.8.2`, `typescript@5.9.3` 일곱 줄이 나옵니다. 숫자가 다르면 4-9를 다시 요청합니다.

## 4-12. 서버 시작 파일

```text
backend/src/main.ts를 만들어 주세요. 첫 줄은 import "reflect-metadata";이고, AppModule로 NestJS 앱을 만든 뒤 CORS를 origin "*", methods ["GET"], credentials false로 켭니다.
포트는 환경 변수 PORT, 없으면 3000입니다. 정수가 아니거나 1~65535 밖이면 "PORT 값이 잘못되었습니다." 오류를 냅니다. 주소는 환경 변수 HOST, 없으면 "127.0.0.1"로 이 PC 안에서만 엽니다.
시작하다 오류가 나면 오류를 화면에 찍고 종료 코드를 1로 둡니다. 전역 주소 접두어, 요청 기록, 검증 파이프, 예외 필터, 환경 설정 패키지는 넣지 않습니다.
AppModule은 다음 요청에서 만드니 이번에는 main.ts 한 파일만 만들고 빌드하지 마세요.
```

- 확인: `backend\src\main.ts`가 생겼습니다. AppModule이 아직 없어서 지금 빌드하면 오류가 나는 것이 정상입니다.

## 4-13. 모듈과 health 경로

```text
backend/src/app.module.ts와 backend/src/app.controller.ts를 만들어 주세요. 모듈에는 컨트롤러 AppController 하나를 넣습니다.
AppController에는 GET /api/v1/health 하나만 둡니다. 응답 헤더에 Cache-Control: no-store를 붙이고 { status: "ok", releaseId: 환경 변수 RELEASE_ID, 없으면 "local" }을 돌려줍니다.
```

- 확인: `backend\src` 안에 `main.ts`, `app.module.ts`, `app.controller.ts` 세 파일이 있습니다.

## 4-14. 빌드하고 처음 켜기 (직접)

Antigravity 아래쪽에 터미널을 하나 더 열어 서버 창으로 씁니다.

```text
cd backend
npm.cmd run build
npm.cmd start
```

- 확인: `[Nest]`로 시작하는 줄 가운데 `Mapped {/api/v1/health, GET} route`가 있고, 마지막 줄이 `Nest application successfully started`입니다. 창은 열린 채로 있습니다.
- 확인: Chrome에서 `http://127.0.0.1:3000/api/v1/health`를 열면 `{"status":"ok","releaseId":"local"}`이 보입니다.
- 확인: 확인용 창에서 `curl.exe -i "http://127.0.0.1:3000/api/v1/health"`를 치면 `HTTP/1.1 200 OK`, `Access-Control-Allow-Origin: *`, `Cache-Control: no-store` 줄이 보입니다.
- 확인: `http://127.0.0.1:3000/api/v1/nothing`을 열면 `{"message":"Cannot GET /api/v1/nothing","error":"Not Found","statusCode":404}`입니다. 정하지 않은 주소에는 NestJS가 이렇게 답합니다.
- Windows 방화벽 허용 창이 뜨면 4-12의 `"127.0.0.1"` 조건이 빠진 것입니다. 취소하고 그 조건을 다시 요청합니다.
- 서버 창에 `EADDRINUSE`가 나오고 서버가 끝나면 3000번 포트를 다른 프로그램이 쓰고 있습니다. 그 프로그램을 닫거나 강사에게 알립니다.

## 4-15. 기록 모양과 한국 날짜

서버를 처음 켤 때 오늘 0시부터 켠 시각까지의 기록을 만들어 둡니다. 이 기록을 시드 기록이라고 부릅니다.

```text
backend/src/records.ts를 만들어 주세요. 기록 종류는 "production"(생산)과 "shipment"(출고)이고, 기록 한 건은 id, kind, quantity, occurredAt, receivedAt, processedAt 키를 이 순서로 가집니다. receivedAt·processedAt은 없으면 null입니다.
시각 글자를 받아 한국 시간 날짜 글자("2026-11-09" 꼴)를 돌려주는 함수도 둡니다. 날짜 포맷터는 파일 위쪽에서 한 번만 만들어 두고 부를 때마다 새로 만들지 않습니다.
```

- 확인: Antigravity가 만들었다고 알려 줍니다.

## 4-16. 시드 기록의 시각

```text
records.ts에 지금 시각을 받아 시드 기록 목록을 만드는 함수를 더해 주세요. 생산 기록을 모두 만든 뒤 출고 기록을 이어 붙입니다.
구간은 오늘(한국 시간) 0시부터 지금보다 2분 이른 시각까지입니다. 점 개수는 (구간 ÷ 20분)을 올림한 수 + 1(최소 1)이고, 첫 점은 0시, 마지막 점은 구간 끝이며 그 사이를 같은 간격으로 나눕니다.
발생 시각은 생산은 점 그대로, 출고는 점보다 1초 뒤(구간이 100초보다 짧으면 구간의 100분의 1 뒤)입니다. 접수는 발생 2초 뒤, 처리는 접수 3초 뒤이고, 어느 시각도 지금보다 늦지 않게 합니다.
시각은 밀리초 숫자로 계산하고, 기록에 넣을 때만 Z로 끝나는 ISO 글자로 바꿉니다.
```

- 확인: Antigravity가 만들었다고 알려 줍니다.

## 4-17. 시드 기록의 수량과 번호

```text
시드 기록의 수량과 id를 정해 주세요. 생산은 모두 100개, 출고는 모두 75개입니다. 합계를 점 개수로 나눈 몫을 각 기록에 주고, 나머지만큼 앞 기록부터 1씩 더합니다.
id는 "seed-production-0", "seed-production-1"…, "seed-shipment-0"…처럼 "seed-" + 종류 + "-" + 점 번호(0부터)입니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-18. 상황 이름

```text
backend/src/scenarios.ts를 만들어 주세요. 상황 이름 목록은 "normal" 하나뿐입니다.
값이 글자이고 이 목록에 들어 있을 때만 맞다고 답하는 검사 함수를 함께 둡니다.
```

- 확인: Antigravity가 만들었다고 알려 줍니다.

## 4-19. 하루의 예측 상태 이력과 세션

```text
backend/src/timeline.ts를 만들어 주세요. 이력 한 항목은 at, revision, scenarioId, prediction, startedAt, finishedAt 키를 이 순서로 가지고, prediction은 "waiting", "running", "completed" 가운데 하나입니다.
지금 시각과 revision을 받아 세션을 만드는 함수를 둡니다. 이력의 첫 항목은 오늘(한국 시간) 0시, scenarioId "normal", "waiting"(startedAt·finishedAt은 null)입니다.
0시부터 지금까지가 10초보다 길면 그 구간의 40% 지점에 "running"(startedAt은 그 시각), 60% 지점에 "completed"(startedAt은 40% 시각, finishedAt은 60% 시각) 항목을 차례로 더합니다.
세션은 sessionId("lesson-" + 지금 시각 글자 + "-" + revision), records(시드 기록), transitions(이 이력) 세 키입니다.
```

- 확인: Antigravity가 만들었다고 알려 줍니다.

## 4-20. 상태 파일 저장

```text
backend/src/state.service.ts에 상태 파일을 맡는 StateService를 만들고 app.module.ts의 providers에 넣어 주세요. 파일 위치는 환경 변수 STATE_FILE, 없으면 서버를 켠 폴더 기준 ./var/state.json이고, 폴더가 없으면 만듭니다.
파일이 없으면 지금 시각으로 세션을 만들고 scenarioId "normal", revision 1, changedAt(지금 시각)을 더해 저장합니다. 맨 위 키는 sessionId, records, transitions, scenarioId, revision, changedAt 순서입니다. 파일이 있으면 읽은 내용을 그대로 다시 저장해 씁니다.
저장은 2칸 들여쓴 JSON 끝에 줄바꿈을 붙여 같은 이름 뒤에 .next를 단 파일(권한 0o600)에 먼저 쓰고, 그 파일 이름을 바꿔 옮깁니다. 읽기·쓰기·JSON 오류는 잡지 않아서 오류가 나면 서버가 켜지지 않게 합니다.
```

- 확인: Antigravity가 만들었다고 알려 줍니다.

## 4-21. 다시 켜고 상태 파일 보기 (직접)

서버 창에서 Ctrl+C로 끄고 `npm.cmd run build`, `npm.cmd start`를 칩니다.

- 확인: 켤 때의 줄은 4-14와 같고, `backend\var\state.json`이 새로 생겼습니다.
- 확인: `state.json`을 열면 맨 위 키가 `sessionId`, `records`, `transitions`, `scenarioId`(`"normal"`), `revision`(`1`), `changedAt` 순서입니다.
- 확인: 시각은 UTC 글자라 한국 시간에서 9시간을 뺀 값입니다. 첫 기록은 `"id": "seed-production-0"`이고 `occurredAt`이 전날 `T15:00:00.000Z`(오늘 한국 0시), `receivedAt`은 2초 뒤, `processedAt`은 5초 뒤입니다. 생산 기록이 모두 나온 뒤 `seed-shipment-0`부터 출고 기록이 이어집니다.
- 건수는 켠 시각에 따라 다릅니다. 한국 시간 오전 10시에 처음 켰으면 생산과 출고가 각각 31건(`-0`부터 `-30`까지)입니다.
- 서버를 끄고 다시 켠 뒤 `state.json`을 다시 열면 `sessionId`가 그대로입니다. 이미 있는 파일을 다시 쓴 것입니다.

## 4-22. 합계 세어 보기

```text
backend/var/state.json의 records에서 kind별 건수와 quantity 합계를 세어 알려 주세요. 파일은 고치지 마세요.
```

- 확인: 생산 합계 100, 출고 합계 75입니다.

## 4-23. 상태 파일 검사 1: 기본 칸

상태 파일 내용이 잘못됐으면 서버가 켜지지 않고 이유를 서버 창에 남기게 합니다. 잘못된 파일은 고치거나 지우지 않습니다.

```text
state.service.ts가 이미 있는 상태 파일을 읽을 때 기본 칸부터 검사하게 해 주세요. scenarioId가 상황 이름 검사를 통과하지 못하거나, revision이 1 이상의 정수가 아니거나, changedAt을 시각으로 읽을 수 없으면 "STATE_FILE 내용이 잘못되었습니다. 기존 파일을 보존하고 확인해 주세요." 오류를 냅니다.
검사에 걸리면 파일을 고치거나 지우거나 새로 만들지 않고, 오류를 잡지 않아서 서버가 켜지지 않게 합니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-24. 상태 파일 검사 2: 기록

```text
이어서 records 값이 있으면 검사해 주세요. 배열이 아니거나, 같은 id가 두 번 있거나, 아래에 어긋나는 기록이 하나라도 있으면 "저장된 기록을 확인해 주세요." 오류를 냅니다. 기록 한 건을 검사하는 함수는 records.ts에 둡니다.
id는 영문·숫자·_·- 1~100글자, kind는 "production"·"shipment", quantity는 1 이상의 정수, occurredAt은 시각으로 읽히는 글자입니다. receivedAt·processedAt은 키가 꼭 있어야 하고, null이거나 시각으로 읽히는 글자입니다.
발생 시각 ≤ 접수 시각 ≤ 처리 시각이어야 하고, processedAt이 있으면 receivedAt도 있어야 합니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-25. 상태 파일 검사 3: 이력

```text
이어서 transitions 키가 있으면 검사해 주세요. 배열이 아니거나 빈 배열이거나, 항목 가운데 하나라도 비어 있거나, at을 시각으로 읽을 수 없거나, scenarioId가 상황 이름 검사를 통과하지 못하거나, prediction이 "waiting"·"running"·"completed" 밖이거나, revision이 정수가 아니면 "상태 이력을 확인해 주세요." 오류를 냅니다.
검사는 기본 칸, 기록, 이력 순서로 합니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-26. 이력이 없는 예전 파일 채우기

```text
상태 파일에 transitions 키가 아예 없으면(예전 꼴 파일) 오류로 보지 말고 채워 주세요. 파일의 changedAt과 revision으로 세션을 새로 만들어 sessionId를 그것으로 바꾸고, records가 없을 때만 그 세션의 시드 기록을 넣습니다.
transitions는 항목 하나로 둡니다. at·startedAt·finishedAt은 모두 파일의 changedAt, revision·scenarioId는 파일의 값, prediction은 "completed"입니다. 세 검사를 모두 통과한 뒤에 이렇게 채우고 저장합니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-27. 상태 파일 검사 확인 (직접)

1. 서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.
   - 확인: 정상으로 켜지고, `state.json`의 `sessionId`가 그대로입니다.
2. 서버를 끕니다. `backend\var\state.json`을 열고 파일 끝 쪽 `"revision": 1,` 바로 위의 `"scenarioId": "normal",`을 `"scenarioId": "test",`로 바꿔 저장한 뒤 `npm.cmd start`를 칩니다.
   - 확인: 서버 창에 `ERROR [ExceptionHandler] Error: STATE_FILE 내용이 잘못되었습니다. 기존 파일을 보존하고 확인해 주세요.`가 나오고 서버가 끝납니다.
   - 확인: `state.json`을 다시 열면 `"test"`가 그대로 있습니다. 서버가 파일을 덮어쓰지 않았습니다.
3. `"normal"`로 되돌려 저장하고 `npm.cmd start`를 치면 다시 켜집니다.
4. (선택) 첫 기록의 `"quantity"`를 `0`으로 바꾸면 `Error: 저장된 기록을 확인해 주세요.`가 나옵니다. 확인한 뒤 원래 숫자로 되돌립니다. 원래 숫자를 잊었으면 4-45로 상태 파일을 새로 만듭니다.

## 4-28. 기준 시각 검사

기록 보기 화면(`#/records/factory`, `#/records/warehouse`)이 읽는 기록 목록을 만듭니다. 여기서 만드는 기준 시각 검사는 snapshot에서도 그대로 씁니다.

```text
state.service.ts에 기준 시각(at)을 검사하는 부분을 만들어 주세요. at이 없으면 지금 시각을 씁니다.
at이 빈 글자이거나, "2026-11-09T"처럼 날짜와 T로 시작하지 않거나, 끝이 Z나 +09:00 같은 시간대 표시가 아니거나, 시각으로 읽을 수 없거나, 지금보다 늦거나, 한국 날짜가 오늘이 아니면 400 오류 "오늘의 현재 이전 시각을 선택해 주세요."를 냅니다.
통과하면 지금 시각과, at을 Z로 끝나는 ISO 글자로 바꾼 기준 시각을 함께 돌려줍니다. 400 응답은 NestJS 기본 모양 그대로 두고 예외 필터를 만들지 않습니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-29. 기록 고르기

```text
state.service.ts에 기록 목록을 고르는 부분을 만들어 주세요. 종류, 기준 시각 검사 결과, from, to를 받습니다. from이 없으면 기준 시각 날짜의 한국 시간 0시(+09:00), to가 없으면 기준 시각입니다.
from과 to는 끝이 Z나 +09:00 꼴이고, 시각으로 읽히고, 한국 날짜가 기준 시각과 같아야 하며, from ≤ to ≤ 기준 시각이어야 합니다. 하나라도 어긋나면 400 "조회 시간 구간을 확인해 주세요."입니다.
같은 종류이면서 발생 시각이 from과 to 사이(양 끝 포함)인 기록만 골라 발생 시각 순으로 정렬합니다. 시각은 글자끼리 비교하지 말고 시각 숫자로 바꿔 비교하고, 저장된 배열 자체는 바꾸지 않습니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.
- 글자끼리 비교하면 `+09:00`과 `Z` 꼴이 섞여 한국 시간 오전 9시 전 기록이 빠집니다. 그래서 숫자로 비교합니다.

## 4-30. 기준 시각 뒤의 접수·처리 가리기

```text
고른 기록마다 receivedAt·processedAt이 기준 시각보다 늦으면 null로 바꾸고 status를 더해 주세요. processedAt이 있으면 "completed", receivedAt만 있으면 "processing-wait", 둘 다 없으면 "receipt-wait"입니다.
돌려주는 모양은 API_CONTRACT.md 3절과 같은 { sessionId, viewTime(기준 시각), records }이고, 기록의 키는 id, kind, quantity, occurredAt, receivedAt, processedAt, status 순서입니다.
이 부분은 지금 시각을 다시 읽지 않고 받은 기준 시각만 씁니다. 뒤에서 snapshot도 이 부분을 부릅니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-31. 기록 목록 경로

```text
GET /api/v1/records를 더해 주세요. app.controller.ts가 StateService를 받아 쓰고, 쿼리는 kind, from, to, at이며 응답 헤더에 Cache-Control: no-store를 붙입니다.
kind가 "production"·"shipment"가 아니면 시각을 보기 전에 먼저 400 "생산 또는 출고 기록을 선택해 주세요."를 냅니다. 그다음 at을 기준 시각 검사에 넣고, 그 결과와 from·to로 고른 기록 목록을 돌려줍니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-32. 기록 목록 확인 (직접)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.

- 확인: 켤 때의 줄에 `Mapped {/api/v1/records, GET} route`가 더해졌습니다.
- 확인: `http://127.0.0.1:3000/api/v1/records?kind=production`을 열면 `{"sessionId":"lesson-…","viewTime":"…","records":[…]}`이고, 기록이 발생 시각 순서이며 모두 `"status":"completed"`입니다. `?kind=shipment`는 출고 기록만 나옵니다.
- 확인: `?kind=abc`는 `{"message":"생산 또는 출고 기록을 선택해 주세요.","error":"Bad Request","statusCode":400}`입니다.
- 확인: `?kind=production&at=2099-01-01T00:00:00Z`는 `"오늘의 현재 이전 시각을 선택해 주세요."`, `?kind=production&from=2099-01-01T00:00:00Z`는 `"조회 시간 구간을 확인해 주세요."`가 들어간 400입니다.
- 확인: 첫 생산 기록의 `occurredAt`을 복사해 초 자리 `00.000Z`를 `03.000Z`로 바꾼 뒤 `at`에 넣어 엽니다(예: `?kind=production&at=2026-11-08T15:00:03.000Z`). 기록이 1건만 나오고 `receivedAt`은 값이 있고 `processedAt`은 `null`, `status`는 `"processing-wait"`입니다. 처리 시각(5초 뒤)이 기준 시각(3초 뒤)보다 늦어서 가려진 것입니다.

## 4-33. snapshot 기본 모양

오늘 운영 화면(`#/today`)이 10초마다 읽는 `GET /api/v1/snapshot`을 만듭니다. 모양을 먼저 만들고 두 현장 값은 4-38부터 채웁니다.

```text
backend/src/scenarios.ts에 snapshot 기본 모양을 만드는 함수와 타입을 더해 주세요. 모양은 API_CONTRACT.md 2절과 5절 예시 응답과 같고, 받는 값은 scenarioId, revision, changedAt, serverTime입니다.
맨 위 키는 schemaVersion(1), scenarioId, revision, changedAt, serverTime, trainingOnly(true), sites, services, incidents(빈 배열) 순서입니다. 타입에는 뒤에 붙일 viewTime, mode, sessionId와 현장의 processingState, history, image도 넣어 둡니다.
sites.factory는 label "텀블공장", target 120, sites.warehouse는 label "물류창고", target 100이고, 둘 다 completed·lastEventAt·receivedAt·processedAt은 null, status "normal", note ""로 시작합니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-34. snapshot의 서비스 상태 기본값

```text
같은 함수의 services를 채워 주세요. api는 status "normal", note "조회 서비스가 정상입니다."입니다.
alerts는 status "sent", lastAttemptAt은 changedAt보다 1분 이른 시각, note "모의 전송 성공 기록입니다. 실제 알림을 보내지 않았습니다."입니다.
prediction은 status "waiting", version "demo-v1", lastRunAt null, note ""입니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-35. snapshot 경로

```text
GET /api/v1/snapshot을 더해 주세요. 쿼리 at은 기록 목록과 같은 기준 시각 검사를 거치고, 응답 헤더에 Cache-Control: no-store를 붙입니다. 현장 값은 아직 채우지 않습니다.
예측 이력에서 기준 시각과 같거나 이전인 마지막 항목을 찾아 기본 모양을 만듭니다. scenarioId·revision·changedAt은 그 항목의 값(항목이 없으면 "normal", 저장된 revision, 기준 시각)이고 serverTime은 지금 시각입니다.
그 뒤에 viewTime(기준 시각), mode(at이 없으면 "current", 있으면 "past"), sessionId를 이 순서로 더합니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-36. snapshot의 예측 상태

```text
snapshot의 services.prediction을 찾은 이력 항목으로 통째로 바꿔 주세요. 키는 status, version("demo-v1"), startedAt, finishedAt, lastRunAt(startedAt과 같은 값), note 순서이고, 항목이 없으면 status는 "waiting", 시각은 모두 null입니다.
note는 status가 "running"이면 "출고 예측을 처리하고 있습니다.", "waiting"이면 "예측 실행을 기다리고 있습니다.", 그 밖에는 "출고 예측 처리가 끝났습니다."입니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-37. snapshot 모양 확인 (직접)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.

- 확인: 켤 때의 줄에 `Mapped {/api/v1/snapshot, GET} route`가 더해졌습니다.
- 확인: `http://127.0.0.1:3000/api/v1/snapshot`을 열면 `schemaVersion`(1), `scenarioId`("normal"), `trainingOnly`(true), `sites`, `services`, `incidents`, `viewTime`, `mode`("current"), `sessionId`가 보입니다. `viewTime`과 `serverTime`이 같고, `sessionId`는 4-32의 기록 목록과 같습니다.
- 확인: 지금은 두 현장의 `completed`가 `null`, `note`가 빈 글자입니다. 4-38부터 채웁니다.
- 확인: `services.alerts.lastAttemptAt`이 `changedAt`보다 정확히 1분 이릅니다. `services.prediction`은 `"completed"`, `"출고 예측 처리가 끝났습니다."`입니다(0시 10초 안에 처음 켠 경우만 `"waiting"`).
- 확인: 첫 생산 기록의 `occurredAt`(전날 `T15:00:00.000Z`)을 `?at=`에 넣어 열면 `mode`가 `"past"`, `viewTime`과 `changedAt`이 그 시각, `services.prediction`이 `"waiting"`, `"예측 실행을 기다리고 있습니다."`입니다.
- 확인: `?at=2099-01-01T00:00:00Z`는 400 `"오늘의 현재 이전 시각을 선택해 주세요."`입니다.

## 4-38. 현장 수량과 마지막 기록

```text
snapshot의 두 현장을 채워 주세요. factory는 생산 기록, warehouse는 출고 기록을 쓰고, 먼저 수량과 마지막 기록입니다.
completed는 한국 날짜가 기준 시각과 같고 processedAt이 있으며 그 시각이 기준 시각 이전인 기록의 quantity 합입니다. 합이 0이면 null입니다. 이 합계 함수는 records.ts에 둡니다.
오늘 0시부터 기준 시각까지의 기록 목록(기록 목록 경로와 같은 계산)에서 마지막 기록의 occurredAt·receivedAt·processedAt을 lastEventAt·receivedAt·processedAt에 넣습니다(없으면 null).
processingState는 그 마지막 기록에 processedAt이 있으면 "completed", 아니면 "waiting"이고, note는 "기록이 반영되고 있습니다."로 둡니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-39. 시간별 그래프와 사진 주소

```text
각 현장에 history와 image를 더해 주세요. history는 같은 기록 목록 가운데 processedAt이 있는 것만, 발생 시각의 정시(UTC 정시의 ISO 글자)별로 quantity를 더해 { timestamp, quantity } 배열로 만들고 시각 순으로 정렬합니다.
image는 { url, alt }입니다. url은 환경 변수 PUBLIC_BASE_URL(끝의 / 제거), 없으면 "http://127.0.0.1:" + PORT(없으면 3000) 뒤에 "/api/v1/images/factory" 또는 "/api/v1/images/warehouse"를 붙입니다.
alt는 factory가 "생산 라인 참고 사진", warehouse가 "물류창고 참고 사진"입니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-40. 현장 상태와 확인할 일

```text
각 현장의 status를 정해 주세요. 마지막 기록이 없거나, 기준 시각이 마지막 발생 시각보다 30분 넘게 늦거나, processingState가 "completed"가 아니면 "warning", 아니면 "normal"입니다.
"warning"이면 제목을 note에 넣습니다. 기록이 없으면 label + "의 기록이 없습니다.", 처리 대기면 label + " 기록 처리를 기다리고 있습니다.", 그 밖에는 label + " 기록이 30분 넘게 들어오지 않았습니다."입니다.
그리고 incidents에 API_CONTRACT.md 7절 첫 예시와 같은 모양으로 하나 넣습니다. id "FACTORY-FEED"·"WAREHOUSE-FEED", scope "factory"·"warehouse", level "warning", title은 그 제목, owner "공장 데이터 담당자"·"창고 데이터 담당자", action "기록 수집과 처리 상태를 확인해 주세요."입니다.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-41. 현장 값 확인 (직접)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켠 뒤 `http://127.0.0.1:3000/api/v1/snapshot`을 엽니다.

- 확인: `sites.factory.completed`가 `100`, `sites.warehouse.completed`가 `75`, `target`은 `120`과 `100`입니다. `image.url`은 `http://127.0.0.1:3000/api/v1/images/factory`, `…/warehouse`입니다(사진은 4-43에서 보이게 합니다).
- 확인: 한 현장의 `history`에 있는 `quantity`를 모두 더하면 그 현장의 `completed`와 같습니다.
- 확인: 4-21에서 처음 켠 지 28분이 안 됐으면 두 현장 모두 `"status":"normal"`, note `"기록이 반영되고 있습니다."`, `incidents`는 `[]`입니다. 28분이 넘었으면 두 현장 모두 `"warning"`, note가 `"텀블공장 기록이 30분 넘게 들어오지 않았습니다."`·`"물류창고 기록이 30분 넘게 들어오지 않았습니다."`이고 `incidents`가 2건입니다. 마지막 시드 기록이 처음 켠 시각의 2분 전이고 그 뒤로 기록이 늘지 않아서 이렇게 되는 것이 맞습니다.
- 확인: 첫 생산 기록의 `occurredAt`(전날 `T15:00:00.000Z`)을 `?at=`에 넣으면 공장은 `completed`가 `null`, note가 `"텀블공장 기록 처리를 기다리고 있습니다."`, 창고는 note가 `"물류창고의 기록이 없습니다."`이고 `incidents`에 `FACTORY-FEED`와 `WAREHOUSE-FEED`가 있습니다.
- 확인: 같은 시각의 초 자리를 `30.000Z`로 바꾸면 두 현장 모두 `"normal"`이고, `completed`가 각 현장 첫 기록(`seed-production-0`, `seed-shipment-0`)의 `quantity`와 같습니다.

## 4-42. 현장 사진 복사 (직접)

확인용 창을 대시보드 폴더(`backend`의 한 단계 위, 4-11에서 `cd backend`를 했으면 `cd ..`)로 옮기고 칩니다. 탐색기에서 복사해 붙여 넣어도 됩니다.

```text
mkdir backend\assets
copy public\assets\approved\factory.png backend\assets\
copy public\assets\approved\warehouse.png backend\assets\
```

- 확인: `backend\assets` 안에 `factory.png`, `warehouse.png`가 있습니다.

## 4-43. 현장 사진 경로

```text
GET /api/v1/images/:id를 더해 주세요. id가 "factory"나 "warehouse"면 backend/assets/(id).png 파일을 응답 헤더 Content-Type: image/png로 보냅니다. 빌드된 dist 폴더 기준으로 ../assets 폴더를 찾습니다.
다른 id면 문구 없이 NestJS 기본 404를 냅니다. 이 경로에는 Cache-Control을 붙이지 않고, 사진 파일은 열거나 바꾸지 마세요.
```

- 확인: Antigravity가 고쳤다고 알려 줍니다.

## 4-44. 현장 사진 확인 (직접)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.

- 확인: 켤 때의 줄에 `Mapped {/api/v1/images/:id, GET} route`가 더해졌습니다.
- 확인: `http://127.0.0.1:3000/api/v1/images/factory`를 열면 컨베이어 위 상자 그림이, `…/images/warehouse`를 열면 물류창고 그림이 보입니다.
- 확인: 확인용 창에서 `curl.exe -I "http://127.0.0.1:3000/api/v1/images/factory"`를 치면 `HTTP/1.1 200 OK`, `Access-Control-Allow-Origin: *`, `Content-Type: image/png` 줄이 보입니다.
- 확인: `…/images/abc`를 열면 `{"message":"Not Found","statusCode":404}`입니다. 이때 서버 창에 `WARN [ExpressAdapter] Content-Type doesn't match Reply body…` 줄이 찍히는 것은 정해진 동작입니다.
- 그림 대신 400이 나오고 본문에 `ENOENT: no such file or directory`가 있으면 `backend\assets`에 사진이 없는 것입니다. 4-42를 다시 합니다.

## 4-45. 상태 파일 새로 만들기 (직접)

이 서버에는 기록을 더하는 기능이 없어서, 켠 뒤로는 기록이 늘지 않습니다. 시드 기록을 지금 시각 기준으로 다시 만들 때 이 순서를 씁니다. 화면을 처음 연결하기 전에 한 번 합니다.

- 쓰는 때: 수업을 시작할 때(날짜가 바뀌면 "…의 기록이 없습니다." 경고가 나옵니다), 처음 켠 지 28분이 지나 "기록이 30분 넘게 들어오지 않았습니다." 경고가 나올 때, `state.json`을 고쳤다가 되돌리기 어려울 때.

서버 창(`backend` 폴더)에서 Ctrl+C로 끄고 칩니다. Antigravity 파일 목록에서 `backend\var\state.json`을 지워도 됩니다.

```text
del var\state.json
npm.cmd start
```

- 확인: `backend\var\state.json`이 다시 생기고 `sessionId`가 방금 켠 시각을 담은 새 글자로 바뀝니다.
- 확인: `http://127.0.0.1:3000/api/v1/snapshot`의 두 현장이 `"normal"`, `incidents`가 `[]`이고, 생산 `completed`는 100, 출고는 75입니다.

## 4-46. 화면을 내 서버에 연결

```text
public/config.js에서 apiBaseUrl 값만 "http://127.0.0.1:3000"으로 바꿔 주세요. timeoutMs는 5000 그대로 두고, 다른 줄과 다른 파일은 고치지 마세요. 주소 끝에 /를 붙이지 않습니다.
```

- 확인: `public\config.js`가 여전히 네 줄이고 `apiBaseUrl`만 바뀌었습니다. 1단계로 되돌릴 때는 4-7에서 README에 적은 값을 씁니다.

## 4-47. 내 서버 값으로 화면 보기 (직접)

서버 창(`backend`, 3000)과 화면 창(대시보드 폴더, 4173)이 둘 다 켜져 있는지 보고, Chrome에서 `http://127.0.0.1:4173`을 새로고침합니다.

- 확인: 1단계와 같은 배치로 "생산 100개 · 목표 120개", "출고 75개 · 목표 100개", 현장 사진 두 장, 시간별 그래프가 보이고 헤더는 "조회 정상"입니다.
- 확인: 알림 전송 기록 카드는 "전송 성공", "알림 전송이 완료됐습니다."와 마지막 전송 시도 시각을 보여 줍니다.
- 확인: F12, Network 탭에서 `snapshot` 요청이 10초마다 `http://127.0.0.1:3000/api/v1/snapshot`으로 나가고 상태가 200입니다. 사진 요청은 `http://127.0.0.1:3000/api/v1/images/factory`, `…/warehouse`입니다. Console 탭에 CORS 오류가 없습니다.
- 확인: 생산 기록 보기와 출고 기록 보기의 줄 수가 `state.json`의 생산·출고 건수와 같습니다.
- 확인: 헤더의 기준 시각에서 오늘의 지난 정시를 고르면 Network 탭에 `?at=`이 붙은 요청이 보이고 그때까지의 수량으로 바뀝니다. "현재로 돌아가기"를 누르면 10초 조회가 다시 시작합니다.
- 처음 켠 지 28분이 넘으면 두 현장이 "확인 필요"이고 "기록이 30분 넘게 들어오지 않았습니다." 안내가 보입니다. 4-45로 새로 만들면 정상 표시로 돌아옵니다.

## 4-48. 확인 실습: 서버가 멈추거나 요청이 잘못됐을 때 (직접)

화면의 안내와 서버 쪽에서 보이는 것을 맞춰 봅니다. 서버 코드는 고치지 않습니다.

1. **서버를 끈 경우**: 화면을 연 채 서버 창에서 Ctrl+C로 서버를 끕니다.
   - 확인: 10초 안에 헤더가 "조회 실패"로 바뀌고 "API 서버에 연결하지 못했습니다. 연결 주소가 맞는지, 직접 띄운 서버라면 켜져 있는지 확인해 주세요. …"와 "아래 내용은 이전 조회 자료입니다."가 나옵니다. 숫자와 그래프는 마지막 정상 자료 그대로입니다.
   - 확인: `npm.cmd start`로 다시 켜면 다음 조회에서 "조회 정상"으로 돌아오고 숫자도 같습니다. 같은 `state.json`을 다시 읽었기 때문입니다.
2. **상태 파일이 깨진 경우**: 서버를 끄고 `backend\var\state.json`에서 첫 기록의 `"id": "seed-production-0",` 줄 끝 쉼표 하나를 지우고 저장한 뒤 `npm.cmd start`를 칩니다.
   - 확인: 서버가 켜지지 않고 서버 창에 `ERROR [ExceptionHandler] SyntaxError: …in JSON at position …` 줄이 나온 뒤 끝납니다. 화면은 1번과 같은 연결 실패 안내입니다.
   - 쉼표를 되돌리고 `npm.cmd start`를 치면 다시 켜집니다. 되돌리기 어려우면 4-45로 새로 만듭니다.
3. **요청이 잘못된 경우**: 서버를 켠 채 Chrome 새 탭에서 `http://127.0.0.1:3000/api/v1/records?kind=production&from=2099-01-01T00:00:00Z`를 엽니다.
   - 확인: `{"message":"조회 시간 구간을 확인해 주세요.","error":"Bad Request","statusCode":400}`이 보이고 서버 창에는 줄이 생기지 않습니다.
   - 확인: `http://127.0.0.1:3000/api/v1/snapshot?at=2099-01-01T00:00:00Z`는 `"오늘의 현재 이전 시각을 선택해 주세요."`입니다.
   - 화면은 HTTP 오류가 오면 "서버가 요청 조건을 받아들이지 않았습니다(HTTP 400)."까지만 보여 줍니다. 이유는 F12, Network 탭에서 그 요청을 눌러 Response(응답)에서 봅니다.

## 4-49. 원인 물어보기

4-48의 2번이나 3번을 하면서 아래 프롬프트의 괄호 부분을 채워 붙여 넣습니다.

```text
대시보드 화면에 "(화면에 나온 안내 문구)"가 나옵니다. 아래는 backend 서버 창에 나온 줄(또는 브라우저에 나온 응답 본문)입니다.
원인과 되돌리는 방법을 설명해 주세요. backend/src와 public 폴더의 코드는 고치지 마세요.
(서버 창의 줄이나 응답 본문을 여기에 붙여 넣습니다)
```

- 확인: Antigravity가 안내 문구와 서버 창의 줄(또는 400 본문의 `message`)을 이어서 설명합니다. 2번이면 `state.json`의 쉼표 위치를, 3번이면 `from`이나 `at` 값을 가리키면 맞습니다.
- 서버 코드에 오류 처리를 더하거나 화면 코드(`public\`)를 고치자고 하면 받아들이지 않습니다. 이 서버는 상태 파일이 잘못되면 켜지지 않는 것이 정해진 동작입니다.

## 4회차 끝 확인

| 확인할 것 | 기대 결과 |
|---|---|
| 프로젝트 구성 | `public\test`가 없고, 쓰지 않는 코드가 정리됐습니다 |
| `npm.cmd run check`(대시보드 폴더) | 오류 없이 끝납니다 |
| `README.md` | 실행, 검사, 화면 주소 다섯 개, 단계별 `public/config.js` 값 표가 있습니다 |
| `backend` 폴더에서 `npm.cmd ls --depth=0` | 4-11의 일곱 패키지가 고정 버전 그대로입니다 |
| 서버 창의 `npm.cmd start` | `Mapped` 줄이 health, images, snapshot, records 네 개이고 `Nest application successfully started`로 끝납니다 |
| `http://127.0.0.1:3000/api/v1/health` | `{"status":"ok","releaseId":"local"}` |
| `http://127.0.0.1:3000/api/v1/snapshot` | 생산 `completed` 100, 출고 75, `image.url`이 `http://127.0.0.1:3000/api/v1/images/…` |
| `backend\var\state.json` | 서버를 처음 켤 때 생기고, 다시 켜도 `sessionId`가 그대로입니다. 내용이 잘못되면 서버가 켜지지 않고 파일은 그대로 남습니다 |
| `public\config.js` | `apiBaseUrl`만 `"http://127.0.0.1:3000"`, `timeoutMs`는 `5000`, 네 줄 |
| `http://127.0.0.1:4173` | 1단계와 같은 화면이 내 서버 값으로 "조회 정상", 사진 두 장, 시간별 그래프, 기록 보기 표 |
| 확인 실습 | 서버를 끄면 "조회 실패"와 이전 자료, 다시 켜면 "조회 정상". 잘못된 요청은 400 본문에 이유가 있습니다 |

못 끝냈으면 회차 공통 안내대로 `milestone-4` 브랜치를 받습니다. 그 브랜치는 서버 패키지가 설치되어 있지 않으므로, 받은 뒤 서버 창에서 `cd backend`, `npm.cmd ci`, `npm.cmd run build`, `npm.cmd start`를 차례로 칩니다. `backend\var\`는 브랜치에 들어 있지 않아서 처음 켤 때 `state.json`이 새로 만들어집니다.
