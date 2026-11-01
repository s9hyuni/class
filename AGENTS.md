# 프로젝트 규칙

> 이 파일은 Antigravity·Cline 같은 AI 도구가 이 프로젝트에서 대화할 때마다 읽는 약속입니다. 수강생은 직접 고치지 않고, 각 회차 첫 프롬프트가 그 회차 약속을 이 파일 끝에 덧붙입니다.
> 이 브랜치는 2회차까지 끝낸 상태입니다. 코드가 아래 약속과 다르면 코드를 따르세요.

## 일하는 방식
- 병렬·서브 에이전트를 사용하지 말고 현재 에이전트가 순서대로 직접 수행하세요.
- 사용자는 코딩을 처음 배우는 수강생입니다. 설명은 짧고 쉬운 한국어로 하고, 전문 용어는 풀어서 말하세요.
- 한 번에 요청한 일만 하고, 요청하지 않은 파일은 고치지 마세요. 더 나은 방법이나 기능이 떠올라도 더하지 마세요.
- 프롬프트에 따옴표로 적힌 화면 글자는 한 글자도 바꾸지 말고 그대로 쓰세요. 프롬프트 안의 "---- 아래 글 그대로 ----" 줄은 표시일 뿐이니 파일에 넣지 말고 그 아래 글만 그대로 쓰세요.
- 이 파일에 적힌 이름(파일·폴더·주소·키·함수·화면 요소)은 그대로 쓰고, 적히지 않은 이름은 스스로 정하세요. 한 번 만든 이름은 바꾸지 마세요. 프롬프트가 "생산 카드"처럼 화면 이름으로 가리키면 코드에서 찾아 씁니다.
- 이미 있는 코드의 방식을 새 기능에도 그대로 따르세요. 같은 일을 하는 함수가 이미 있으면 새로 만들지 말고 그것을 쓰세요.
- 이미 있는 CSS 규칙을 바꿀 때는 그 규칙을 고치고, 같은 규칙을 파일 끝에 다시 더하지 마세요.
- 일을 마치면 사용자가 화면이나 터미널에서 무엇을 보면 되는지 한 줄로 알려 주세요.
- .env, .clasp.json 파일은 열지 말고 내용을 출력하지 마세요. Google 웹 앱 주소, 배포 ID, Discord 웹훅 주소는 채팅·코드·문서에 옮겨 적지 마세요(웹 앱 주소는 5회차 배포 명령만 public/config.js에 씁니다).
- 터미널 명령은 Windows PowerShell 기준으로 npm.cmd, npx.cmd, curl.exe를 씁니다.
- 서버 켜기·끄기(npm.cmd start), backend 폴더의 설치·빌드, npm.cmd run gas:로 시작하는 명령(Google 로그인·코드 올리기·배포)은 사용자가 직접 합니다. 실행하지 마세요.
- 브라우저를 열어 확인하지 마세요. 화면 확인, Google 로그인과 권한 승인, Apps Script 편집기 작업은 사용자가 직접 합니다.
- 요청에 없는 패키지는 더하지 말고 버전을 바꾸지 마세요. npm audit fix도 실행하지 마세요. 화면은 외부 라이브러리·CDN·웹 글꼴 없이 만듭니다.

## 앱의 기본 약속
- 텀블공장(텀블러 공장)의 생산·출고를 보는 운영 대시보드입니다. 화면 글은 모두 한국어입니다.
- 폴더 배치: 화면 파일은 public 폴더, 화면 서버는 scripts/serve.mjs, 내 서버(NestJS)는 4회차부터 backend 폴더, Google Apps Script 코드는 5회차부터 gas 폴더에 둡니다.
- 화면은 public/index.html 한 페이지와 public/styles.css 한 파일입니다(2회차부터 JavaScript는 public/app.js 한 파일). 없는 주소용 화면은 public/404.html입니다.
- 강사가 준 파일은 이름과 위치를 바꾸지 않습니다: 로고 public/assets/tumble-factory-logo.png, 현장 사진 public/assets/approved/factory.png·warehouse.png, 맨 위 API_CONTRACT.md.
- package.json: name "tumble-dashboard", version "1.0.0", private true, scripts는 "start": "node scripts/serve.mjs" 하나입니다. 설치하는 패키지는 없고 npm init 같은 자동 생성 명령은 쓰지 않습니다.
- 화면 서버는 Node.js 기본 모듈(node:http, node:fs, node:path)만 씁니다. 127.0.0.1에서만 열고, 포트는 환경 변수 PORT, 없으면 4173입니다. 켜지면 "http://127.0.0.1:<실제 포트>" 한 줄을 출력합니다.
- public 폴더는 명령을 실행한 폴더가 아니라 serve.mjs가 있는 폴더 기준(../public)으로 찾습니다. serve.mjs가 있는 폴더는 기본 모듈 셋만 쓰도록 import.meta.dirname으로 구합니다. 주소의 ? 뒤는 무시하고 경로를 decodeURIComponent로 푼 뒤 판단합니다. / 는 index.html입니다.
- Content-Type은 html text/html, css text/css, js text/javascript(셋 다 뒤에 ; charset=utf-8), png image/png, 그 밖은 text/plain; charset=utf-8입니다. 모든 응답에 Cache-Control: no-store를 붙입니다.
- /api/로 시작하는 경로는 파일을 찾지 않고 상태 404, application/json; charset=utf-8로 {"error":"이 서버는 화면 파일만 보냅니다. 화면은 public/config.js의 apiBaseUrl로 API 서버를 직접 부릅니다."}를 보냅니다.
- 없는 파일, 풀 수 없는 경로, public 밖을 가리키는 경로는 상태 404로 404.html 내용(text/html; charset=utf-8)을 보냅니다. 404.html은 CSS를 /styles.css로 연결하고 오늘 운영 링크는 /#/today입니다.
- 화면 주소는 주소 끝 # 부분으로 나눕니다: #/today 오늘 운영(기본), #/records/factory 오늘 생산 기록, #/records/warehouse 오늘 출고 기록, #/queries/factory 생산 데이터 조회 기록, #/queries/warehouse 출고 데이터 조회 기록. 1회차에는 링크만 두고 화면 나누기는 2회차에 합니다.
- index.html은 lang="ko", charset utf-8, viewport width=device-width, initial-scale=1, 빈 아이콘(href="data:,")입니다. 화면 틀(머리 부분, 카드, 제목, 칸)은 index.html에 두고, 2회차부터 JavaScript는 그 요소의 글자·숨김·class·값만 바꿉니다.
- 오늘 운영 영역 순서: 먼저 확인할 일, 생산·출고 카드(공장·창고), 운영 상태(공장·창고·알림 카드 세 장), 기록 처리 상태(공장·창고), 데이터 조회 기록(공장·창고).
- 운영 상태 카드 세 장에서 class meta는 맨 아래 작은 시각 글 하나에만 붙입니다. 카드의 설명 문장에는 붙이지 않습니다.
- 화면 요소 이름(이 이름 그대로 씁니다. 창고 쪽은 factory를 warehouse로 바꾼 같은 이름): 본문 건너뛰기 링크 class skip-link(href "#main"), 로고 홈 링크 class brand, 머리 부분 오른쪽 묶음 class header-actions, 기준 시각 선택 id view-time, 조회 상태 id freshness, 새로고침 버튼 id refresh-btn, 다음 조회 글자 id countdown-text, 알림 버튼 id header-alerts-link와 그 글자 id header-alerts-text, 알림 목록 id notification-dropdown.
- 화면 요소 이름(계속): 본문 묶음 main id main(tabindex="-1", 건너뛰기 링크가 여기로 초점을 옮김), 그 안의 본문 section id page-content, 제목 id page-title, 오늘 운영 영역 id today-view, 먼저 확인할 일 상자 class hero와 제목 id hero-title, 생산·출고 카드 묶음 class "grid kpis", 수량 줄 id factory-quantity, 달성률 글 id factory-progress-text, 진행 막대 progress 요소(max 100) id factory-progress, 목표 초과 글 id factory-exceeded, 사진 figure id factory-photo(사진 대신 글자를 넣는 칸은 class photo-placeholder), 그래프 자리 id factory-graph(안에 class loading-graph 조회 중 글자, class graph-scroll 그래프 칸), 운영 상태 카드 id factory-status·alerts-status, 기록 처리 상태 카드 id factory-flow, 조회 기록 카드 글 id factory-query와 작은 글 id factory-query-meta. 카드는 class card, 작은 회색 글은 class meta, 안내 상자는 class notice, 카드 아래 링크는 class card-link, 배지는 class badge입니다. 수량 줄(id factory-quantity) 안은 실적 글자 요소와 목표 글자 요소를 공백이나 줄바꿈 없이 붙여 쓰고, 간격은 CSS로 줍니다.
- 상태 색은 class 네 개로 나타냅니다: good(초록), warning(노랑), danger(빨강), neutral(회색). 배지, 알림 버튼, 조회 상태 점, 먼저 확인할 일 상자가 같은 이름을 씁니다. 노란 안내 상자는 class "notice warning"입니다.
- 화면 폭: PC는 생산·출고 카드 두 열, 폭 700px 이하는 한 열입니다(휴대폰 확인은 375px). 701~1199px에서는 머리 부분 오른쪽 묶음이 로고 아래 줄로 내려갑니다. 375px에서 페이지 가로 스크롤이 생기지 않습니다.
- 버튼, 카드 아래 링크, 입력 칸은 높이 44px 이상, 키보드 초점은 초록 테두리로 보이게 합니다. 숨길 요소는 hidden 속성으로 숨기고 CSS에 [hidden] { display: none !important; }를 둡니다.
- 움직임 줄이기 설정(prefers-reduced-motion: reduce)에서는 버튼 눌림, 도는 아이콘 같은 움직임을 끕니다.

## 2회차 약속
- 예시 자료는 public/sample-data.js입니다. API_CONTRACT.md 5절 예시 응답을 글자 그대로 window.SAMPLE_SNAPSHOT = { … }; 로, 6절 예시 기록을 window.SAMPLE_RECORDS = { production: […], shipment: […] }; 로 둡니다. 이 파일은 3회차에 지웁니다.
- 화면 JavaScript는 public/app.js 한 파일입니다(모듈·프레임워크 없이). index.html head에서 sample-data.js, app.js 순서로 defer를 붙여 부릅니다.
- 자료의 필드 이름과 값은 API_CONTRACT.md 2·3절을 따릅니다. 화면의 "지금"은 자료의 viewTime이고 브라우저 시계는 쓰지 않습니다.
- 화면 그리기는 자료 하나로 화면 전체를 채우는 함수 하나(render)가 맡습니다. 마지막 자료를 기억해 두고 인자 없이 부르면 그 자료로 다시 그립니다. 공장과 창고는 같은 함수를 함께 씁니다. 버튼이나 주소 바뀜 처리에서는 직접 그리지 말고 render를 부릅니다.
- 안을 통째로 새로 그려도 되는 곳은 기록 처리 상태 카드 안, 그래프 칸 안, 기록 표 자리, 조회 기록 화면, 알림 목록 안뿐입니다. 나머지는 index.html의 요소를 찾아 바꿉니다.
- 시각 글자는 한국 시간 "2026. 10. 26. 09:00:00" 꼴입니다(Intl.DateTimeFormat("ko-KR"), timeZone "Asia/Seoul", year numeric, 나머지 2-digit, hourCycle "h23". hour12는 쓰지 않음). 그래프 아래는 "09시"입니다. 시각이 아니면 "기록 없음"입니다.
- 수량은 0 이상의 안전한 정수(Number.isSafeInteger)만 수로 보고 toLocaleString("ko-KR")로 씁니다. 아니면 "확인 불가"이고 0으로 바꾸지 않습니다. 한 현장 값이 틀려도 다른 현장은 그대로 보입니다.
- 달성률은 실적 ÷ 목표 × 100을 소수 첫째 자리까지 씁니다. 실적·목표가 수가 아니거나 목표가 0이면 달성률 대신 안내를 쓰고 진행 막대와 "목표 초과"를 숨깁니다. 막대 값은 반올림하지 않고 100을 넘지 않습니다.
- 상태 값과 배지(글자, 색): normal 정상 good, warning 확인 필요 warning, error 오류 danger, sent 전송 성공 good, failed 실패 danger, unknown 확인 불가 warning, waiting 대기 warning입니다. 목록에 없는 값은 "확인 필요" warning입니다.
- 늦은 기록: 마지막 발생 시각(lastEventAt)이 없거나 "지금"보다 늦으면 missing, 30분 넘게 지났으면 stale, 그 밖은 fresh입니다. 공장·창고 배지는 missing이면 waiting, stale이면 warning, fresh면 자료의 status입니다. "몇 분 전"은 내림한 분입니다.
- 현장 status가 error면 그 운영 상태 카드에, 알림 status가 failed면 알림 카드에 danger class를 더합니다.
- 서버 처리 시각이 없으면 "기록 대기", 단 processingState가 paused면 "처리 중단"입니다. 기록 상태는 completed 완료, receipt-wait 접수 대기, 그 밖 처리 대기입니다.
- 기록 처리 상태 카드(id factory-flow) 안의 시각 세 줄은 dl 하나에 dt(기록 발생, 서버 접수, 서버 처리)와 dd(시각 글자) 세 쌍으로 둡니다.
- 그래프는 라이브러리 없이 SVG로 그립니다. 한 시간에 막대 하나, 첫 시각부터 시간 차만큼 오른쪽으로 옮기고, 기록이 없는 시간은 빈자리로 둡니다. quantity 0은 높이 0 막대와 수량 "0"입니다. 다시 그릴 때는 SVG만 바꾸고 가로 스크롤 위치를 지킵니다.
- 막대는 막대마다 rect 하나이고 그래프 SVG에 다른 rect를 두지 않습니다. 막대 칸 간격은 90px이고, 그래프 칸에서 좌우 방향키는 한 번에 90px 움직입니다.
- 알림 목록과 먼저 확인할 일은 자료의 incidents로 채웁니다. id "PREDICTION-JOB"은 빼고, 같은 id는 한 번만, level "error"를 앞에 둡니다. 알림 버튼 색은 error 항목이 있으면 danger, 항목이 있으면 warning, 없으면 good입니다. 목록 항목은 class notification-item입니다.
- 먼저 확인할 일의 안내 고르기: scope factory 또는 id FACTORY-FEED는 생산 기록 안내, scope warehouse 또는 id WAREHOUSE-FEED는 출고 기록 안내, id ALERT-DELIVERY는 알림 전송 기록 안내, 그 밖은 안내 없음입니다.
- 화면 나누기: 기본 약속의 다섯 주소 가운데 맞는 영역 하나만 보입니다(오늘 운영 id today-view, 기록 화면 id records-view, 조회 기록 화면 id queries-view). 그 밖 주소는 오늘 운영과 안내 id route-notice를 함께 보입니다. 오늘 운영이 아니면 돌아가기 링크 id back-link를 보입니다. 주소가 바뀌면(hashchange) 다시 그리고 맨 위로 스크롤합니다.
- 기록 화면 요소 이름: 양식 id record-filter, 시작 칸 id record-from, 종료 칸 id record-to, 조회 버튼 id record-submit, 표 자리 id records-result, 표를 감싼 칸 class table-scroll. 기록 표는 머리글 한 줄을 thead에, 기록 줄을 tbody에 둡니다. 시작·종료 칸은 datetime-local(step 1)이고 한국 시간으로 읽습니다(값 뒤에 "+09:00"을 붙여 Date로). 기본값과 범위는 "지금" 날짜의 00:00:00부터 "지금"까지입니다. 시작·종료 칸은 required입니다.
- 도움말 "?"는 class help-wrap 안에 버튼 class help-btn과 설명 class help-popover를 둡니다. 한 번에 하나만 열리고, 설명은 카드나 화면 밖으로 나가지 않습니다.
- 도움말 버튼은 aria-expanded로 열림을 나타냅니다. 클릭해 고정하면 data-pinned "true"이고, 어떤 방법으로 닫히든 "false"로 돌립니다. 알림 버튼도 목록을 열고 닫을 때 aria-expanded를 맞춥니다.
- 화면 이벤트(클릭, 키, 창 크기)는 페이지를 열 때 한 번만 붙이고 그릴 때마다 다시 붙이지 않습니다. Escape는 document의 keydown 하나에서 받아 열린 알림 목록과 도움말을 함께 닫습니다. 바깥을 눌러 닫는 처리와 부딪히지 않게 도움말 버튼의 클릭·키 처리에서 이벤트 전파를 막지 않습니다(stopPropagation을 쓰지 않음).
- 같은 화면을 다시 그릴 때는 표와 막대 줄의 가로 스크롤 위치와 초점을 지키고, 그릴 내용이 지난번과 같으면 표를 다시 만들지 않습니다. 주소가 바뀐 뒤 처음 그릴 때는 지키지 않습니다.
- 검증표는 맨 위 검증표.md입니다(sample-data.js에서 바꿀 값, 기대 화면, 되돌릴 값을 한 줄씩). 시험값 여덟 개: 생산 실적 null, 생산 실적 0, 생산 실적 130(목표 120), 생산 목표 0, 공장 마지막 기록 시각 null, 공장 서버 처리 시각 null과 처리 중단, 알림 상태 실패, 공장 시간별 기록 빈 목록.
