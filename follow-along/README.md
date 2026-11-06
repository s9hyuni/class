# 텀블공장 운영 대시보드 따라하기

6회차 수업에서 AI 도구에 프롬프트를 하나씩 붙여 넣으며 텀블공장 운영 대시보드를 만듭니다.
프롬프트는 무엇을 만드는지 쉬운 말로 적은 1~3줄과, 맨 끝의 "자세한 내용은 … 참고해 주세요." 한 줄입니다. 파일 이름, 주소 규칙, 긴 화면 글은 앱 폴더의 보충 문서(`docs\guide`)에 있고, AI 도구가 그 문서를 읽어 씁니다.

회차 문서는 수강생 저장소의 GitHub 화면에서 `main` 브랜치의 `follow-along` 폴더를 열어 봅니다.

| 회차 | 파일 | 단계 수 | 끝나면 되는 것 | 완료 브랜치 |
|---|---|---|---|---|
| 1 | [session-1.md](session-1.md) | 18 | PC에서 오늘 운영 다섯 영역이 두 열, 375px에서 한 열로 보임(숫자는 고정 100/120, 75/100) | `milestone-1` |
| 2 | [session-2.md](session-2.md) | 27 | 예시 자료로 수량·그래프·배지·기록 표·알림·도움말이 동작하고 다섯 화면 주소가 열림 | `milestone-2` |
| 3 | [session-3.md](session-3.md) | 36 | 강사 공개 API 값이 10초마다 갱신되고, 실패해도 이전 값이 유지되며, 과거 시각과 조회 기록이 동작 | `milestone-3` |
| 4 | [session-4.md](session-4.md) | 30 | 내 NestJS 서버(127.0.0.1:3000) 값으로 같은 화면 | `milestone-4` |
| 5 | [session-5.md](session-5.md) | 31 | 내 Google 시트를 읽는 GAS 웹 앱 값으로 같은 화면과 기록 조회 | `milestone-5` |
| 6 | [session-6.md](session-6.md) | 27 | Discord 알림, 기록 더하기·처리, 트리거 | `main` |

지난 판(10-29, 한 번에 3~4줄 방식)은 [etc](etc/) 폴더에 있습니다. 수업에는 이 폴더의 회차 파일을 씁니다.

## 따라 하는 규칙

- 회차를 시작할 때와 새 대화를 열 때마다 "대화 시작 프롬프트"를 먼저 보냅니다.
- 프롬프트는 상자 하나씩 통째로 복사해 붙여 넣습니다. 앞 번호가 끝난 뒤에 다음 번호를 보냅니다.
- 프롬프트 맨 앞의 `[3-12]` 같은 표시는 단계 번호입니다. AI 도구가 어느 단계인지 알아야 하므로 지우지 않습니다.
- "직접 하기"는 AI 도구에 보내지 않고 내가 합니다.
- 결과가 예시와 글자까지 같지 않아도 같은 기능이면 됩니다. 따옴표로 적은 화면 글자와 "확인"에 적힌 동작만 맞으면 됩니다.

## 준비물

- Windows 10·11 PC, Chrome
- Node.js 22 이상, Git for Windows
- 프롬프트를 보낼 AI 도구
- 수강생 저장소에 초대받은 GitHub 계정(1회차 시작부터 씁니다. 앱 폴더를 이 저장소에서 받습니다)
- 개인 Google 계정(5회차부터 Google 시트와 Apps Script에 씁니다)
- 본인 Discord 시험 채널의 웹훅(6회차에 씁니다)

로고, 현장 사진 두 장, `API_CONTRACT.md`는 저장소에 들어 있어 따로 받지 않습니다.

## 먼저 알아 둘 말

- **터미널**: 명령을 치는 창입니다. Windows의 PowerShell 창을 씁니다.
- **서버 터미널, 서버 창**: 서버를 켜 두는 PowerShell 창입니다. 명령을 치는 창과 따로 하나 더 엽니다. 3회차까지는 서버가 화면 서버 하나뿐이라 그 창을 "서버 창"이라고 부릅니다. 4회차부터 서버가 둘이 되면 화면 서버를 켜 둔 창을 "화면 창", 내 서버를 켜 둔 창을 "서버 창"이라고 부릅니다.
- **직접 하기**: AI 도구에 보내지 않고 내가 손으로 하는 일입니다.
- **확인**: 그 단계가 잘 됐는지 화면이나 터미널에서 보는 방법입니다.
- **보충 문서**: AI 도구가 읽고 그대로 따르는 자세한 약속입니다. `docs\guide\session-N.md`이고, 사람이 읽어도 됩니다.
- **대화 시작 프롬프트**: AI 도구에게 규칙과 보충 문서를 읽게 하는 프롬프트입니다. 번호가 없습니다.

## 폴더

- 수업 폴더는 `C:\ai-class`, 앱 폴더는 `C:\ai-class\tumble-dashboard`입니다. OneDrive가 동기화하는 폴더나 한글이 든 경로는 피합니다.
- 앱 폴더를 받는 방법은 1회차 파일의 "시작 전에"에 있습니다.
- 파일이 있는지는 파일 탐색기나 AI 도구의 파일 목록에서 봅니다.

## 공통 안내

회차 파일에서 "공통 안내"라고 부르는 곳이 이 절입니다.

### 진행 방법

1. AI 도구로 `C:\ai-class\tumble-dashboard` 폴더를 엽니다.
2. 회차 파일의 "대화를 시작할 때"에 있는 대화 시작 프롬프트를 보냅니다.
3. 회차 파일의 프롬프트를 번호 순서대로 하나씩 붙여 넣습니다.
4. 각 번호의 "확인"을 직접 해 봅니다. 다르게 나오면 화면에 나온 오류 문장이나 터미널의 빨간 줄을 그대로 AI 도구에 붙여 넣고 고쳐 달라고 합니다. 단 `AKfyc`나 `script.google.com`, `discord.com/api/webhooks`가 든 줄은 붙여 넣지 말고 그 부분을 지우거나 강사에게 보여 줍니다.
5. 서버는 내가 PowerShell 창에서 직접 끄고 켭니다. 화면 서버는 앱 폴더에서 `npm.cmd start`(주소 http://127.0.0.1:4173), 4회차부터 쓰는 내 서버는 `backend` 폴더에서 켭니다. 끌 때는 그 창에서 Ctrl+C를 누릅니다. 서버를 켜 둔 창이 이미 있으면 다시 켜지 않고 주소만 엽니다. `EADDRINUSE`가 나오면 서버를 켜 둔 창을 찾아 Ctrl+C로 끕니다.
6. 5·6회차의 `npm.cmd run gas:…` 명령(Google 로그인·코드 올리기·배포)도 내가 직접 칩니다.

AI 도구가 바꾸려는 파일이나 실행할 명령을 물어보면 훑어보고 승인합니다. 도구마다 다를 수 있어서 묻지 않아도 문제가 아닙니다. 단 `icacls`, `Set-ExecutionPolicy`, `npm audit fix`처럼 컴퓨터 설정이나 프로그램을 바꾸는 명령은 승인하지 말고 강사에게 알립니다. `.clasp.json`, `.env`를 열겠다고 하거나 `npm.cmd run gas:`, `npm.cmd start`, `git`을 실행하겠다고 하면 승인하지 말고 "이건 제가 직접 합니다"라고 보냅니다. 5회차부터는 `public\config.js`를 열겠다고 할 때도 승인하지 않습니다.

### 대화 시작 프롬프트

회차를 시작할 때와 새 대화를 열 때마다 이 프롬프트를 먼저 보냅니다.

```text
이 폴더의 AGENTS.md를 읽고 그 규칙대로 해 주세요. 읽은 문서를 한 줄로 알려 주세요. 아직 아무것도 만들지 마세요.
```

- 확인: 답 맨 앞에 "읽은 문서: session-1 ~ session-N"(N은 이번 회차)이 보입니다.

### 규칙 파일과 보충 문서

- `AGENTS.md`는 AI 도구가 지킬 규칙입니다. `docs\guide\session-1.md`부터 이번 회차까지가 보충 문서입니다.
- 두 가지 모두 내가 직접 고치지 않습니다. 문서를 받을 때 저장소 판으로 경고 없이 덮입니다. 내 메모는 `docs\guide` 밖에 둡니다.
- 프롬프트 맨 끝의 "자세한 내용은 … 참고해 주세요." 줄은 지우지 말고 같이 보냅니다. AI 도구가 그 절을 읽고 만듭니다. 보충 문서를 직접 읽지 않아도 따라 할 수 있습니다.

### 비밀 값

- 5회차부터 `public/config.js`에 내 GAS 웹 앱 주소가 들어갑니다. 이 주소는 내 Google 시트를 누구나 읽게 하는 주소이므로 `public/config.js`를 다른 사람에게 보내거나 채팅·화면 공유·문서에 옮기지 않습니다.
- 6회차의 Discord 웹훅 주소는 Apps Script의 스크립트 속성에만 넣고, 채팅이나 파일에 적지 않습니다.
- `.clasp.json`(내 Apps Script 프로젝트 연결 정보)과 `.env`는 Git에 올라가지 않습니다.

### 회차를 시작할 때

2회차부터는 회차를 시작할 때 아래 두 경로 가운데 하나를 고릅니다. 회차 파일의 "시작 전에"에 번호를 채운 명령이 있으니 그것을 그대로 복사합니다. 아래는 3회차 예시입니다.

| 시작할 회차 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|
| 쓰는 브랜치 | `milestone-1` | `milestone-2` | `milestone-3` | `milestone-4` | `milestone-5` |

**앞 회차를 끝냈으면: 규칙과 보충 문서만 받습니다.** PowerShell 창에서 첫 줄부터 칩니다.

```powershell
cd C:\ai-class\tumble-dashboard
git fetch origin
git checkout origin/milestone-2 -- AGENTS.md docs/guide
```

- 확인: `docs\guide`에서 가장 큰 번호가 `session-3.md`입니다.
- 내 코드는 바뀌지 않습니다. Git에서 받은 파일이 "커밋할 변경"으로 보일 수 있지만 그대로 둡니다. 커밋하지 않습니다.
- `git fetch`와 `git checkout`은 늘 함께 칩니다. `git fetch`를 빼면 오류 없이 옛 문서를 받습니다.
- 어느 줄에서든 빨간 오류가 나오면 다음으로 가지 말고 강사에게 알립니다.
- 줄 끝의 `-- AGENTS.md docs/guide`를 빠뜨려 화면에 `detached HEAD`가 보이면 `git switch -`를 치고 강사에게 알립니다. `error:`로 끝나고 멈췄다면 아무것도 바뀌지 않은 것이니 명령을 다시 복사해 칩니다. 다시 쳐도 같은 오류가 나오면 강사에게 알립니다.
- 회차 진행 중에 강사가 문서를 고쳤다고 알리면 같은 명령을 한 번 더 칩니다. 받은 뒤에는 새 대화를 열어 대화 시작 프롬프트를 보냅니다.

**앞 회차를 못 끝냈으면: 완료 브랜치를 새 폴더에 받습니다.** 이 브랜치에 규칙과 보충 문서도 들어 있습니다.

1. 켜 둔 서버를 모두 그 창에서 Ctrl+C로 끄고, 그 창들과 AI 도구를 닫습니다.
2. PowerShell 창을 새로 열고 칩니다.

```powershell
cd C:\ai-class
Rename-Item tumble-dashboard tumble-dashboard-before-session-3
git clone -b milestone-2 https://github.com/startup-life/aiops-dashboard-student.git tumble-dashboard
```

빨간 오류가 나오면 다음으로 가지 말고 강사에게 알립니다.

- 옛 폴더 이름의 숫자는 시작할 회차 번호입니다. 회차마다 이름이 달라서 다음에 또 받아도 겹치지 않습니다. 회차 파일의 명령에는 번호가 채워져 있습니다.
- 6회차 완료본 `main`을 받을 때는 다음 회차가 없으므로 옛 폴더 이름이 다릅니다. 이 경우에만 아래 명령을 칩니다.

```powershell
cd C:\ai-class
Rename-Item tumble-dashboard tumble-dashboard-before-main
git clone -b main https://github.com/startup-life/aiops-dashboard-student.git tumble-dashboard
```

빨간 오류가 나오면 다음으로 가지 말고 강사에게 알립니다.

- 처음 받을 때 GitHub 로그인 창이 뜨면 이 저장소에 초대받은 계정으로 로그인합니다.
- 내가 만든 코드는 `tumble-dashboard-before-session-3` 폴더에 그대로 남습니다.

### 4회차 이후 브랜치(`milestone-4`, `milestone-5`, `main`)

내 서버(`backend` 폴더)의 패키지와 빌드 결과는 저장소에 없으므로 직접 만듭니다.

```powershell
cd C:\ai-class\tumble-dashboard\backend
npm.cmd ci
npm.cmd run build
```

### 5회차 이후 브랜치(`milestone-5`, `main`)

받은 브랜치에는 내 GAS 연결 파일이 없고, `public/config.js`의 `apiBaseUrl`은 `"http://127.0.0.1:3000"`(내 서버)입니다. 아래처럼 내 GAS 쪽으로 다시 연결합니다.

옛 폴더 이름은 받은 브랜치에 따라 다릅니다. `milestone-5`를 받았으면 `tumble-dashboard-before-session-6`, `main`을 받았으면 `tumble-dashboard-before-main`입니다. 1번과 2번은 내가 받은 브랜치의 상자만 복사합니다.

1. 옛 폴더의 GAS 연결 파일을 복사합니다.

`milestone-5`를 받았으면:

```powershell
Copy-Item C:\ai-class\tumble-dashboard-before-session-6\.clasp.json C:\ai-class\tumble-dashboard\
```

`main`을 받았으면:

```powershell
Copy-Item C:\ai-class\tumble-dashboard-before-main\.clasp.json C:\ai-class\tumble-dashboard\
```

2. 옛 폴더의 `public\config.js`를 열어 내 웹 앱 주소(`https://script.google.com/macros/s/…/exec`)를 복사합니다.

`milestone-5`를 받았으면:

```powershell
notepad C:\ai-class\tumble-dashboard-before-session-6\public\config.js
```

`main`을 받았으면:

```powershell
notepad C:\ai-class\tumble-dashboard-before-main\public\config.js
```

3. 새 폴더의 `public\config.js`(`notepad C:\ai-class\tumble-dashboard\public\config.js`)를 열어 `apiBaseUrl`을 그 주소로, `timeoutMs`를 `15000`으로 바꾸고 저장합니다. 다른 줄은 그대로 둡니다.
4. `npm.cmd run gas:deploy`는 다시 하지 않습니다. 배포가 하나 더 생겨 주소가 바뀝니다(배포를 한 번도 못 했으면 6번을 봅니다). 적어 둔 주소가 없으면 `npm.cmd run gas:editor`로 편집기를 열고 위쪽 배포, 배포 관리에서 설명이 `dashboard`인 배포의 웹 앱 URL을 복사합니다.
5. 5회차를 중간까지만 했으면 받은 브랜치의 GAS 코드를 내 프로젝트에 올리고 같은 배포를 갱신합니다. 앱 폴더에서 `npm.cmd run gas:push`, 이어서 `npm.cmd run gas:redeploy`를 칩니다. 주소는 그대로입니다.
6. `.clasp.json`은 있는데 배포를 못 했으면(옛 폴더 `public\config.js`의 `apiBaseUrl`이 `http://127.0.0.1:3000`이면) 1번의 `.clasp.json`만 복사하고, 2~5번 대신 [session-5.md](session-5.md)의 5-24, 5-25, 5-26, 5-27, 5-28을 차례로 합니다. 배포가 아직 없으므로 이 경우에는 5-26의 `gas:deploy`를 합니다. 5-28의 마지막 확인(생산 기록 보기의 "서버가 알린 이유")은 건너뜁니다. 받은 코드에는 기록 조회가 들어 있어 표가 바로 나옵니다. 5-29~5-31은 하지 않습니다.
7. 옛 폴더에 `.clasp.json`과 웹 앱 주소가 둘 다 없으면(5회차에서 GAS 프로젝트를 만들기 전에 멈췄으면) 1~5번 대신 새 폴더에서 [session-5.md](session-5.md)의 5-1(Apps Script API 켜기), 5-8(Google 로그인), 5-23~5-28(프로젝트 만들기, 코드 올리기, 첫 권한 승인과 실습 시트 만들기, 웹 앱 배포, 웹 앱 응답 확인, 화면 확인)을 차례로 합니다. 5-28의 마지막 확인(생산 기록 보기의 "서버가 알린 이유")은 건너뜁니다. 받은 코드에는 기록 조회가 들어 있어 표가 바로 나옵니다. 5-29~5-31은 하지 않습니다.

### 받은 뒤

AI 도구로 새 `tumble-dashboard` 폴더를 엽니다. PowerShell 창을 새로 열어 화면 서버를 켭니다. 3회차까지는 이 창이 "서버 창"이고, 4회차부터는 "화면 창"입니다.

```powershell
cd C:\ai-class\tumble-dashboard
npm.cmd start
```

4회차 이후 브랜치는 PowerShell 창을 하나 더 열어 "서버 창"으로 쓰고 내 서버도 켭니다.

```powershell
cd C:\ai-class\tumble-dashboard\backend
npm.cmd start
```

http://127.0.0.1:4173 이 열리는지 확인한 뒤 대화 시작 프롬프트를 보내고 다음 회차를 시작합니다.
