# 4회차: 1단계 정리와 내 NestJS 서버

- **시작 상태**: 3회차를 끝낸 `C:\ai-class\tumble-dashboard` 폴더에서 이어 합니다. 3회차를 끝내지 못했으면 아래 "시작 전에"의 안내대로 `milestone-3` 브랜치를 새 폴더에 받습니다. 화면이 강사 API 값으로 10초마다 바뀌고, 실패 안내·과거 시각·조회 기록이 동작하는 상태입니다.
- **끝나면 되는 것**
  - 1단계 정리: 쓰지 않는 코드를 지우고, `npm.cmd run check`로 문법 검사를 하고, `README.md`에 실행 방법과 단계별 설정 값이 있습니다.
  - 대시보드 폴더 안 `backend` 폴더에 내가 만든 NestJS 서버가 `http://127.0.0.1:3000`에서 켜집니다. 처음 켤 때 오늘 기록(생산 100개, 출고 75개)을 만들어 `backend\var\state.json`에 저장합니다.
  - 화면 코드는 그대로 두고 연결 주소만 `http://127.0.0.1:3000`으로 바꾸면, 1단계와 같은 화면이 내 서버 값으로 "조회 정상"으로 나옵니다.
- **준비물**: 3회차까지 만든 대시보드 폴더, Node.js 22 이상, 패키지를 받을 인터넷, Chrome.

## 시작 전에 (프롬프트 없이 직접 합니다)

앞 회차를 끝냈는지에 따라 둘 가운데 하나를 합니다.

### 3회차를 끝냈으면: 문서만 받습니다

PowerShell 창을 열고 차례로 칩니다. 창이 어느 폴더에 있든 첫 줄부터 칩니다.

```powershell
cd C:\ai-class\tumble-dashboard
git fetch origin
git checkout origin/milestone-3 -- AGENTS.md docs/guide
```

- 확인: 파일 탐색기나 AI 도구의 파일 목록에서 `docs\guide`의 가장 큰 번호가 `session-4.md`입니다.
- 내 코드는 바뀌지 않습니다. AI 도구에 파일 변경 표시가 생겨도 그대로 둡니다. 커밋하지 않습니다.
- 첫 줄이나 둘째 줄에서 빨간 오류가 나오면 다음으로 가지 말고 강사에게 알립니다.
- `git fetch`와 `git checkout`은 늘 함께 칩니다. `git fetch`를 빼면 오류 없이 옛 문서를 받습니다.
- `AGENTS.md`와 `docs\guide` 안의 파일을 고치면 받을 때 경고 없이 저장소 판으로 덮입니다. 내 메모는 이 파일들 밖에 둡니다.
- 줄 끝의 `-- AGENTS.md docs/guide`를 빠뜨려 화면에 `detached HEAD`가 보이면 `git switch -`를 치고 강사에게 알립니다. `error:`로 끝나고 멈췄다면 아무것도 바뀌지 않은 것이니 명령을 다시 복사해 칩니다.
- 회차를 진행하는 중에 강사가 문서를 고쳤다고 알리면 이 명령을 한 번 더 칩니다. 내 코드는 그대로입니다.

### 3회차를 못 끝냈으면: 완료 브랜치를 새 폴더에 받습니다

이 브랜치에 문서도 함께 들어 있습니다.

1. 켜 둔 서버를 모두 그 창에서 Ctrl+C로 끄고, 그 창들과 AI 도구를 닫습니다. 폴더를 쓰는 프로그램이 있으면 이름이 바뀌지 않을 수 있습니다.
2. PowerShell 창을 새로 열고 칩니다.

```powershell
cd C:\ai-class
Rename-Item tumble-dashboard tumble-dashboard-before-session-4
git clone -b milestone-3 https://github.com/startup-life/aiops-dashboard-student.git tumble-dashboard
```

빨간 오류가 나오면 다음으로 가지 말고 강사에게 알립니다.

3. GitHub 로그인 창이 뜨면 초대받은 계정으로 로그인합니다.
4. 내가 만든 코드는 `tumble-dashboard-before-session-4` 폴더에 그대로 남습니다.

### 그다음에 합니다

1. AI 도구로 `C:\ai-class\tumble-dashboard` 폴더를 엽니다.
2. PowerShell 창(이하 "화면 창")에서 아래를 치고 Chrome에서 `http://127.0.0.1:4173`을 엽니다. 머리 부분에 "조회 정상"이 보이는지 봅니다.

```powershell
cd C:\ai-class\tumble-dashboard
npm.cmd start
```

   서버를 켜 둔 창이 이미 있으면 이 명령을 치지 않고 주소만 엽니다.

3. `public\config.js`의 두 값이 `API_CONTRACT.md` 9절 표의 1단계 값(강사 API 주소, `5000`)과 같은지 눈으로 봅니다.

## 진행 방법

- 프롬프트 블록은 하나씩 통째로 복사해 AI 도구의 대화창에 붙여 넣습니다. 제목에 "(직접 하기)"가 붙은 단계의 명령 상자는 AI 도구에 보내지 않고 PowerShell 창에 직접 칩니다.
- 프롬프트 맨 끝의 "자세한 내용은 … 참고해 주세요." 줄을 보고 AI 도구가 `docs\guide` 폴더의 문서에서 이름과 규칙을 찾습니다. 문서 내용을 이해하지 않아도 됩니다.
- AI 도구가 바꾸려는 파일이나 실행할 명령을 물어보면 훑어보고 승인합니다. 도구마다 달라서 묻지 않아도 문제가 아닙니다. 단 `icacls`, `Set-ExecutionPolicy`, `npm audit fix`처럼 컴퓨터 설정이나 프로그램을 바꾸는 명령은 승인하지 말고 강사에게 알립니다. `.clasp.json`, `.env`를 열겠다고 하거나 `npm.cmd run gas:`, `npm.cmd start`, `git`을 실행하겠다고 하면 승인하지 말고 "이건 제가 직접 합니다"라고 보냅니다.
- AI 도구가 서버를 끄거나 `backend` 폴더의 설치·빌드를 실행하겠다고 해도 승인하지 말고 같은 말을 보냅니다.
- AI 도구가 더 나은 방법이나 기능을 제안해도 받아들이지 말고 "프롬프트에 적힌 대로만 해 주세요"라고 답합니다.
- 이번 회차는 PowerShell 창을 세 개 씁니다.
  - 화면 창: `cd C:\ai-class\tumble-dashboard` 뒤 `npm.cmd start`(4173). 켜 둔 채로 둡니다.
  - 서버 창: `cd C:\ai-class\tumble-dashboard\backend` 뒤 `npm.cmd start`(3000). 4-11부터 씁니다.
  - 확인용 창: `cd C:\ai-class\tumble-dashboard` 뒤 설치, 검사, `curl.exe` 같은 명령을 칩니다.
- 파일을 열어 보거나 고칠 때는 메모장을 씁니다. 창이 어느 폴더에 있든 되도록 전체 경로로 칩니다. 예: `notepad C:\ai-class\tumble-dashboard\backend\var\state.json`
- 서버 코드를 바꾼 뒤 확인할 때는 서버 창에서 Ctrl+C로 끄고(Y/N을 물으면 `Y`), `npm.cmd run build`, `npm.cmd start`를 차례로 칩니다. 빌드를 하지 않으면 예전 코드가 그대로 돕니다.
- 서버 창에는 켤 때의 줄과 오류 줄만 나오고, 요청마다 줄이 남지 않습니다. 요청은 Chrome의 F12, Network 탭에서 봅니다.
- 명령은 `npm.cmd`, `curl.exe`로 칩니다. PowerShell에서 `curl`만 치면 다른 명령이 실행됩니다.
- 주소창에 시각을 넣을 때는 `Z`로 끝나는 꼴만 씁니다. `+09:00`의 `+`는 주소에서 공백으로 바뀌어 400이 나옵니다.

| 번호 | 하는 일 |
|---|---|
| 4-1 ~ 4-7 | 1단계 정리(쓰지 않는 코드, 문법 검사, 시험용 응답, README, 되돌리기) |
| 4-8 ~ 4-11 | 서버 뼈대와 상태 확인 주소(설치·빌드·켜기는 직접) |
| 4-12 ~ 4-16 | 시드 기록, 상태 파일, 상태 파일 검사 |
| 4-17 ~ 4-18 | 기록 목록 |
| 4-19 ~ 4-22 | 오늘 운영 자료 |
| 4-23 ~ 4-25 | 현장 사진 |
| 4-26 ~ 4-28 | 상태 파일 새로 만들기, 화면 연결 |
| 4-29 ~ 4-30 | 확인 실습(서버 끄기, 상태 파일 오류, 잘못된 요청) |

## 대화를 시작할 때

```text
이 폴더의 AGENTS.md를 읽고 그 규칙대로 해 주세요. 읽은 문서를 한 줄로 알려 주세요. 아직 아무것도 만들지 마세요.
```

- 확인: 답 맨 앞에 "읽은 문서: session-1 ~ session-4"가 보입니다.
- 회차를 시작할 때와 새 대화를 열 때마다 이 프롬프트를 먼저 보냅니다.

## 4-1. 쓰지 않는 코드 찾기

```text
[4-1] 더 쓰지 않는 파일과 어디서도 부르지 않는 코드를 찾아 목록으로 알려 주세요. 검증표, 강사가 준 파일, 프로젝트 소개 글, 그림은 뺍니다.
연결 설정 파일이 네 줄인지, 화면이 그 파일을 먼저 읽는지도 함께 알려 주세요.
아직 아무것도 고치지 마세요.
자세한 내용은 docs/guide/session-4.md의 '1단계 정리'를 참고해 주세요.
```

- 확인: 답에 목록이 나오고 파일은 바뀌지 않았습니다. 쓰지 않는 함수는 사람마다 다르고, 없을 수도 있습니다.

## 4-2. 쓰지 않는 코드 지우기

4-1과 같은 대화에서 보냅니다. 대화를 새로 열었으면 4-1부터 다시 보냅니다. 답에 나온 "지울 것"이 화면 동작에 쓰이는 것이 아닌지 먼저 훑어봅니다.

```text
[4-2] 방금 알려 준 것 가운데 화면 동작에 쓰이지 않는 것만 지워 주세요. 화면 동작은 바꾸지 마세요.
자세한 내용은 docs/guide/session-4.md의 '1단계 정리'를 참고해 주세요.
```

- 확인: 새로고침하면 "조회 정상"이고, 생산 기록 화면(`#/records/factory`)과 조회 기록 화면(`#/queries/factory`)이 전처럼 열립니다.

## 4-3. 문법 검사 명령

```text
[4-3] 화면 코드, 연결 설정 파일, 화면 서버 파일의 문법을 한 번에 검사하는 check 명령을 더해 주세요.
원래 있던 명령과 다른 파일은 바꾸지 마세요.
자세한 내용은 docs/guide/session-4.md의 '1단계 정리'를 참고해 주세요.
```

- 직접 하기: 확인용 창(대시보드 폴더)에서 `npm.cmd run check`를 칩니다.
- 확인: 오류 없이 끝납니다.
- 직접 하기: `public\app.js` 맨 끝에 `{`를 하나 넣고 저장한 뒤 `npm.cmd run check`를 칩니다.
- 확인: `SyntaxError`와 줄 번호가 나옵니다. 그 글자를 지우고 다시 치면 오류가 없어집니다.

## 4-4. 시험용 응답 파일 만들기

강사 API로는 볼 수 없는 실패 두 가지(정상 응답 안에 든 오류, JSON이 아닌 응답)를 내 PC에서 봅니다. 5회차 GAS에서 실제로 나올 수 있는 모양입니다.

```text
[4-4] 실패 화면을 확인하려고 시험용 응답 파일 두 개를 만들어 주세요.
하나는 정상 응답 안에 시험용 오류를 담고, 다른 하나는 JSON이 아닌 글 한 줄입니다.
다른 파일은 바꾸지 마세요.
자세한 내용은 docs/guide/session-4.md의 '1단계 정리'를 참고해 주세요.
```

- 확인: 파일 탐색기나 AI 도구의 파일 목록에서 `public\test` 아래에 확장자 없는 `snapshot` 파일이 두 개(`error`, `not-json` 쪽) 보입니다.

## 4-5. 시험용 응답으로 실패 안내 보기 (직접 하기)

확인용 창에서 `notepad public\config.js`로 열어 `apiBaseUrl` 값만 바꾸고 저장한 뒤 Chrome을 새로고침합니다. 하나씩 확인합니다.

1. `"http://127.0.0.1:4173/test/error"`
   - 확인: 노란 안내가 "현재 자료를 가져오지 못했습니다. 서버가 요청을 처리하지 못했습니다. 서버가 알린 이유: 시험용 오류입니다. 조회할 자료가 없습니다."입니다.
2. `"http://127.0.0.1:4173/test/not-json"`
   - 확인: 노란 안내가 "현재 자료를 가져오지 못했습니다. 서버 응답이 JSON 형식이 아닙니다. 연결 주소가 API 서버 주소인지 확인해 주세요. 조회할 자료가 없습니다."입니다.
3. 원래 1단계 주소(`API_CONTRACT.md` 9절)로 되돌려 저장합니다. 4-7에서 한 번 더 확인합니다.

## 4-6. README에 실행 방법과 설정 값 적기

```text
[4-6] 프로젝트 소개 글 끝에 실행 방법, 검사 방법, 화면 주소, 단계별 연결 설정 값을 더해 주세요.
원래 있던 글은 바꾸지 마세요.
자세한 내용은 docs/guide/session-4.md의 '1단계 정리'를 참고해 주세요.
```

- 확인: `README.md` 끝에 "실행", "검사", "화면 주소", "단계별 public/config.js 값" 네 절이 생겼고, 화면 주소 표에 `#/today`부터 `#/queries/warehouse`까지 다섯 줄이 있습니다.
- 확인: 단계별 설정 값 표의 1단계 값이 지금 `public\config.js`와 글자까지 같습니다. 2단계는 `"http://127.0.0.1:3000"`과 `5000`, 3단계는 `"<GAS 웹앱 주소>"`와 `15000`입니다.

## 4-7. 시험용 파일 지우고 1단계 설정 확인

```text
[4-7] 시험용 응답 폴더를 지워 주세요.
그리고 연결 설정이 1단계 값인지 확인해서, 다르면 그 두 값만 고쳐 주세요.
자세한 내용은 docs/guide/session-4.md의 '1단계 정리'를 참고해 주세요.
```

- 직접 하기: 확인용 창에서 `npm.cmd run check`를 치고 Chrome을 새로고침합니다.
- 확인: `public\test`가 없어졌고, 검사가 오류 없이 끝나고, 화면이 "조회 정상"입니다. 여기까지가 1단계 정리입니다.

## 4-8. 내 서버 폴더와 설정 파일

여기부터 대시보드 폴더 안 `backend` 폴더에 내 서버를 만듭니다. 화면 쪽 파일은 4-27에서 한 값만 바꿉니다.

```text
[4-8] 대시보드 폴더 안에 내 서버(NestJS) 폴더를 만들고, 패키지 목록, TypeScript 설정, Git 제외 목록을 넣어 주세요.
패키지는 정해진 버전 그대로 쓰고, 버전 앞에 ^나 ~를 붙이지 않습니다.
설치는 제가 직접 하니 하지 마세요.
자세한 내용은 docs/guide/session-4.md의 '내 서버의 구성'을 참고해 주세요.
```

- 확인: `backend\package.json`이 생겼고, 버전 숫자 앞에 `^`나 `~`가 없습니다. 아직 `node_modules` 폴더는 없습니다.
- 확인: `backend` 안에 `tsconfig.json`과 `.gitignore`가 생겼습니다.

## 4-9. 패키지 설치 (직접 하기)

확인용 창에서 칩니다.

```powershell
cd C:\ai-class\tumble-dashboard\backend
npm.cmd install
npm.cmd ls --depth=0
cd C:\ai-class\tumble-dashboard
```

마지막 줄은 확인용 창을 대시보드 폴더로 되돌립니다.

- 확인: `backend\node_modules`와 `backend\package-lock.json`이 생깁니다. 취약점(vulnerabilities) 안내가 나와도 그대로 둡니다(`npm audit fix`를 치지 않습니다).
- 확인: `npm.cmd ls --depth=0`의 결과에 `@nestjs/common@11.2.7`, `@nestjs/core@11.2.7`, `@nestjs/platform-express@11.2.7`, `@types/node@24.4.0`, `reflect-metadata@0.2.2`, `rxjs@7.8.2`, `typescript@5.9.3` 일곱 줄이 나옵니다.

## 4-10. 서버 시작 파일과 상태 확인 주소

```text
[4-10] 내 서버의 시작 파일과, 서버가 켜져 있는지 답하는 상태 확인 주소 하나를 만들어 주세요.
다른 주소는 아직 만들지 마세요.
자세한 내용은 docs/guide/session-4.md의 '내 서버의 구성'과 '주소와 응답'을 참고해 주세요.
```

- 확인: `backend\src` 안에 파일이 세 개 있습니다.

## 4-11. 빌드하고 처음 켜기 (직접 하기)

PowerShell 창을 하나 더 열어 서버 창으로 씁니다.

```powershell
cd C:\ai-class\tumble-dashboard\backend
npm.cmd run build
npm.cmd start
```

- 확인: `[Nest]`로 시작하는 줄 가운데 `Mapped {/api/v1/health, GET} route`가 있고, 마지막 줄이 `Nest application successfully started`입니다. 창은 열린 채로 있습니다.
- 확인: Chrome에서 `http://127.0.0.1:3000/api/v1/health`를 열면 `{"status":"ok","releaseId":"local"}`이 보입니다.
- 확인: 확인용 창에서 `curl.exe -i "http://127.0.0.1:3000/api/v1/health"`를 치면 `HTTP/1.1 200 OK`, `Access-Control-Allow-Origin: *`, `Cache-Control: no-store` 줄이 보입니다.
- 확인: `http://127.0.0.1:3000/api/v1/nothing`을 열면 `{"message":"Cannot GET /api/v1/nothing","error":"Not Found","statusCode":404}`입니다. 정하지 않은 주소에는 NestJS가 이렇게 답합니다.
- Windows 방화벽 허용 창이 뜨면 취소하고 강사에게 알립니다. 이 서버는 이 PC 안에서만 열려야 합니다.
- 서버 창에 `EADDRINUSE`가 나오고 서버가 끝나면 3000번 포트를 다른 프로그램이 쓰고 있습니다. 그 프로그램을 닫거나 강사에게 알립니다.

## 4-12. 시드 기록과 상태 파일

서버를 처음 켤 때 오늘 0시부터 켠 시각까지의 기록을 만들어 둡니다. 이 기록을 시드 기록이라고 부릅니다. 생산은 모두 100개, 출고는 모두 75개가 되도록 나눕니다(4-14에서 셉니다).

```text
[4-12] 서버를 켤 때 오늘 0시부터 켠 시각 조금 전까지의 시드 기록(생산 100개, 출고 75개)을 만들어 상태 파일에 저장해 주세요.
상태 파일이 이미 있으면 새로 만들지 않고 그 내용을 그대로 씁니다.
자세한 내용은 docs/guide/session-4.md의 '기록과 시드 기록'과 '상태 파일'을 참고해 주세요.
```

- 확인: AI 도구가 만들었다고 알려 줍니다. 저장된 결과는 4-13에서 봅니다.

## 4-13. 다시 켜고 상태 파일 보기 (직접 하기)

서버 창에서 Ctrl+C로 끄고 `npm.cmd run build`, `npm.cmd start`를 칩니다.

- 확인: 켤 때의 줄은 4-11과 같고, `backend\var\state.json`이 새로 생겼습니다.
- 확인: 확인용 창에서 `notepad C:\ai-class\tumble-dashboard\backend\var\state.json`로 열면 맨 위 키가 `sessionId`(`"lesson-"`으로 시작), `records`, `scenarioId`(`"normal"`), `revision`(`1`), `changedAt`입니다.
- 확인: 시각은 UTC 글자라 한국 시간에서 9시간을 뺀 값입니다. 첫 기록은 `"id": "seed-production-0"`이고 `occurredAt`이 전날 `T15:00:00.000Z`(오늘 한국 0시), `receivedAt`은 2초 뒤, `processedAt`은 5초 뒤입니다. 생산 기록이 모두 나온 뒤 `seed-shipment-0`부터 출고 기록이 이어집니다.
- 건수는 켠 시각에 따라 다릅니다. 한국 시간 오전 10시에 처음 켰으면 생산과 출고가 각각 31건(`-0`부터 `-30`까지)입니다.
- 서버를 끄고 다시 켠 뒤 `state.json`을 다시 열면 `sessionId`가 그대로입니다. 이미 있는 파일을 다시 쓴 것입니다.

## 4-14. 합계 세어 보기

```text
[4-14] 상태 파일의 기록을 생산과 출고로 나눠 건수와 수량 합계를 세어 알려 주세요. 파일은 고치지 마세요.
자세한 내용은 docs/guide/session-4.md의 '상태 파일'과 '기록과 시드 기록'을 참고해 주세요.
```

- 확인: 생산 합계 100, 출고 합계 75입니다.

## 4-15. 상태 파일 검사

상태 파일 내용이 잘못됐으면 서버가 켜지지 않고 이유를 서버 창에 남기게 합니다. 잘못된 파일은 고치거나 지우지 않습니다.

```text
[4-15] 서버를 켤 때 이미 있는 상태 파일의 기본 값과 기록 한 건 한 건을 검사해 주세요.
값이나 기록이 틀리면 파일을 고치거나 지우지 말고, 이유를 담은 오류를 내서 서버가 켜지지 않게 합니다.
JSON 문법이 틀린 파일은 원래 나는 오류를 바꾸지 않고 그대로 냅니다.
자세한 내용은 docs/guide/session-4.md의 '상태 파일'을 참고해 주세요.
```

- 확인: AI 도구가 고쳤다고 알려 줍니다. 동작은 4-16에서 봅니다.

## 4-16. 상태 파일 검사 확인 (직접 하기)

1. 서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.
   - 확인: 정상으로 켜지고, `state.json`의 `sessionId`가 그대로입니다.
2. 서버를 끕니다. 확인용 창에서 `notepad C:\ai-class\tumble-dashboard\backend\var\state.json`로 열고 파일 끝 쪽 `"scenarioId": "normal",`을 `"scenarioId": "test",`로 바꿔 저장한 뒤 `npm.cmd start`를 칩니다.
   - 확인: 서버 창에 `STATE_FILE 내용이 잘못되었습니다. 기존 파일을 보존하고 확인해 주세요.`가 든 오류 줄이 나오고 서버가 끝납니다.
   - 확인: `state.json`을 다시 열면 `"test"`가 그대로 있습니다. 서버가 파일을 덮어쓰지 않았습니다.
3. `"normal"`로 되돌려 저장하고 `npm.cmd start`를 치면 다시 켜집니다.
4. (선택) 첫 기록의 `"quantity"`를 `0`으로 바꾸면 `저장된 기록을 확인해 주세요.`가 든 오류 줄이 나옵니다. 확인한 뒤 원래 숫자로 되돌립니다. 원래 숫자를 잊었으면 4-26으로 상태 파일을 새로 만듭니다.

## 4-17. 기록 목록 주소

기록 화면(`#/records/factory`, `#/records/warehouse`)이 읽는 기록 목록을 만듭니다. 여기서 만드는 기준 시각 검사는 오늘 운영 자료에서도 그대로 씁니다.

```text
[4-17] 기록 화면이 읽는 기록 목록 주소를 만들어 주세요. 생산이나 출고 한 종류의 기록을 시간 구간으로 골라 돌려줍니다.
기준 시각보다 늦은 접수·처리 시각은 비우고, 잘못된 요청에는 이유를 담아 400으로 답합니다.
저장된 기록 자체는 바꾸지 않습니다.
자세한 내용은 docs/guide/session-4.md의 '기준 시각과 기록 목록'과 '주소와 응답'을 참고해 주세요.
```

- 확인: AI 도구가 만들었다고 알려 줍니다. 동작은 4-18에서 봅니다.

## 4-18. 기록 목록 확인 (직접 하기)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.

- 확인: 켤 때의 줄에 `Mapped {/api/v1/records, GET} route`가 더해졌습니다.
- 확인: `http://127.0.0.1:3000/api/v1/records?kind=production`을 열면 `{"sessionId":"lesson-…","viewTime":"…","records":[…]}`이고, 기록이 발생 시각 순서이며 모두 `"status":"completed"`입니다. `?kind=shipment`는 출고 기록만 나옵니다.
- 확인: `?kind=abc`는 `{"message":"생산 또는 출고 기록을 선택해 주세요.","error":"Bad Request","statusCode":400}`입니다.
- 확인: `?kind=production&at=2099-01-01T00:00:00Z`는 `"오늘의 현재 이전 시각을 선택해 주세요."`, `?kind=production&from=2099-01-01T00:00:00Z`는 `"조회 시간 구간을 확인해 주세요."`가 들어간 400입니다.
- 확인: 첫 생산 기록의 `occurredAt`을 복사해 초 자리 `00.000Z`를 `03.000Z`로 바꾼 뒤 `at`에 넣어 엽니다(예: `?kind=production&at=2026-11-08T15:00:03.000Z`). 기록이 1건만 나오고 `receivedAt`은 값이 있고 `processedAt`은 `null`, `status`는 `"processing-wait"`입니다. 처리 시각(5초 뒤)이 기준 시각(3초 뒤)보다 늦어서 가려진 것입니다.

## 4-19. 오늘 운영 자료 주소

오늘 운영 화면(`#/today`)이 10초마다 읽는 자료를 만듭니다. 모양을 먼저 만들고 두 현장 값은 4-21에서 채웁니다.

```text
[4-19] 화면이 10초마다 읽는 오늘 운영 자료 주소를 만들어 주세요. 기준 시각 검사는 기록 목록에서 만든 것을 그대로 씁니다.
두 현장은 이름과 목표만 넣고 수량과 시각은 아직 비워 둡니다.
자세한 내용은 docs/guide/session-4.md의 '오늘 운영 자료'와 '주소와 응답'을 참고해 주세요.
```

- 확인: AI 도구가 만들었다고 알려 줍니다. 동작은 4-20에서 봅니다.

## 4-20. 오늘 운영 자료 모양 확인 (직접 하기)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.

- 확인: 켤 때의 줄에 `Mapped {/api/v1/snapshot, GET} route`가 더해졌습니다.
- 확인: `http://127.0.0.1:3000/api/v1/snapshot`을 열면 `schemaVersion`(1), `scenarioId`("normal"), `trainingOnly`(true), `sites`, `services`, `incidents`, `viewTime`, `mode`("current"), `sessionId`가 보입니다. `viewTime`과 `serverTime`이 같고, `sessionId`는 4-18의 기록 목록과 같습니다.
- 확인: `sites`에 `"텀블공장"`(목표 `120`)과 `"물류창고"`(목표 `100`)가 있습니다. 수량과 시각은 아직 비어 있습니다(`null`). 4-21에서 채웁니다.
- 확인: `services.alerts.lastAttemptAt`이 `changedAt`보다 정확히 1분 이릅니다.
- 확인: 첫 생산 기록의 `occurredAt`(전날 `T15:00:00.000Z`)을 `?at=`에 넣어 열면 `mode`가 `"past"`, `viewTime`이 그 시각입니다.
- 확인: `?at=2099-01-01T00:00:00Z`는 400 `"오늘의 현재 이전 시각을 선택해 주세요."`입니다.

## 4-21. 현장 값 채우기

```text
[4-21] 오늘 운영 자료의 두 현장에 수량, 마지막 기록 시각, 시간별 그래프 자료, 사진 주소, 상태와 안내 문장을 채워 주세요.
확인이 필요한 현장은 확인할 일 목록에도 항목을 넣습니다.
자세한 내용은 docs/guide/session-4.md의 '오늘 운영 자료'를 참고해 주세요.
```

- 확인: AI 도구가 고쳤다고 알려 줍니다. 값은 4-22에서 봅니다.

## 4-22. 현장 값 확인 (직접 하기)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켠 뒤 `http://127.0.0.1:3000/api/v1/snapshot`을 엽니다.

- 확인: `sites.factory.completed`가 `100`, `sites.warehouse.completed`가 `75`, `target`은 `120`과 `100`입니다. `image.url`은 `http://127.0.0.1:3000/api/v1/images/factory`, `…/warehouse`입니다(사진은 4-24에서 보이게 합니다).
- 확인: 한 현장의 `history`에 있는 `quantity`를 모두 더하면 그 현장의 `completed`와 같습니다.
- 확인: 4-13에서 처음 켠 지 28분이 안 됐으면 두 현장 모두 `"status":"normal"`, note `"기록이 반영되고 있습니다."`, `incidents`는 `[]`입니다. 28분이 넘었으면 두 현장 모두 `"warning"`, note가 `"텀블공장 기록이 30분 넘게 들어오지 않았습니다."`·`"물류창고 기록이 30분 넘게 들어오지 않았습니다."`이고 `incidents`가 2건입니다. 마지막 시드 기록이 처음 켠 시각의 2분 전이고 그 뒤로 기록이 늘지 않아서 이렇게 되는 것이 맞습니다.
- 확인: 첫 생산 기록의 `occurredAt`(전날 `T15:00:00.000Z`)을 `?at=`에 넣으면 공장은 `completed`가 `null`, note가 `"텀블공장 기록 처리를 기다리고 있습니다."`, 창고는 note가 `"물류창고의 기록이 없습니다."`이고 `incidents`에 `FACTORY-FEED`와 `WAREHOUSE-FEED`가 있습니다.
- 확인: 같은 시각의 초 자리를 `30.000Z`로 바꾸면 두 현장 모두 `"normal"`이고, `completed`가 각 현장 첫 기록(`seed-production-0`, `seed-shipment-0`)의 `quantity`와 같습니다.

## 4-23. 현장 사진 복사 (직접 하기)

확인용 창에서 칩니다. 탐색기에서 복사해 붙여 넣어도 됩니다.

```powershell
cd C:\ai-class\tumble-dashboard
mkdir backend\assets
copy public\assets\approved\factory.png backend\assets\
copy public\assets\approved\warehouse.png backend\assets\
```

- 확인: `backend\assets` 안에 `factory.png`, `warehouse.png`가 있습니다. `public\assets\approved`의 사진도 그대로 남아 있습니다.

## 4-24. 현장 사진 주소

```text
[4-24] 복사해 둔 공장·창고 사진을 보내는 현장 사진 주소를 더해 주세요. 공장·창고가 아닌 이름은 따로 문장 없이 404로 답합니다.
사진 파일은 열거나 바꾸지 마세요.
자세한 내용은 docs/guide/session-4.md의 '현장 사진'과 '주소와 응답'을 참고해 주세요.
```

- 확인: AI 도구가 고쳤다고 알려 줍니다. 동작은 4-25에서 봅니다.

## 4-25. 현장 사진 확인 (직접 하기)

서버를 끄고 `npm.cmd run build`, `npm.cmd start`로 다시 켭니다.

- 확인: 켤 때의 줄에 `Mapped {/api/v1/images/:id, GET} route`가 더해졌습니다.
- 확인: `http://127.0.0.1:3000/api/v1/images/factory`를 열면 컨베이어 위 상자 그림이, `…/images/warehouse`를 열면 물류창고 그림이 보입니다.
- 확인: 확인용 창에서 `curl.exe -I "http://127.0.0.1:3000/api/v1/images/factory"`를 치면 `HTTP/1.1 200 OK`, `Access-Control-Allow-Origin: *`, `Content-Type: image/png` 줄이 보입니다.
- 확인: `…/images/abc`를 열면 `{"message":"Not Found","statusCode":404}`입니다. 이때 서버 창에 `WARN [ExpressAdapter] Content-Type doesn't match Reply body…` 줄이 찍힐 수도 있습니다(찍히지 않아도 정상입니다).
- 그림 대신 깨진 그림 표시가 나오면 확인용 창에서 `curl.exe -i "http://127.0.0.1:3000/api/v1/images/factory"`를 칩니다. `400 Bad Request`와 `ENOENT: no such file or directory`가 나오면 `backend\assets`에 사진이 없는 것입니다. 4-23을 다시 합니다.

## 4-26. 상태 파일 새로 만들기 (직접 하기)

이 서버에는 기록을 더하는 기능이 없어서, 켠 뒤로는 기록이 늘지 않습니다. 시드 기록을 지금 시각 기준으로 다시 만들 때 이 순서를 씁니다. 화면을 처음 연결하기 전에 한 번 합니다.

- 쓰는 때: 수업을 시작할 때(날짜가 바뀌면 "…의 기록이 없습니다." 경고가 나옵니다), 처음 켠 지 28분이 지나 "기록이 30분 넘게 들어오지 않았습니다." 경고가 나올 때, `state.json`을 고쳤다가 되돌리기 어려울 때.

서버 창(`backend` 폴더)에서 Ctrl+C로 끄고 칩니다. 파일 탐색기에서 `backend\var\state.json`을 지워도 됩니다.

```powershell
del var\state.json
npm.cmd start
```

- 확인: `backend\var\state.json`이 다시 생기고 `sessionId`가 방금 켠 시각을 담은 새 글자로 바뀝니다.
- 확인: `http://127.0.0.1:3000/api/v1/snapshot`의 두 현장이 `"normal"`, `incidents`가 `[]`이고, 생산 `completed`는 100, 출고는 75입니다.

## 4-27. 화면을 내 서버에 연결

```text
[4-27] 화면의 연결 주소만 내 서버 주소로 바꿔 주세요.
기다리는 시간과 다른 파일은 그대로 둡니다.
자세한 내용은 docs/guide/session-4.md의 '내 서버의 구성'을 참고해 주세요.
```

- 확인: `public\config.js`가 여전히 네 줄이고 `apiBaseUrl`만 `"http://127.0.0.1:3000"`으로 바뀌었습니다(끝에 `/` 없음). 1단계로 되돌릴 때는 4-6에서 README에 적은 값을 씁니다.

## 4-28. 내 서버 값으로 화면 보기 (직접 하기)

서버 창(`backend`, 3000)과 화면 창(대시보드 폴더, 4173)이 둘 다 켜져 있는지 보고, Chrome에서 `http://127.0.0.1:4173`을 새로고침합니다.

- 확인: 1단계와 같은 배치로 "생산 100개 · 목표 120개", "출고 75개 · 목표 100개", 현장 사진 두 장, 시간별 그래프가 보이고 머리 부분은 "조회 정상"입니다.
- 확인: 알림 전송 기록 카드는 "전송 성공", "알림 전송이 완료됐습니다."와 마지막 전송 시도 시각을 보여 줍니다.
- 확인: F12, Network 탭에서 `snapshot` 요청이 10초마다 `http://127.0.0.1:3000/api/v1/snapshot`으로 나가고 상태가 200입니다. 사진 요청은 `http://127.0.0.1:3000/api/v1/images/factory`, `…/warehouse`입니다. Console 탭에 CORS 오류가 없습니다.
- 확인: 생산 기록 화면과 출고 기록 화면의 줄 수가 `state.json`의 생산·출고 건수와 같습니다.
- 확인: 머리 부분의 기준 시각에서 오늘의 지난 정시를 고르면 Network 탭에 `?at=`이 붙은 요청이 보이고 그때까지의 수량으로 바뀝니다. "현재로 돌아가기"를 누르면 10초 조회가 다시 시작합니다.
- 처음 켠 지 28분이 넘으면 두 현장이 "확인 필요"이고 "기록이 30분 넘게 들어오지 않았습니다." 안내가 보입니다. 4-26으로 새로 만들면 정상 표시로 돌아옵니다.

## 4-29. 확인 실습: 서버가 멈추거나 요청이 잘못됐을 때 (직접 하기)

화면의 안내와 서버 쪽에서 보이는 것을 맞춰 봅니다. 서버 코드는 고치지 않습니다.

1. **서버를 끈 경우**: 화면을 연 채 서버 창에서 Ctrl+C로 서버를 끕니다.
   - 확인: 10초 안에 머리 부분이 "조회 실패"로 바뀌고 "API 서버에 연결하지 못했습니다. 연결 주소가 맞는지, 직접 띄운 서버라면 켜져 있는지 확인해 주세요. …"와 "아래 내용은 이전 조회 자료입니다."가 나옵니다. 숫자와 그래프는 마지막 정상 자료 그대로입니다.
   - 확인: `npm.cmd start`로 다시 켜면 다음 조회에서 "조회 정상"으로 돌아오고 숫자도 같습니다. 같은 `state.json`을 다시 읽었기 때문입니다.
2. **상태 파일 형식이 틀린 경우**: 서버를 끄고 확인용 창에서 `notepad C:\ai-class\tumble-dashboard\backend\var\state.json`로 열어 첫 기록의 `"id": "seed-production-0",` 줄 끝 쉼표 하나를 지우고 저장한 뒤 `npm.cmd start`를 칩니다.
   - 확인: 서버가 켜지지 않고 서버 창에 `SyntaxError: …in JSON at position …`이 든 오류 줄이 나온 뒤 끝납니다. 화면은 1번과 같은 연결 실패 안내입니다.
   - 쉼표를 되돌리고 `npm.cmd start`를 치면 다시 켜집니다. 되돌리기 어려우면 4-26으로 새로 만듭니다.
3. **요청이 잘못된 경우**: 서버를 켠 채 Chrome 새 탭에서 `http://127.0.0.1:3000/api/v1/records?kind=production&from=2099-01-01T00:00:00Z`를 엽니다.
   - 확인: `{"message":"조회 시간 구간을 확인해 주세요.","error":"Bad Request","statusCode":400}`이 보이고 서버 창에는 줄이 생기지 않습니다.
   - 확인: `http://127.0.0.1:3000/api/v1/snapshot?at=2099-01-01T00:00:00Z`는 `"오늘의 현재 이전 시각을 선택해 주세요."`입니다.
   - 화면은 HTTP 오류가 오면 "서버가 요청 조건을 받아들이지 않았습니다(HTTP 400)."까지만 보여 줍니다. 이유는 F12, Network 탭에서 그 요청을 눌러 Response(응답)에서 봅니다.

## 4-30. 원인 물어보기

4-29의 2번이나 3번을 하면서 아래 프롬프트의 괄호 부분을 채워 붙여 넣습니다.

```text
[4-30] 대시보드 화면에 "(화면에 나온 안내 문구)"가 나옵니다.
아래 서버 창의 줄(또는 브라우저에 나온 응답 본문)을 보고 원인과 되돌리는 방법을 설명해 주세요. 코드는 고치지 마세요.
(서버 창의 줄이나 응답 본문을 여기에 붙여 넣습니다)
자세한 내용은 docs/guide/session-4.md의 '이 회차에서 만드는 것'과 '상태 파일'을 참고해 주세요.
```

- 확인: AI 도구가 안내 문구와 서버 창의 줄(또는 400 응답의 `message`)을 이어서 설명합니다. 2번이면 `state.json`의 쉼표 위치를, 3번이면 `from`이나 `at` 값을 가리키면 맞습니다.
- 서버 코드에 오류 처리를 더하거나 화면 코드를 고치자고 하면 받아들이지 않습니다. 이 서버는 상태 파일이 잘못되면 켜지지 않는 것이 정해진 동작입니다.

## 4회차 끝 확인

- [ ] `public\test`가 없고, 쓰지 않는 코드가 정리됐습니다.
- [ ] 대시보드 폴더에서 `npm.cmd run check`가 오류 없이 끝납니다.
- [ ] `README.md`에 실행, 검사, 화면 주소 다섯 개, 단계별 `public/config.js` 값 표가 있습니다.
- [ ] `backend` 폴더에서 `npm.cmd ls --depth=0`을 치면 4-9의 일곱 패키지가 같은 버전으로 나옵니다.
- [ ] 서버 창의 `npm.cmd start`에 `Mapped` 줄이 health, records, snapshot, images 네 개이고 `Nest application successfully started`로 끝납니다.
- [ ] `http://127.0.0.1:3000/api/v1/health`가 `{"status":"ok","releaseId":"local"}`입니다.
- [ ] `http://127.0.0.1:3000/api/v1/snapshot`에서 생산 `completed` 100, 출고 75, `image.url`이 `http://127.0.0.1:3000/api/v1/images/…`입니다.
- [ ] `backend\var\state.json`은 서버를 처음 켤 때 생기고, 다시 켜도 `sessionId`가 그대로입니다. 내용이 잘못되면 서버가 켜지지 않고 파일은 그대로 남습니다.
- [ ] `public\config.js`는 네 줄이고 `apiBaseUrl`만 `"http://127.0.0.1:3000"`, `timeoutMs`는 `5000`입니다.
- [ ] `http://127.0.0.1:4173`에서 1단계와 같은 화면이 내 서버 값으로 "조회 정상", 사진 두 장, 시간별 그래프, 기록 화면 표와 함께 보입니다.
- [ ] 서버를 끄면 "조회 실패"와 이전 자료, 다시 켜면 "조회 정상"입니다. 잘못된 요청은 400 응답 본문에 이유가 있습니다.

다 되지 않았으면 [session-5.md](session-5.md)의 "시작 전에" 안내대로 `milestone-4` 브랜치를 새 폴더에 받아 5회차를 시작합니다. 서버 패키지 설치와 빌드도 그 안내에 있습니다. `backend\var`는 브랜치에 들어 있지 않아서 처음 켤 때 `state.json`이 새로 만들어집니다.

이번 회차의 자세한 약속은 [보충 문서](../docs/guide/session-4.md)에 있습니다.
