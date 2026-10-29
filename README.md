# 텀블공장 운영 대시보드 (수업용 저장소)

텀블공장 운영 대시보드 수업(6회차)에서 쓰는 저장소입니다. 회차마다 그 회차까지 끝낸 결과물을 브랜치로 나눠 두었습니다. 따라하기 범위는 교재의 따라하기 프롬프트 번호입니다.

| 브랜치 | 회차 | 따라하기 범위 | 완료 기준 |
|---|---|---|---|
| `milestone-0` | 출발점 | 강사 제공 파일만(로고, 현장 사진 두 장, `API_CONTRACT.md`) | 화면 파일이 아직 없음 |
| `milestone-1` | 1회차 | part1 1-1~1-12 | `http://127.0.0.1:4173`에서 PC 두 열, 375px 한 열, 숫자는 고정값 |
| `milestone-2` | 2회차 | part1 2-1~3-6 | 예시 자료로 화면이 채워지고 다섯 화면 주소가 열림 |
| `milestone-3` | 3회차 | part1 4-1~5-8 | 강사 API 값으로 10초마다 갱신, 실패·과거 시각·조회 기록이 동작 |
| `milestone-4` | 4회차 | part1 6-1~6-5와 part2 | 내 NestJS 서버(`http://127.0.0.1:3000`)의 값으로 같은 화면이 "조회 정상" |
| `milestone-5` | 5회차 | part3 1~15 | 내 GAS 웹 앱 주소로 같은 화면과 기록 조회가 동작 |
| `main` | 6회차 | part3 16~18 | 완성본. Discord 시험 알림, 기록 더하기·처리, 트리거까지 |

## 회차를 못 끝냈을 때

회차를 못 끝냈으면 그 회차의 브랜치를 받아 다음 회차를 시작합니다. 아래 `milestone-N`의 N에 회차 번호를 넣습니다(예: 3회차를 못 끝냈으면 `milestone-3`).

```bash
git clone <저장소 주소> tumble-dashboard
cd tumble-dashboard
git switch milestone-N
```

화면은 Windows에서 `npm.cmd start`(macOS: `npm start`)로 켜고 `http://127.0.0.1:4173`을 엽니다. `milestone-4`부터는 `backend` 폴더에서 `npm.cmd ci`, `npm.cmd run build`, `npm.cmd start`로 서버도 켭니다(macOS는 `npm`).
