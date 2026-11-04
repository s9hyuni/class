# 텀블공장 운영 대시보드 (수업용 저장소)

텀블공장 운영 대시보드 수업(6회차)에서 쓰는 저장소입니다. 회차마다 그 회차까지 끝낸 결과물을 브랜치로 나눠 두었습니다. 따라하기 범위는 [따라하기 문서](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/README.md)의 단계 번호입니다. 회차 문서는 GitHub 화면의 `main` 브랜치에서 엽니다.

| 브랜치 | 회차 | 따라하기 범위 | 완료 기준 |
|---|---|---|---|
| `milestone-0` | 출발점 | 강사 제공 파일(로고, 현장 사진 두 장, `API_CONTRACT.md`), `AGENTS.md`, 1회차 보충 문서 | 화면 파일이 아직 없음 |
| `milestone-1` | 1회차 | [session-1.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-1.md) 1-1~1-18 | `http://127.0.0.1:4173`에서 PC 두 열, 375px 한 열, 숫자는 고정값 |
| `milestone-2` | 2회차 | [session-2.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-2.md) 2-1~2-27 | 예시 자료로 화면이 채워지고 다섯 화면 주소가 열림 |
| `milestone-3` | 3회차 | [session-3.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-3.md) 3-1~3-36 | 강사 API 값으로 10초마다 갱신, 실패·과거 시각·조회 기록이 동작 |
| `milestone-4` | 4회차 | [session-4.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-4.md) 4-1~4-30 | 내 NestJS 서버(`http://127.0.0.1:3000`)의 값으로 같은 화면이 "조회 정상" |
| `milestone-5` | 5회차 | [session-5.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-5.md) 5-1~5-31 | 내 GAS 웹 앱 주소로 같은 화면과 기록 조회가 동작 |
| `main` | 6회차 | [session-6.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-6.md) 6-1~6-27 | 완성본. Discord 시험 알림, 기록 더하기·처리, 트리거까지 |

## 회차를 시작할 때

N회차를 시작할 때 쓰는 브랜치는 `milestone-(N-1)`입니다. 1회차는 `milestone-0`, 3회차는 `milestone-2`입니다. 번호를 채운 명령은 회차 문서의 "시작 전에"에 있습니다. 아래는 3회차 예시입니다.

앞 회차를 끝냈으면 내 코드는 그대로 두고 규칙과 보충 문서만 받습니다.

```powershell
cd C:\ai-class\tumble-dashboard
git fetch origin
git checkout origin/milestone-2 -- AGENTS.md docs/guide
```

앞 회차를 못 끝냈으면 켜 둔 서버를 모두 그 창에서 Ctrl+C로 끄고, 그 창들과 AI 도구를 닫습니다. PowerShell을 새로 열어 완료 브랜치를 새 폴더에 받습니다. 내 코드는 `tumble-dashboard-before-session-3` 폴더에 남습니다. 옛 폴더 이름에 시작할 회차 번호를 넣어 다음에 또 받아도 겹치지 않게 합니다.

```powershell
cd C:\ai-class
Rename-Item tumble-dashboard tumble-dashboard-before-session-3
git clone -b milestone-2 https://github.com/startup-life/aiops-dashboard-student.git tumble-dashboard
```

빨간 오류가 나오면 다음으로 가지 말고 강사에게 알립니다.

화면은 Windows에서 `npm.cmd start`(macOS: `npm start`)로 켜고 `http://127.0.0.1:4173`을 엽니다. `milestone-4`부터는 `backend` 폴더에서 `npm.cmd ci`, `npm.cmd run build`, `npm.cmd start`로 서버도 켭니다(macOS는 `npm`).
