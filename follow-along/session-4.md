# 4회차: 내 NestJS 서버

- **시작 상태**: 3회차를 끝낸 `C:\ai-class\tumble-dashboard` 폴더에서 이어 합니다. 화면이 강사 API 값으로 10초마다 바뀌고, 실패 안내·과거 시각·조회 기록이 동작하는 상태입니다.
- **끝나면 되는 것**
  - 대시보드 폴더 안 `backend` 폴더에 내가 만든 NestJS 서버가 `http://127.0.0.1:3000`에서 켜집니다. 처음 켤 때 오늘 기록(생산 100개, 출고 75개)을 만들어 `backend\var\state.json`에 저장합니다.
  - 화면 코드는 그대로 두고 연결 주소만 `http://127.0.0.1:3000`으로 바꾸면, 1단계와 같은 화면이 내 서버 값으로 "조회 정상"으로 나옵니다.
- **준비물**: 3회차까지 만든 대시보드 폴더, Node.js 22 이상, 패키지를 받을 인터넷, Chrome.

## 시작 전에 (프롬프트 없이 직접 합니다)

1. PowerShell 창(이하 "화면 창")에서 아래를 치고 Chrome에서 `http://127.0.0.1:4173`을 엽니다. 화면 맨 위에 "조회 정상"이 보이는지 봅니다. 내 서버(`backend`)는 4-5에서 처음 켭니다.

```powershell
cd C:\ai-class\tumble-dashboard
npm.cmd start
```

   서버를 켜 둔 창이 이미 있으면 이 명령을 치지 않고 주소만 엽니다.

2. AI 도구로 `C:\ai-class\tumble-dashboard` 폴더를 열고 새 대화를 시작합니다.

## 진행 방법

- 프롬프트 상자 하나를 통째로 복사해 AI 도구에 붙여 넣습니다. 앞 번호가 끝난 뒤에 다음 번호를 보냅니다. 제목에 "(직접 하기)"가 붙은 번호와 "직접 하기" 줄은 AI 도구에 보내지 않고, 명령 상자는 PowerShell 창에 직접 칩니다.
- AI 도구가 바꾸려는 파일이나 실행할 명령을 물어보면 훑어보고 승인합니다. 도구마다 달라서 묻지 않아도 문제가 아닙니다. 4-1에서 수업 저장소를 받는 `git` 명령과 4-10에서 사진을 복사하는 명령도 승인합니다. 단 `icacls`, `Set-ExecutionPolicy`, `npm audit fix`처럼 컴퓨터 설정이나 프로그램을 바꾸는 명령은 승인하지 말고 강사에게 알립니다. `.clasp.json`, `.env`를 열겠다고 하거나 `npm.cmd start`, `git commit`을 실행하겠다고 하면 승인하지 말고 "이건 제가 직접 합니다"라고 보냅니다.
- AI 도구가 서버를 끄거나 `backend` 폴더의 설치·빌드를 실행하겠다고 해도 승인하지 말고 같은 말을 보냅니다.
- "확인"과 다르게 나오면 화면의 글이나 서버 창의 빨간 줄을 그대로 복사해 "이렇게 나와요. 고쳐 주세요."와 함께 AI 도구에 붙여 넣습니다.
- AI 도구가 "이미 되어 있습니다"라고 답하면 그 번호의 "확인"만 해 보고 다음 번호로 넘어갑니다. 앞 번호에서 먼저 만들어졌을 수 있습니다.
- 답이 이상해지면 새 대화를 열고 4-1의 프롬프트를 다시 보낸 뒤, 하던 번호부터 이어 갑니다.
- 이번 회차는 PowerShell 창을 세 개 씁니다.
  - 화면 창: `cd C:\ai-class\tumble-dashboard` 뒤 `npm.cmd start`(4173). 켜 둔 채로 둡니다.
  - 서버 창: `cd C:\ai-class\tumble-dashboard\backend` 뒤 `npm.cmd start`(3000). 4-5부터 씁니다.
  - 확인용 창: `cd C:\ai-class\tumble-dashboard` 뒤 설치, `curl.exe` 같은 명령을 칩니다.
- **서버 코드를 바꾼 번호(4-6 ~ 4-10)의 확인은 늘 서버를 다시 빌드해 켠 뒤에 봅니다.** 서버 창에서 Ctrl+C로 끄고(Y/N을 물으면 `Y`), `npm.cmd run build`, `npm.cmd start`를 차례로 칩니다. 빌드를 하지 않으면 예전 코드가 그대로 돕니다.
- 파일을 열어 볼 때는 메모장을 씁니다. 창이 어느 폴더에 있든 되도록 전체 경로로 칩니다. 예: `notepad C:\ai-class\tumble-dashboard\backend\var\state.json`
- 서버 창에는 켤 때의 줄과 오류 줄만 나오고, 요청마다 줄이 남지 않습니다. 요청은 Chrome의 F12, Network 탭에서 봅니다.
- 명령은 `npm.cmd`, `curl.exe`로 칩니다. PowerShell에서 `curl`만 치면 다른 명령이 실행됩니다.
- 주소창에 시각을 넣을 때는 `Z`로 끝나는 꼴만 씁니다. `+09:00`의 `+`는 주소에서 공백으로 바뀌어 400이 나옵니다.

| 번호 | 하는 일 |
|---|---|
| 4-1 | 지침 세팅 |
| 4-2 ~ 4-5 | 서버 폴더와 상태 확인 주소(설치·빌드·켜기는 직접) |
| 4-6 | 시드 기록과 상태 파일 |
| 4-7 | 기록 목록 |
| 4-8 ~ 4-9 | 오늘 운영 자료 |
| 4-10 | 현장 사진 |
| 4-11 ~ 4-12 | 화면 연결과 확인 |
| 4-13 | 내 코드 남겨 두기 |

## 4-1. 지침 세팅

```text
[4-1] 이번 회차 문서를 이 프로젝트로 가져오기 위해, 수업 저장소(class)를 다시 받아 class/milestone-3의 AGENTS.md와 docs/guide를 git checkout class/milestone-3 -- AGENTS.md docs/guide 꼴로 이 프로젝트로 가져와 주세요(브랜치는 옮기지 않습니다).
그다음 AGENTS.md를 작업 지침으로 삼아 주세요. 프롬프트에 없는 상세 구현은 docs/guide의 회차 문서와 그 회차 완료 브랜치 코드(class/milestone-4)에서 확인합니다.
지금은 AGENTS.md와 docs/guide의 회차 문서를 끝까지 읽기만 하고, 답 맨 앞에 "읽은 문서: session-1 ~ session-4" 꼴로 읽은 문서를 한 줄로 알려 주세요.
```
- 확인: 파일 탐색기나 AI 도구의 파일 목록에서 `docs\guide`에 `session-4.md`가 생기고, 답 맨 앞이 "읽은 문서: session-1 ~ session-4"입니다.
- 새 대화를 열 때마다 이 프롬프트를 먼저 보냅니다.

## 4-2. 내 서버 폴더와 설정 파일

여기부터 대시보드 폴더 안 `backend` 폴더에 내 서버를 만듭니다. 화면 쪽 파일은 4-11에서 한 값만 바꿉니다.

```text
[4-2] 화면에 값을 줄 내 서버를 만들기 위해, 대시보드 폴더 안에 내 서버(NestJS) 폴더와 패키지 목록, 설정 파일을 추가해 주세요.
패키지 설치는 제가 직접 하니 하지 마세요.
자세한 내용은 docs/guide/session-4.md의 "내 서버의 구성"을 참고해 주세요.
```
- 확인: `backend` 안에 `package.json`, `tsconfig.json`, `.gitignore`가 생겼고, `package.json`의 버전 숫자 앞에 `^`나 `~`가 없습니다. 아직 `node_modules` 폴더는 없습니다.

## 4-3. 패키지 설치 (직접 하기)

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

## 4-4. 서버 시작 파일과 상태 확인 주소

```text
[4-4] 내 서버가 켜져 있는지 알 수 있도록, 내 서버에 시작 파일과 서버 상태를 답하는 상태 확인 주소를 추가해 주세요.
다른 주소는 뒤 번호에서 만듭니다.
자세한 내용은 docs/guide/session-4.md의 "내 서버의 구성"과 "주소와 응답"을 참고해 주세요.
```
- 확인: `backend\src` 안에 파일이 세 개 있습니다.

## 4-5. 빌드하고 처음 켜기 (직접 하기)

PowerShell 창을 하나 더 열어 서버 창으로 씁니다.

```powershell
cd C:\ai-class\tumble-dashboard\backend
npm.cmd run build
npm.cmd start
```

- 확인: `[Nest]`로 시작하는 줄 가운데 `Mapped {/api/v1/health, GET} route`가 있고, 마지막 줄이 `Nest application successfully started`입니다. Chrome에서 `http://127.0.0.1:3000/api/v1/health`를 열면 `{"status":"ok","releaseId":"local"}`이 보입니다.
- 확인: 확인용 창에서 `curl.exe -i "http://127.0.0.1:3000/api/v1/health"`를 치면 `HTTP/1.1 200 OK`, `Access-Control-Allow-Origin: *`, `Cache-Control: no-store` 줄이 보입니다.
- Windows 방화벽 허용 창이 뜨면 취소하고 강사에게 알립니다. 이 서버는 이 PC 안에서만 열려야 합니다.
- 서버 창에 `EADDRINUSE`가 나오고 서버가 끝나면 3000번 포트를 다른 프로그램이 쓰고 있습니다. 그 프로그램을 닫거나 강사에게 알립니다.

## 4-6. 시드 기록과 상태 파일

서버를 처음 켤 때 오늘 0시부터 켠 시각까지의 기록을 만들어 둡니다. 이 기록을 시드 기록이라고 부릅니다.

```text
[4-6] 화면에 보일 오늘 기록을 마련하기 위해, 내 서버에 켤 때 시드 기록(생산 100개, 출고 75개)을 만들어 상태 파일에 저장하는 기능을 추가해 주세요.
자세한 내용은 docs/guide/session-4.md의 "기록과 시드 기록"과 "상태 파일"을 참고해 주세요.
```
- 직접 하기: 서버를 다시 빌드해 켠 뒤 확인용 창에서 `notepad C:\ai-class\tumble-dashboard\backend\var\state.json`로 엽니다.
- 확인: 맨 위 키가 `sessionId`(`"lesson-"`으로 시작), `records`, `scenarioId`(`"normal"`), `revision`(`1`), `changedAt`이고, 첫 기록이 `"id": "seed-production-0"`입니다. 생산 기록이 모두 나온 뒤 `seed-shipment-0`부터 출고 기록이 이어집니다. 합계 100개·75개는 4-9에서 봅니다.
- 확인: 서버를 끄고 다시 켠 뒤 `state.json`을 다시 열면 `sessionId`가 그대로입니다. 이미 있는 파일을 다시 쓴 것입니다.
- 시각은 UTC 글자라 한국 시간에서 9시간을 뺀 값입니다. 건수는 켠 시각에 따라 다릅니다.

## 4-7. 기록 목록 주소

```text
[4-7] 기록 화면이 내 서버에서 기록을 받도록, 내 서버에 생산·출고 기록을 시간 구간으로 골라 돌려주는 기록 목록 주소를 추가해 주세요.
오늘 운영 자료 주소는 다음 번호에서 만듭니다.
자세한 내용은 docs/guide/session-4.md의 "기준 시각과 기록 목록"과 "주소와 응답"을 참고해 주세요.
```
- 확인: 다시 켤 때의 줄에 `Mapped {/api/v1/records, GET} route`가 더해졌고, `http://127.0.0.1:3000/api/v1/records?kind=production`을 열면 `{"sessionId":"lesson-…","viewTime":"…","records":[…]}`이고 기록이 발생 시각 순서이며 모두 `"status":"completed"`입니다.
- 확인: `?kind=abc`는 `{"message":"생산 또는 출고 기록을 선택해 주세요.","error":"Bad Request","statusCode":400}`이고, `?kind=production&at=2099-01-01T00:00:00Z`는 `"오늘의 현재 이전 시각을 선택해 주세요."`가 들어간 400입니다.

## 4-8. 오늘 운영 자료 주소

```text
[4-8] 오늘 운영 화면이 내 서버 값을 읽도록, 내 서버에 오늘 운영 자료 주소를 추가해 주세요.
두 현장은 이름과 목표만 넣고, 나머지 값은 다음 번호에서 채웁니다.
자세한 내용은 docs/guide/session-4.md의 "오늘 운영 자료"와 "주소와 응답"을 참고해 주세요.
```
- 확인: 다시 켤 때의 줄에 `Mapped {/api/v1/snapshot, GET} route`가 더해졌고, `http://127.0.0.1:3000/api/v1/snapshot`을 열면 `schemaVersion`(1), `scenarioId`("normal"), `trainingOnly`(true), `sites`, `services`, `incidents`, `viewTime`, `mode`("current"), `sessionId`가 보입니다.
- 확인: `sites`에 `"텀블공장"`(목표 `120`)과 `"물류창고"`(목표 `100`)가 있고, 수량과 시각은 아직 비어 있습니다(`null`).

## 4-9. 현장 값 채우기

```text
[4-9] 오늘 운영 화면의 카드와 그래프를 채우기 위해, 오늘 운영 자료의 두 현장에 수량, 시각, 그래프 자료, 사진 주소, 상태를 추가해 주세요.
사진을 돌려주는 주소는 다음 번호에서 만듭니다.
자세한 내용은 docs/guide/session-4.md의 "오늘 운영 자료"를 참고해 주세요.
```
- 확인: 다시 켠 뒤 `http://127.0.0.1:3000/api/v1/snapshot`을 열면 `sites.factory.completed`가 `100`, `sites.warehouse.completed`가 `75`, `target`은 `120`과 `100`이고, `image.url`은 `http://127.0.0.1:3000/api/v1/images/factory`, `…/warehouse`입니다.
- 확인: 4-6에서 처음 켠 지 28분이 안 됐으면 두 현장 모두 `"status":"normal"`, note `"기록이 반영되고 있습니다."`, `incidents`는 `[]`입니다. 28분이 넘었으면 두 현장 모두 `"warning"`, note가 `"텀블공장 기록이 30분 넘게 들어오지 않았습니다."`·`"물류창고 기록이 30분 넘게 들어오지 않았습니다."`이고 `incidents`가 2건입니다. 이 서버는 켠 뒤로 기록이 늘지 않아서 이렇게 되는 것이 맞습니다.

## 4-10. 현장 사진 주소

```text
[4-10] 화면이 내 서버에서도 현장 사진을 받도록, 강사 사진 두 장을 내 서버 폴더로 복사하고 사진을 돌려주는 주소를 추가해 주세요.
사진 파일은 열거나 바꾸지 마세요.
자세한 내용은 docs/guide/session-4.md의 "현장 사진"과 "주소와 응답"을 참고해 주세요.
```
- 확인: `backend\assets` 안에 `factory.png`, `warehouse.png`가 있고, `public\assets\approved`의 사진도 그대로 남아 있습니다.
- 확인: 다시 켤 때의 줄에 `Mapped {/api/v1/images/:id, GET} route`가 더해졌고, `http://127.0.0.1:3000/api/v1/images/factory`를 열면 컨베이어 위 상자 그림이, `…/images/warehouse`를 열면 물류창고 그림이 보입니다.

## 4-11. 화면을 내 서버에 연결

```text
[4-11] 화면이 강사 API 대신 내 서버 값을 읽도록, 연결 설정 파일의 연결 주소를 내 서버 주소로 바꿔 주세요.
기다리는 시간과 다른 파일은 그대로 둡니다.
자세한 내용은 docs/guide/session-4.md의 "내 서버의 구성"을 참고해 주세요.
```
- 확인: `public\config.js`가 여전히 네 줄이고 `apiBaseUrl`만 `"http://127.0.0.1:3000"`으로 바뀌었습니다(끝에 `/` 없음). 1단계로 되돌릴 때는 `API_CONTRACT.md` 9절 표의 1단계 값을 씁니다.

## 4-12. 내 서버 값으로 화면 보기 (직접 하기)

- 직접 하기: 4-6에서 서버를 처음 켠 지 28분이 넘었거나 날짜가 바뀌었으면 시드 기록을 지금 시각 기준으로 다시 만듭니다. 서버 창(`backend` 폴더)에서 Ctrl+C로 끄고 아래를 칩니다. 파일 탐색기에서 `backend\var\state.json`을 지워도 됩니다.

```powershell
del var\state.json
npm.cmd start
```

- 직접 하기: 서버 창(`backend`, 3000)과 화면 창(대시보드 폴더, 4173)이 둘 다 켜져 있는지 보고, Chrome에서 `http://127.0.0.1:4173`을 새로고침합니다.
- 확인: 1단계와 같은 배치로 "생산 100개 · 목표 120개", "출고 75개 · 목표 100개", 현장 사진 두 장, 시간별 그래프가 보이고 화면 맨 위는 "조회 정상"입니다. 알림 전송 기록 카드는 "전송 성공", "알림 전송이 완료됐습니다."와 마지막 전송 시도 시각을 보여 줍니다.
- 확인: F12, Network 탭에서 `snapshot` 요청이 10초마다 `http://127.0.0.1:3000/api/v1/snapshot`으로 나가고 상태가 200이며, 사진 요청은 `http://127.0.0.1:3000/api/v1/images/factory`, `…/warehouse`입니다. Console 탭에 CORS 오류가 없습니다.
- 확인: 생산 기록 화면과 출고 기록 화면의 줄 수가 `state.json`의 생산·출고 건수와 같고, 화면 맨 위의 기준 시각에서 오늘의 지난 정시를 고르면 Network 탭에 `?at=`이 붙은 요청이 보이고 그때까지의 수량으로 바뀝니다.
- 처음 켠 지 28분이 넘으면 두 현장이 "확인 필요"이고 "기록이 30분 넘게 들어오지 않았습니다." 안내가 보입니다. 위의 첫 직접 하기로 상태 파일을 새로 만들면 정상 표시로 돌아옵니다.

## 4-13. 내 코드 남겨 두기 (직접 하기)

프롬프트는 없습니다.

- 직접 하기: 확인용 창에서 아래를 한 줄씩 칩니다. 4-1에서 가져온 보충 문서도 이 커밋에 함께 저장됩니다.

```powershell
cd C:\ai-class\tumble-dashboard
git add -A
git commit -m "4회차 내 NestJS 서버"
```

- 확인: `git status`를 치면 "nothing to commit"이 나옵니다. `backend\node_modules`, `backend\dist`, `backend\var`는 커밋에 들어가지 않습니다.

## 4회차 끝 확인

- [ ] `backend` 폴더에서 `npm.cmd ls --depth=0`을 치면 4-3의 일곱 패키지가 같은 버전으로 나옵니다.
- [ ] 서버 창의 `npm.cmd start`에 `Mapped` 줄이 health, records, snapshot, images 네 개이고 `Nest application successfully started`로 끝납니다.
- [ ] `http://127.0.0.1:3000/api/v1/health`가 `{"status":"ok","releaseId":"local"}`입니다.
- [ ] `http://127.0.0.1:3000/api/v1/snapshot`에서 생산 `completed` 100, 출고 75, `image.url`이 `http://127.0.0.1:3000/api/v1/images/…`입니다.
- [ ] `backend\var\state.json`은 서버를 처음 켤 때 생기고, 다시 켜도 `sessionId`가 그대로입니다.
- [ ] `public\config.js`는 네 줄이고 `apiBaseUrl`만 `"http://127.0.0.1:3000"`, `timeoutMs`는 `5000`입니다.
- [ ] `http://127.0.0.1:4173`에서 1단계와 같은 화면이 내 서버 값으로 "조회 정상", 사진 두 장, 시간별 그래프, 기록 화면 표와 함께 보입니다.
- [ ] 4-13에서 내 코드를 커밋했습니다.

이번 회차의 자세한 약속은 [보충 문서](../docs/guide/session-4.md)에 있습니다.
