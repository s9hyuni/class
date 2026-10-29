# 텀블공장 운영 대시보드 따라하기

6회차 수업에서 Antigravity에 프롬프트를 하나씩 붙여 넣으며 텀블공장 운영 대시보드를 만듭니다.
프롬프트는 한 번에 3~4줄이고, 화면에서 무엇이 되어야 하는지와 바꾸면 안 되는 이름만 적었습니다. 코드 모양은 Antigravity가 정하므로 사람마다 조금씩 달라도 괜찮습니다.

| 회차 | 파일 | 단계 수 | 끝나면 되는 것 | 완료 브랜치 |
|---|---|---|---|---|
| 1 | [session-1.md](session-1.md) | 45 | PC에서 오늘 운영 다섯 영역이 두 열, 375px에서 한 열로 보임(숫자는 고정 100/120, 75/100) | `milestone-1` |
| 2 | [session-2.md](session-2.md) | 47 | 예시 자료로 수량·그래프·배지·기록 표·알림·도움말이 동작하고 다섯 화면 주소가 열림 | `milestone-2` |
| 3 | [session-3.md](session-3.md) | 61 | 강사 공개 API 값이 10초마다 갱신되고, 실패해도 이전 값이 유지되며, 과거 시각과 조회 기록이 동작 | `milestone-3` |
| 4 | [session-4.md](session-4.md) | 49 | 내 NestJS 서버(127.0.0.1:3000) 값으로 같은 화면 | `milestone-4` |
| 5 | [session-5.md](session-5.md) | 46 | 내 Google 시트를 읽는 GAS 웹 앱 값으로 같은 화면과 기록 조회 | `milestone-5` |
| 6 | [session-6.md](session-6.md) | 27 | Discord 알림, 기록 더하기·처리, 트리거 | `main` |

## 준비물

- Windows 10·11 PC, Chrome
- Node.js 22 이상(저장소 `backend/package.json`의 `engines`가 `>=22`), Git for Windows
- Antigravity
- 강사가 주는 파일 4개(1회차): 로고 `tumble-factory-logo.png`, 현장 사진 `factory.png`·`warehouse.png`, `API_CONTRACT.md`
- 개인 Google 계정(5회차부터 Google 시트와 Apps Script에 씁니다)
- 본인 Discord 시험 채널의 웹훅(6회차에 씁니다)
- 이 저장소에 초대받은 GitHub 계정(완료 브랜치를 받을 때 씁니다)

## 폴더

- 수업 폴더는 `C:\ai-class`, 앱 폴더는 `C:\ai-class\tumble-dashboard`입니다. OneDrive가 동기화하는 폴더나 한글이 든 경로는 피합니다.
- 강사가 준 파일 4개를 놓는 위치는 1회차 파일의 "시작 전에"에 있습니다.

## 진행 방법

1. Antigravity로 `C:\ai-class\tumble-dashboard` 폴더를 엽니다.
2. 회차 파일의 프롬프트를 번호 순서대로 하나씩 붙여 넣습니다. 앞 번호가 끝나기 전에 다음 번호를 보내지 않습니다.
3. 각 번호의 "확인"을 직접 해 봅니다. 다르게 나오면 화면에 나온 오류 문장이나 터미널의 빨간 줄을 그대로 Antigravity에 붙여 넣고 고쳐 달라고 합니다.
4. 서버는 내가 터미널에서 직접 끄고 켭니다. 화면 서버는 앱 폴더에서 `npm.cmd start`(주소 http://127.0.0.1:4173), 4회차부터 쓰는 내 서버는 `backend` 폴더에서 켭니다. 끌 때는 그 터미널에서 Ctrl+C를 누릅니다.
5. 5·6회차의 `npm.cmd run gas:…` 명령(Google 로그인·코드 올리기·배포)도 내가 직접 칩니다.

### 프로젝트 규칙 파일(AGENTS.md)

1회차 첫 프롬프트(1-1)가 앱 폴더 맨 위에 `AGENTS.md`를 만듭니다. Antigravity는 이 프로젝트에서 대화할 때마다 이 파일을 읽습니다. 서브 에이전트를 쓰지 않기, 요청한 일만 하기, 적힌 이름을 바꾸지 않기, `.env`·`.clasp.json`을 열지 않기, 서버와 `gas:` 명령은 사용자가 직접 실행하기, 패키지를 더하거나 버전을 바꾸지 않기 같은 규칙이 들어 있어서 매 프롬프트에 다시 적지 않습니다.
완료 브랜치에는 `AGENTS.md`가 들어 있지 않습니다. 완료 브랜치를 받을 때는 아래 안내대로 옛 폴더의 파일을 복사합니다. 전체 내용은 [session-1.md](session-1.md) 끝의 부록에 있습니다.

### 비밀 값

- 5회차부터 `public/config.js`에 내 GAS 웹 앱 주소가 들어갑니다. 이 주소는 내 Google 시트를 누구나 읽게 하는 주소이므로 `public/config.js`를 다른 사람에게 보내거나 채팅·화면 공유·문서에 옮기지 않습니다.
- 6회차의 Discord 웹훅 주소는 Apps Script의 스크립트 속성에만 넣고, 채팅이나 파일에 적지 않습니다.
- `.clasp.json`(내 Apps Script 프로젝트 연결 정보)과 `.env`는 Git에 올라가지 않습니다.

## 회차를 다 못 끝냈을 때: 완료 브랜치 받기

다음 회차를 시작하기 전에 직전 회차의 완료 브랜치를 받아 같은 출발선에서 시작합니다. 예를 들어 2회차를 못 끝냈으면 3회차 전에 `milestone-2`를 받습니다.

```powershell
cd C:\ai-class
Rename-Item tumble-dashboard tumble-dashboard-old
git clone -b milestone-2 https://github.com/startup-life/aiops-dashboard-student.git tumble-dashboard
Copy-Item tumble-dashboard-old\AGENTS.md tumble-dashboard\
```

- `milestone-2` 자리에 받을 브랜치 이름을 넣습니다(6회차 완료본은 `main`).
- 처음 받을 때 GitHub 로그인 창이 뜨면 이 저장소에 초대받은 계정으로 로그인합니다.
- 옛 폴더에 `AGENTS.md`가 없으면 마지막 줄 대신 새 폴더에서 1회차 1-1 프롬프트를 다시 보냅니다.
- 내가 만든 코드는 `tumble-dashboard-old` 폴더에 그대로 남습니다.

### 4회차 이후 브랜치(`milestone-4`, `milestone-5`, `main`)

내 서버(`backend` 폴더)의 패키지와 빌드 결과는 저장소에 없으므로 직접 만듭니다.

```powershell
cd C:\ai-class\tumble-dashboard\backend
npm.cmd ci
npm.cmd run build
```

### 5회차 이후 브랜치(`milestone-5`, `main`)

받은 브랜치에는 내 GAS 연결 파일이 없고, `public/config.js`의 `apiBaseUrl`은 `"http://127.0.0.1:3000"`(내 서버)입니다. 아래처럼 내 GAS 쪽으로 다시 연결합니다.

1. 옛 폴더의 GAS 연결 파일을 복사합니다.

```powershell
Copy-Item C:\ai-class\tumble-dashboard-old\.clasp.json C:\ai-class\tumble-dashboard\
```

2. 옛 폴더의 `public\config.js`(`notepad C:\ai-class\tumble-dashboard-old\public\config.js`)에서 내 웹 앱 주소(`https://script.google.com/macros/s/…/exec`)를 복사합니다.
3. 새 폴더의 `public\config.js`(`notepad C:\ai-class\tumble-dashboard\public\config.js`)를 열어 `apiBaseUrl`을 그 주소로, `timeoutMs`를 `15000`으로 바꾸고 저장합니다. 다른 줄은 그대로 둡니다.
4. `npm.cmd run gas:deploy`는 다시 하지 않습니다. 배포가 하나 더 생겨 주소가 바뀝니다. 적어 둔 주소가 없으면 `npm.cmd run gas:editor`로 편집기를 열고 위쪽 배포, 배포 관리에서 설명이 `dashboard`인 배포의 웹 앱 URL을 복사합니다.
5. 5회차를 중간까지만 했으면 받은 브랜치의 GAS 코드를 내 프로젝트에 올리고 같은 배포를 갱신합니다. 앱 폴더에서 `npm.cmd run gas:push`, 이어서 `npm.cmd run gas:redeploy`를 칩니다. 주소는 그대로입니다.
6. 옛 폴더에 `.clasp.json`과 웹 앱 주소가 둘 다 없으면(5회차에서 GAS 프로젝트를 만들기 전에 멈췄으면) 1~5번 대신 새 폴더에서 [session-5.md](session-5.md)의 5-1(Apps Script API 켜기), 5-12(clasp 로그인), 5-38~5-43(프로젝트 만들기, 코드 올리기, 첫 권한 승인과 실습 시트, 웹 앱 배포, 응답 확인, 화면 확인)을 차례로 합니다. 받은 브랜치 코드에는 기록 조회가 이미 들어 있어 5-44~5-46은 하지 않습니다.

### 받은 뒤

Antigravity로 새 `tumble-dashboard` 폴더를 열고, 서버 터미널에서 `npm.cmd start`로 화면 서버를 켜 http://127.0.0.1:4173 이 열리는지 확인한 뒤 다음 회차를 시작합니다. 4회차 이후 브랜치는 내 서버도 `backend` 폴더에서 켭니다.
