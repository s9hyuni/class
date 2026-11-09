# 4회차 목표: 내 NestJS 서버

내가 만든 NestJS 서버가 켜지고, 화면이 그 서버의 값으로 나옵니다.
서버는 대시보드 폴더 안 `backend` 폴더에 있고 `http://127.0.0.1:3000`에서 켜지며, 처음 켤 때 오늘 기록(생산 100개, 출고 75개)을 만들어 `backend\var\state.json`에 저장합니다.
화면 코드는 그대로 두고 연결 주소만 `http://127.0.0.1:3000`으로 바꾸면, 강사 API를 쓰던 1단계와 같은 화면이 내 서버 값으로 "조회 정상"으로 나옵니다.

## 시작 전에

3회차를 끝낸 `C:\ai-class\tumble-dashboard` 폴더에서 이어 합니다. 화면이 강사 API 값으로 10초마다 바뀌고, 실패 안내·과거 시각·조회 기록이 동작하는 상태입니다.

준비물: 3회차까지 만든 대시보드 폴더, Node.js 22 이상, 패키지를 받을 인터넷, Chrome.

1. 화면 창(화면 서버를 켜 둘 창)에서 아래를 치고 Chrome에서 `http://127.0.0.1:4173`을 엽니다. 화면 맨 위에 "조회 정상"이 보이는지 봅니다. 내 서버(`backend`)는 4-5에서 처음 켭니다.

```powershell
cd C:\ai-class\tumble-dashboard
npm.cmd start
```

   서버를 켜 둔 창이 이미 있으면 이 명령을 치지 않고 주소만 엽니다.

2. AI 도구로 `C:\ai-class\tumble-dashboard` 폴더를 열고 새 대화를 시작합니다.

이번 회차에 알아 둘 것은 아래와 같습니다.

- 이번 회차에 처음 나오는 말입니다.
  - **NestJS**: TypeScript로 서버를 만드는 도구입니다. 내 서버(`backend`)를 이것으로 만듭니다.
  - **빌드**: TypeScript로 쓴 서버 코드를 Node.js가 실행할 수 있는 파일(`backend\dist`)로 바꾸는 일입니다. 서버 창에서 `npm.cmd run build`로 합니다.
  - **1단계·2단계·3단계**: 화면이 자료를 받는 곳입니다. 3회차까지 쓴 강사 API가 1단계, 이번 회차의 내 서버가 2단계, 5회차의 GAS 웹 앱이 3단계입니다. `API_CONTRACT.md` 9절 표의 단계와 같고, `[4-1]` 같은 단계 번호와는 다른 말입니다.
- 새 대화를 열 때마다 4-1의 프롬프트를 먼저 보낸 뒤, 하던 번호부터 이어 갑니다.
- 명령 상자(PowerShell 명령이 든 상자)는 AI 도구에 보내지 않고, 그 번호가 말한 창에 직접 칩니다.
- "완료 기준"과 다르게 나오면 화면의 글이나 서버 창의 빨간 줄을 그대로 복사해 "이렇게 나와요. 고쳐 주세요."와 함께 AI 도구에 붙여 넣습니다.
- 이번 회차는 창을 세 개 씁니다.
  - 화면 창: `cd C:\ai-class\tumble-dashboard` 뒤 `npm.cmd start`(4173). 켜 둔 채로 둡니다.
  - 서버 창: `cd C:\ai-class\tumble-dashboard\backend` 뒤 `npm.cmd start`(3000). 4-5부터 씁니다.
  - 명령 창: `cd C:\ai-class\tumble-dashboard` 뒤 설치, `curl.exe`, `git` 같은 명령을 칩니다.
- **서버 코드를 바꾼 번호(4-6 ~ 4-10)의 완료 기준은 늘 서버를 다시 빌드해 켠 뒤에 봅니다.** 서버 창에서 Ctrl+C로 끄고(Y/N을 물으면 `Y`), `npm.cmd run build`, `npm.cmd start`를 차례로 칩니다. 빌드를 하지 않으면 예전 코드로 실행됩니다.
- 파일을 열어 볼 때는 메모장을 씁니다. 창이 어느 폴더에 있든 되도록 전체 경로로 칩니다. 예: `notepad C:\ai-class\tumble-dashboard\backend\var\state.json`
- 서버 창에는 켤 때의 줄과 오류 줄만 나오고, 요청마다 줄이 남지 않습니다. 요청은 Chrome의 F12, Network 탭에서 봅니다.
- 명령은 `npm.cmd`, `curl.exe`로 칩니다. PowerShell에서 `curl`만 치면 다른 명령이 실행됩니다.
- 주소창에 시각을 넣을 때는 `Z`로 끝나는 꼴만 씁니다. `+09:00`의 `+`는 주소에서 공백으로 바뀌어 400 오류가 나옵니다.

## 4-1. 지침 세팅

```text
[4-1] 이번 회차 문서를 이 프로젝트로 가져오기 위해, 수업 저장소(class)를 다시 받아 class/milestone-3의 AGENTS.md와 docs/guide를 git checkout class/milestone-3 -- AGENTS.md docs/guide 꼴로 이 프로젝트로 가져와 주세요(브랜치는 옮기지 않습니다).
그다음 AGENTS.md를 작업 지침으로 삼아 주세요. 프롬프트에 없는 상세 구현은 docs/guide의 회차 문서와 그 회차 완료 브랜치 코드(class/milestone-4)에서 확인합니다.
지금은 AGENTS.md와 docs/guide의 회차 문서를 끝까지 읽기만 하고, 답 맨 앞에 "읽은 문서: session-1 ~ session-4" 꼴로 읽은 문서를 한 줄로 알려 주세요.
```

- 하는 일: 수업 저장소 `milestone-3`에서 규칙 파일과 보충 문서를 앱 폴더로 가져오고, AI 도구가 1~4회차 문서를 읽어 둡니다. `docs\guide`에 4회차 보충 문서가 새로 생깁니다.
- 목표: 4회차의 자세한 약속(주소, 응답 모양, 오류 문장)은 4회차 보충 문서와 완료 브랜치 `milestone-4` 코드에 있어, 다른 번호보다 먼저 보냅니다.
- 완료 기준: 파일 탐색기나 AI 도구의 파일 목록에서 `docs\guide`에 `session-4.md`가 생기고, 답 맨 앞이 "읽은 문서: session-1 ~ session-4"입니다.

## 4-2. 내 서버 폴더와 설정 파일

```text
[4-2] 화면에 값을 줄 내 서버를 만들기 위해, 대시보드 폴더 안에 내 서버(NestJS) 폴더와 패키지 목록, 설정 파일을 추가해 주세요.
패키지 설치는 제가 직접 하니 하지 마세요.
자세한 내용은 docs/guide/session-4.md의 "내 서버의 구성"을 참고해 주세요.
```

- 하는 일: 여기부터 대시보드 폴더 안 `backend` 폴더에 내 서버를 만듭니다. 이 번호에서는 `backend` 폴더와 그 안의 패키지 목록(`package.json`), TypeScript 설정(`tsconfig.json`), Git 제외 목록(`.gitignore`)이 생깁니다.
- 목표: 내 서버에 쓸 패키지와 버전, 빌드 방법을 먼저 정해 둡니다. 패키지는 AI 도구가 아니라 4-3에서 내가 직접 설치합니다.
- 완료 기준: `backend` 안에 `package.json`, `tsconfig.json`, `.gitignore`가 생겼고, `package.json`의 버전 숫자 앞에 `^`나 `~`가 없습니다. 아직 `node_modules` 폴더는 없습니다.

## 4-3. 패키지 설치 (직접 하기)

1. 명령 창(없으면 하나 더 엽니다)에서 칩니다.

```powershell
cd C:\ai-class\tumble-dashboard\backend
npm.cmd install
npm.cmd ls --depth=0
cd C:\ai-class\tumble-dashboard
```

   마지막 줄은 명령 창을 대시보드 폴더로 되돌립니다.

- 하는 일: `backend` 폴더에 패키지 목록대로 NestJS 패키지를 설치합니다.
- 목표: 4-5에서 서버를 빌드하고 켜려면 이 패키지들이 있어야 합니다. 버전을 고정해 두어 모두 같은 버전으로 설치됩니다.
- 완료 기준:
  - `backend\node_modules`와 `backend\package-lock.json`이 생깁니다. 취약점(vulnerabilities) 안내가 나와도 그대로 둡니다(`npm audit fix`를 치지 않습니다).
  - `npm.cmd ls --depth=0`의 결과에 `@nestjs/common@11.2.7`, `@nestjs/core@11.2.7`, `@nestjs/platform-express@11.2.7`, `@types/node@24.4.0`, `reflect-metadata@0.2.2`, `rxjs@7.8.2`, `typescript@5.9.3` 일곱 줄이 나옵니다.

## 4-4. 서버 시작 파일과 상태 확인 주소

```text
[4-4] 내 서버가 켜져 있는지 알 수 있도록, 내 서버에 시작 파일과 서버 상태를 답하는 상태 확인 주소를 추가해 주세요.
다른 주소는 뒤 번호에서 만듭니다.
자세한 내용은 docs/guide/session-4.md의 "내 서버의 구성"과 "주소와 응답"을 참고해 주세요.
```

- 하는 일: `backend\src`에 파일 세 개가 생깁니다. 서버를 켜는 시작 파일(`main.ts`), 서버의 부품을 묶는 앱 모듈, 상태 확인 주소(`/api/v1/health`)에 답하는 파일입니다.
- 목표: 4-5에서 서버가 켜져 응답하는지 먼저 보려고 주소는 상태 확인 하나만 만듭니다. 나머지 주소 셋(기록 목록, 오늘 운영 자료, 현장 사진)은 4-7부터 하나씩 더합니다.
- 완료 기준: `backend\src` 안에 파일이 세 개 있습니다.

## 4-5. 빌드하고 처음 켜기 (직접 하기)

1. PowerShell을 하나 더 열어 서버 창으로 씁니다.

```powershell
cd C:\ai-class\tumble-dashboard\backend
npm.cmd run build
npm.cmd start
```

- 하는 일: 서버 창에서 내 서버를 빌드해 처음 켜고, 상태 확인 주소를 브라우저와 `curl.exe`로 열어 봅니다.
- 목표: 서버를 빌드하고 켜는 순서를 처음 해 봅니다. 4-6부터 서버 코드를 바꿀 때마다 같은 순서(끄기, 빌드, 켜기)로 다시 켭니다.
- 완료 기준:
  - `[Nest]`로 시작하는 줄 가운데 `Mapped {/api/v1/health, GET} route`가 있고, 마지막 줄이 `Nest application successfully started`입니다. Chrome에서 `http://127.0.0.1:3000/api/v1/health`를 열면 `{"status":"ok","releaseId":"local"}`이 보입니다.
  - 명령 창에서 `curl.exe -i "http://127.0.0.1:3000/api/v1/health"`를 치면 `HTTP/1.1 200 OK`, `Access-Control-Allow-Origin: *`, `Cache-Control: no-store` 줄이 보입니다.
- 막히면: Windows 방화벽 허용 창이 뜨면 취소하고 강사에게 알립니다. 이 서버는 이 PC 안에서만 열려야 합니다.
- 막히면: 서버 창에 `EADDRINUSE`가 나오고 서버가 끝나면 3000번 포트를 다른 프로그램이 쓰고 있습니다. 그 프로그램을 닫거나 강사에게 알립니다.
- 알아 두기: `Access-Control-Allow-Origin: *`는 4173에서 열린 화면이 3000의 내 서버 자료를 읽어도 된다는 허용 표시입니다. 이 줄이 없으면 4-12에서 Console 탭에 CORS 오류가 나옵니다. `Cache-Control: no-store`는 브라우저가 응답을 저장해 두지 않고 늘 새로 받게 하는 표시입니다.

## 4-6. 시드 기록과 상태 파일

```text
[4-6] 화면에 보일 오늘 기록을 마련하기 위해, 내 서버에 켤 때 시드 기록(생산 100개, 출고 75개)을 만들어 상태 파일에 저장하는 기능을 추가해 주세요.
자세한 내용은 docs/guide/session-4.md의 "기록과 시드 기록"과 "상태 파일"을 참고해 주세요.
```

- 하는 일: 서버를 처음 켤 때 오늘 0시부터 켠 시각 2분 전까지의 기록을 만들어 `backend\var\state.json`(상태 파일)에 저장하는 기능이 생깁니다. 이 기록을 시드 기록이라고 부릅니다.
- 목표: 화면에 보일 오늘 기록의 원본입니다. 이미 있는 상태 파일은 그대로 쓰므로 서버를 다시 켜도 기록이 바뀌지 않습니다.
- 직접 하기: 서버를 다시 빌드해 켠 뒤 명령 창에서 `notepad C:\ai-class\tumble-dashboard\backend\var\state.json`로 엽니다.
- 완료 기준:
  - 맨 위 키가 `sessionId`(`"lesson-"`으로 시작), `records`, `scenarioId`(`"normal"`), `revision`(`1`), `changedAt`이고, 첫 기록이 `"id": "seed-production-0"`입니다. 생산 기록이 모두 나온 뒤 `seed-shipment-0`부터 출고 기록이 이어집니다. 합계 100개·75개는 4-9에서 봅니다.
  - 서버를 끄고 다시 켠 뒤 `state.json`을 다시 열면 `sessionId`가 그대로입니다. 이미 있는 파일을 다시 쓴 것입니다.
  - 시각은 UTC 글자라 한국 시간에서 9시간을 뺀 값입니다. 건수는 켠 시각에 따라 다릅니다.

## 4-7. 기록 목록 주소

```text
[4-7] 기록 화면이 내 서버에서 기록을 받도록, 내 서버에 생산·출고 기록을 시간 구간으로 골라 돌려주는 기록 목록 주소를 추가해 주세요.
오늘 운영 자료 주소는 다음 번호에서 만듭니다.
자세한 내용은 docs/guide/session-4.md의 "기준 시각과 기록 목록"과 "주소와 응답"을 참고해 주세요.
```

- 하는 일: 다시 켜면 `/api/v1/records` 주소가 더해지고, 생산·출고 기록을 시간 구간으로 골라 발생 시각 순서로 돌려줍니다.
- 목표: 기록 화면(`#/records/factory`, `#/records/warehouse`)이 읽는 자료입니다. 여기서 만든 기준 시각 검사를 4-8의 오늘 운영 자료도 씁니다.
- 완료 기준:
  - 다시 켤 때의 줄에 `Mapped {/api/v1/records, GET} route`가 더해졌고, `http://127.0.0.1:3000/api/v1/records?kind=production`을 열면 `{"sessionId":"lesson-…","viewTime":"…","records":[…]}`이고 기록이 발생 시각 순서이며 모두 `"status":"completed"`입니다.
  - `?kind=abc`는 `{"message":"생산 또는 출고 기록을 선택해 주세요.","error":"Bad Request","statusCode":400}`이고, `?kind=production&at=2099-01-01T00:00:00Z`는 `"오늘의 현재 이전 시각을 선택해 주세요."`가 들어간 400입니다.

## 4-8. 오늘 운영 자료 주소

```text
[4-8] 오늘 운영 화면이 내 서버 값을 읽도록, 내 서버에 오늘 운영 자료 주소를 추가해 주세요.
두 현장은 이름과 목표만 넣고, 나머지 값은 다음 번호에서 채웁니다.
자세한 내용은 docs/guide/session-4.md의 "오늘 운영 자료"와 "주소와 응답"을 참고해 주세요.
```

- 하는 일: 다시 켜면 `/api/v1/snapshot` 주소가 더해지고, 오늘 운영 자료의 틀과 두 현장의 이름·목표가 나옵니다.
- 목표: 오늘 운영 화면(`#/today`)이 10초마다 읽는 자료입니다. 모양과 주소를 먼저 만들고 4-9에서 현장 값을 채웁니다.
- 완료 기준:
  - 다시 켤 때의 줄에 `Mapped {/api/v1/snapshot, GET} route`가 더해졌고, `http://127.0.0.1:3000/api/v1/snapshot`을 열면 `schemaVersion`(1), `scenarioId`("normal"), `trainingOnly`(true), `sites`, `services`, `incidents`, `viewTime`, `mode`("current"), `sessionId`가 보입니다.
  - `sites`에 `"텀블공장"`(목표 `120`)과 `"물류창고"`(목표 `100`)가 있고, 수량과 시각은 아직 비어 있습니다(`null`).

## 4-9. 현장 값 채우기

```text
[4-9] 오늘 운영 화면의 카드와 그래프를 채우기 위해, 오늘 운영 자료의 두 현장에 수량, 시각, 그래프 자료, 사진 주소, 상태를 추가해 주세요.
사진을 돌려주는 주소는 다음 번호에서 만듭니다.
자세한 내용은 docs/guide/session-4.md의 "오늘 운영 자료"를 참고해 주세요.
```

- 하는 일: 다시 켜면 `snapshot` 응답의 두 현장에 수량, 시각, 그래프 자료, 사진 주소, 상태가 채워집니다. 상태가 `warning`인 현장은 확인할 일(`incidents`)에 한 건씩 들어갑니다.
- 목표: 4-6의 시드 기록으로 오늘 운영 화면의 카드와 그래프가 강사 API 때와 같은 모양으로 나오게 합니다.
- 완료 기준:
  - 다시 켠 뒤 `http://127.0.0.1:3000/api/v1/snapshot`을 열면 `sites.factory.completed`가 `100`, `sites.warehouse.completed`가 `75`, `target`은 `120`과 `100`이고, `image.url`은 `http://127.0.0.1:3000/api/v1/images/factory`, `…/warehouse`입니다.
  - 4-6에서 처음 켠 지 28분이 안 됐으면 두 현장 모두 `"status":"normal"`, note `"기록이 반영되고 있습니다."`, `incidents`는 `[]`입니다. 28분이 넘었으면 두 현장 모두 `"warning"`, note가 `"텀블공장 기록이 30분 넘게 들어오지 않았습니다."`·`"물류창고 기록이 30분 넘게 들어오지 않았습니다."`이고 `incidents`가 2건입니다. 이 서버는 켠 뒤로 기록이 늘지 않아서 이렇게 되는 것이 맞습니다.

## 4-10. 현장 사진 주소

```text
[4-10] 화면이 내 서버에서도 현장 사진을 받도록, 강사 사진 두 장을 내 서버 폴더로 복사하고 사진을 돌려주는 주소를 추가해 주세요.
사진 파일은 열거나 바꾸지 마세요.
자세한 내용은 docs/guide/session-4.md의 "현장 사진"과 "주소와 응답"을 참고해 주세요.
```

- 하는 일: `backend\assets`에 강사 사진 두 장이 복사되고, 다시 켜면 `/api/v1/images/:id` 주소가 더해집니다.
- 목표: 4-9에서 넣은 사진 주소가 실제로 사진을 돌려주게 합니다. `public\assets\approved`의 사진은 5회차에 다시 쓰므로 그대로 둡니다.
- 완료 기준:
  - `backend\assets` 안에 `factory.png`, `warehouse.png`가 있고, `public\assets\approved`의 사진도 그대로 남아 있습니다.
  - 다시 켤 때의 줄에 `Mapped {/api/v1/images/:id, GET} route`가 더해졌고, `http://127.0.0.1:3000/api/v1/images/factory`를 열면 컨베이어 위 상자 그림이, `…/images/warehouse`를 열면 물류창고 그림이 보입니다.

## 4-11. 화면을 내 서버에 연결

```text
[4-11] 화면이 강사 API 대신 내 서버 값을 읽도록, 연결 설정 파일의 연결 주소를 내 서버 주소로 바꿔 주세요.
기다리는 시간과 다른 파일은 그대로 둡니다.
자세한 내용은 docs/guide/session-4.md의 "내 서버의 구성"을 참고해 주세요.
```

- 하는 일: `public\config.js`의 `apiBaseUrl` 한 값이 `"http://127.0.0.1:3000"`으로 바뀝니다.
- 목표: 3회차에 연결 설정을 파일 하나로 나눠 두었으므로 화면 코드를 고치지 않고 이 값만 바꿔 내 서버로 옮깁니다.
- 완료 기준: `public\config.js`가 여전히 네 줄이고 `apiBaseUrl`만 `"http://127.0.0.1:3000"`으로 바뀌었습니다(끝에 `/` 없음). 1단계로 되돌릴 때는 `API_CONTRACT.md` 9절 표의 1단계 값을 씁니다.

## 4-12. 내 서버 값으로 화면 보기 (직접 하기)

1. 4-6에서 서버를 처음 켠 지 28분이 넘었거나 날짜가 바뀌었으면 시드 기록을 지금 시각 기준으로 다시 만듭니다. 서버 창(`backend` 폴더)에서 Ctrl+C로 끄고 아래를 칩니다. `del` 줄 대신 파일 탐색기에서 `backend\var\state.json`을 지우고 `npm.cmd start`만 쳐도 됩니다.

```powershell
del var\state.json
npm.cmd start
```

2. 서버 창(`backend`, 3000)과 화면 창(대시보드 폴더, 4173)이 둘 다 켜져 있는지 보고, Chrome에서 `http://127.0.0.1:4173`을 새로고침합니다.

- 하는 일: 화면 창과 서버 창을 둘 다 켜고 Chrome에서 대시보드를 새로고침해 내 서버 값으로 나오는지 봅니다.
- 목표: 4회차 끝 상태입니다. 3회차까지 만든 화면이 그대로 내 서버의 자료로 동작하는지 확인합니다.
- 완료 기준:
  - 2에서: 1단계와 같은 배치로 "생산 100개 · 목표 120개", "출고 75개 · 목표 100개", 현장 사진 두 장, 시간별 그래프가 보이고 화면 맨 위는 "조회 정상"입니다. 알림 전송 기록 카드는 "전송 성공", "알림 전송이 완료됐습니다."와 마지막 전송 시도 시각을 보여 줍니다.
  - 2에서: F12, Network 탭에서 `snapshot` 요청이 10초마다 `http://127.0.0.1:3000/api/v1/snapshot`으로 나가고 상태가 200이며, 사진 요청은 `http://127.0.0.1:3000/api/v1/images/factory`, `…/warehouse`입니다. Console 탭에 CORS 오류가 없습니다.
  - 2에서: 생산 기록 화면과 출고 기록 화면의 줄 수가 `state.json`의 생산·출고 건수와 같고, 화면 맨 위의 기준 시각에서 오늘의 지난 정시를 고르면 Network 탭에 `?at=`이 붙은 요청이 보이고 그때까지의 수량으로 바뀝니다.
- 막히면: 처음 켠 지 28분이 넘으면 두 현장이 "확인 필요"이고 "기록이 30분 넘게 들어오지 않았습니다." 안내가 보입니다. 위의 1로 상태 파일을 새로 만들면 정상 표시로 돌아옵니다.

## 4-13. 내 코드 남겨 두기 (직접 하기)

1. 명령 창에서 아래를 한 줄씩 칩니다. 4-1에서 가져온 보충 문서도 이 커밋에 함께 저장됩니다.

```powershell
cd C:\ai-class\tumble-dashboard
git add -A
git commit -m "4회차 내 NestJS 서버"
```

- 하는 일: 4-1에서 가져온 보충 문서와 `backend` 폴더의 코드, 바꾼 `public\config.js`를 내 저장소에 커밋합니다.
- 목표: 4회차를 끝낸 상태를 남겨 두고, 5회차는 이 상태에서 이어 갑니다.
- 완료 기준: `git status`를 치면 "nothing to commit"이 나옵니다. `backend\node_modules`, `backend\dist`, `backend\var`는 커밋에 들어가지 않습니다.

## 4회차 끝 확인

- [ ] `backend` 폴더에서 `npm.cmd ls --depth=0`을 치면 4-3의 일곱 패키지가 같은 버전으로 나옵니다.
- [ ] 서버 창의 `npm.cmd start`에 `Mapped` 줄이 health, records, snapshot, images 네 개이고 `Nest application successfully started`로 끝납니다.
- [ ] `http://127.0.0.1:3000/api/v1/health`가 `{"status":"ok","releaseId":"local"}`입니다.
- [ ] `http://127.0.0.1:3000/api/v1/snapshot`에서 생산 `completed` 100, 출고 75, `image.url`이 `http://127.0.0.1:3000/api/v1/images/…`입니다.
- [ ] `backend\var\state.json`은 서버를 처음 켤 때 생기고, 다시 켜도 `sessionId`가 그대로입니다.
- [ ] `public\config.js`는 네 줄이고 `apiBaseUrl`만 `"http://127.0.0.1:3000"`, `timeoutMs`는 `5000`입니다.
- [ ] `http://127.0.0.1:4173`에서 1단계와 같은 화면이 내 서버 값으로 "조회 정상", 사진 두 장, 시간별 그래프, 기록 화면 표와 함께 보입니다.
- [ ] 4-13에서 내 코드를 커밋했습니다.

이번 회차의 자세한 약속은 [4회차 보충 문서](../docs/guide/session-4.md)에 있습니다. 5회차는 [5회차 문서](session-5.md)의 "시작 전에"부터 이어 갑니다.
