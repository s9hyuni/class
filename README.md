# 텀블공장 운영 대시보드 (수업용 저장소)

텀블공장 운영 대시보드 수업(6회차)에서 쓰는 저장소입니다. 회차마다 그 회차까지 끝낸 결과물을 브랜치로 나눠 두었습니다. 따라하기는 `main` 브랜치 [1회차 문서](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-1.md)의 "시작 전에"부터 시작합니다. 회차 문서는 GitHub 화면의 `main` 브랜치에서 엽니다.

| 브랜치 | 회차 | 따라하기 범위 | 완료 기준 |
|---|---|---|---|
| `milestone-0` | 출발점 | 강사 제공 파일(로고, 현장 사진 두 장, `API_CONTRACT.md`), `AGENTS.md`, 1회차 보충 문서 | 화면 파일이 아직 없음 |
| `milestone-1` | 1회차 | [session-1.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-1.md) 1-1~1-15 | `http://127.0.0.1:4173`에서 PC 두 열, 375px 한 열, 숫자는 고정값 |
| `milestone-2` | 2회차 | [session-2.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-2.md) 2-1~2-18 | 예시 자료로 화면이 채워지고 다섯 화면 주소가 열림 |
| `milestone-3` | 3회차 | [session-3.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-3.md) 3-1~3-26 | 강사 API 값으로 10초마다 갱신, 실패·과거 시각·조회 기록이 동작 |
| `milestone-4` | 4회차 | [session-4.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-4.md) 4-1~4-13 | 내 NestJS 서버(`http://127.0.0.1:3000`)의 값으로 같은 화면이 "조회 정상" |
| `milestone-5` | 5회차 | [session-5.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-5.md) 5-1~5-20 | 내 GAS 웹 앱 주소로 같은 화면과 기록 조회가 동작 |
| `main` | 6회차 | [session-6.md](https://github.com/startup-life/aiops-dashboard-student/blob/main/follow-along/session-6.md) 6-1~6-20 | 완성본. Discord 시험 알림, 기록 더하기·처리, 트리거까지 |

## 회차를 시작할 때

수강생은 이 저장소를 받지 않고 빈 폴더에서 시작합니다. 1회차 1-2가 이 저장소를 `class`라는 원격 저장소로 더하고, 회차마다 첫 번호 "지침 세팅" 프롬프트가 N회차에는 `milestone-(N-1)`의 `AGENTS.md`와 `docs/guide`를 받아 옵니다(1회차는 강사 제공 파일과 `.gitignore`도 함께). N회차 완료 코드는 `milestone-N`(6회차는 `main`)에 있고, AI 도구는 상세 구현을 확인할 때 `git show`로 읽기만 합니다.

완료 브랜치를 직접 켜 볼 때는 Windows에서 `npm.cmd start`(macOS: `npm start`)로 켜고 `http://127.0.0.1:4173`을 엽니다. `milestone-4`부터는 `backend` 폴더에서 `npm.cmd ci`, `npm.cmd run build`, `npm.cmd start`로 서버도 켭니다(macOS는 `npm`).
