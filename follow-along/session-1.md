# 1회차: 화면 틀 만들기

- 시작 상태: 강사가 준 파일 4개만 있는 폴더 `C:\ai-class\tumble-dashboard`(화면 파일은 아직 없습니다). 수강생 저장소 `milestone-0`과 같은 출발점이고, 그 브랜치에는 저장소 안내용 `README.md`와 `.gitignore`가 더 있습니다.
- 끝나면 되는 것: `npm.cmd start`로 화면 서버(http://127.0.0.1:4173)가 켜지고, 오늘 운영 화면에 다섯 영역(먼저 확인할 일, 생산·출고 카드, 운영 상태, 기록 처리 상태, 데이터 조회 기록)이 차례로 보입니다. PC에서는 생산·출고 카드가 두 열, 폭 375px에서는 한 열입니다.
- 숫자는 아직 고정값입니다(생산 100개 · 목표 120개, 출고 75개 · 목표 100개). 버튼과 화면 이동은 2회차부터 붙입니다.
- 준비물: Windows PC, Chrome, Node.js 22 이상, Git for Windows, Antigravity, 강사가 준 파일 4개(로고 `tumble-factory-logo.png`, 현장 사진 `factory.png`·`warehouse.png`, `API_CONTRACT.md`).

## 시작 전에 (프롬프트 없이 직접 합니다)

1. 탐색기에서 파일 확장명 표시를 켭니다. Windows 10은 보기 메뉴의 '파일 확장명', Windows 11은 보기 메뉴의 '표시'에서 '파일 확장명'입니다.
2. PowerShell을 열고 아래 명령으로 앱 폴더와 사진 폴더를 한 번에 만듭니다. OneDrive가 동기화하는 폴더나 한글이 든 경로는 피합니다.

```powershell
mkdir C:\ai-class\tumble-dashboard\public\assets\approved
```

3. 강사가 준 파일 4개를 아래 위치에 넣습니다. 파일 이름은 바꾸지 않습니다. 로고만 `approved` 밖에 둡니다.
   - 로고: `C:\ai-class\tumble-dashboard\public\assets\tumble-factory-logo.png`
   - 현장 사진: `C:\ai-class\tumble-dashboard\public\assets\approved\factory.png`
   - 현장 사진: `C:\ai-class\tumble-dashboard\public\assets\approved\warehouse.png`
   - API 설명서: `C:\ai-class\tumble-dashboard\API_CONTRACT.md`(폴더 맨 위, 2회차부터 씁니다)
4. Antigravity에서 `C:\ai-class\tumble-dashboard` 폴더를 엽니다.
5. Antigravity 아래쪽에서 터미널을 열고 `node -v`(`v22.`이나 그보다 큰 번호)와 `npm.cmd -v`(버전 숫자)를 칩니다. "인식되지 않습니다"가 나오면 Node.js를 설치하고 Antigravity를 완전히 껐다가 다시 엽니다.

## 진행 방법

- 프롬프트 블록은 하나씩, 첫 줄부터 끝 줄까지 그대로 복사해 Antigravity 대화창에 붙여 넣습니다. Antigravity가 바꾸려는 파일을 보여 주면 훑어보고 승인합니다.
- 1-9에서 Antigravity 아래쪽에 터미널을 하나 더 열어 **서버 터미널**로 씁니다. 서버는 이 창에서 `npm.cmd start`로 켜 두고, 끌 때는 Ctrl+C(Windows에서 "일괄 작업을 끝내시겠습니까 (Y/N)?"가 나오면 `Y`)를 누릅니다.
- 1-10부터는 화면 파일(HTML, CSS)만 바꿉니다. 서버는 켜 둔 채로 Chrome에서 새로고침(F5)만 하면 바뀐 내용이 보입니다.
- 프롬프트에 적힌 글자, `class`·`id` 이름, 숫자는 그대로 들어가야 합니다. 2회차 이후 프롬프트가 이 이름으로 화면을 찾기 때문입니다.
- 결과가 달라 같은 프롬프트를 다시 보낼 때는 끝에 "styles.css에서 이 규칙만 고쳐 주세요. 새 규칙을 파일 끝에 더하지 마세요."를 덧붙입니다. 같은 규칙이 파일 끝에 또 붙으면 휴대폰 화면 규칙(1-42~1-44)이 덮여 375px에서 여백이 커집니다.
- Antigravity가 `icacls`, `Set-ExecutionPolicy`, `npm audit fix`처럼 시스템 설정이나 패키지를 바꾸는 명령의 승인을 요청하면 승인하지 말고 강사에게 알립니다.

## 1-1. 프로젝트 규칙 파일 만들기

```text
이 폴더 맨 위에 AGENTS.md 파일을 만들고 아래 글을 한 글자도 바꾸지 말고 그대로 넣어 주세요.
이 파일은 Antigravity가 이 프로젝트에서 대화할 때마다 읽는 규칙입니다. 다른 파일은 만들지 마세요. 넣을 글은 "# 프로젝트 규칙"부터 끝 줄까지입니다.

# 프로젝트 규칙

- 병렬·서브 에이전트를 사용하지 말고 현재 에이전트가 순서대로 직접 수행하세요.
- 한 번에 요청한 일만 하고, 요청하지 않은 파일은 고치지 마세요.
- 프롬프트에 적힌 화면 글자와 이름(폴더·파일·class·id·주소·포트·설정 키)은 한 글자도 바꾸지 마세요.
- 이미 있는 CSS 규칙을 바꿀 때는 그 규칙을 고치고, 같은 규칙을 파일 끝에 다시 더하지 마세요.
- .env, .clasp.json 파일은 열지 말고, 내용을 화면에 출력하지 마세요.
- 화면 파일은 public 폴더, 화면 서버는 scripts/serve.mjs, 내 서버(NestJS)는 backend 폴더, Google Apps Script 코드는 gas 폴더에 둡니다.
- 터미널 명령은 Windows PowerShell 기준으로 npm.cmd, npx.cmd를 씁니다.
- 서버 켜기(npm.cmd start)는 사용자가 직접 합니다. 실행하지 마세요.
- npm.cmd run gas:로 시작하는 명령(Google 로그인·코드 올리기·배포)은 사용자가 직접 합니다. 실행하지 마세요.
- 패키지는 프롬프트에 적힌 이름과 버전 그대로만 설치하세요. 그 밖의 패키지를 더하거나 버전을 바꾸지 말고, npm audit fix도 실행하지 마세요.
```
- 확인: 왼쪽 파일 목록에 `AGENTS.md`가 생깁니다.
- (선택) 대화창에서 새 대화를 열고 "이 프로젝트의 규칙을 짧게 말해 주세요"라고 물으면 위 규칙이 나옵니다. 앞으로 프롬프트는 이 새 대화에서 이어 보내도 됩니다.

## 1-2. 프로젝트 설정 파일

```text
이 폴더를 텀블공장 대시보드 프로젝트로 만들어 주세요. 설치하는 패키지 없이 Node.js 기본 기능만 씁니다.
package.json 하나만 만듭니다. name은 "tumble-dashboard", version은 "1.0.0", private은 true이고, scripts에는 "start": "node scripts/serve.mjs" 하나만 둡니다.
npm init 같은 자동 생성 명령은 쓰지 마세요.
```
- 확인: 왼쪽 목록에 `package.json`이 생깁니다. `node_modules` 폴더는 생기지 않습니다.

## 1-3. 첫 화면 파일

```text
public/index.html과 빈 public/styles.css를 만들어 주세요. public/assets 폴더와 그 안의 그림은 그대로 둡니다.
index.html은 lang="ko", meta charset utf-8, viewport(width=device-width, initial-scale=1), meta description "텀블러 생산과 출고 기록의 흐름을 확인하는 교육용 운영 대시보드입니다."를 넣습니다.
탭 제목은 "텀블공장 · 오늘 운영", 빈 아이콘(link rel="icon" href="data:,"), ./styles.css 연결입니다. 본문에는 h1 "오늘 운영" 하나만 둡니다.
```
- 확인: `public` 폴더에 `index.html`과 `styles.css`가 생깁니다. 아직 서버가 없어 브라우저로는 보지 않습니다.

## 1-4. 없는 주소 화면

```text
없는 주소를 열었을 때 보일 public/404.html을 만들어 주세요. lang, charset, viewport는 index.html과 같고 탭 제목은 "화면을 찾을 수 없습니다"입니다.
CSS는 /styles.css로 연결합니다(깊은 주소에서도 같은 파일을 찾도록 앞에 /를 붙입니다).
본문은 main 하나에 h1 "요청한 주소의 화면이 없습니다.", p(class="notice") "주소가 맞는지 확인해 주세요.", p(class="notice") 안의 링크 a(href="/#/today") "오늘 운영으로 이동하기"를 차례로 둡니다.
```
- 확인: `public` 폴더에 `404.html`이 생깁니다.

## 1-5. 화면 서버 만들기

```text
scripts/serve.mjs를 만들어 주세요. node:http, node:fs, node:path만 써서 public 폴더의 파일을 http://127.0.0.1 에서 보내는 화면 서버입니다.
포트는 환경 변수 PORT가 있으면 그 값, 없으면 4173입니다. 켜지면 http://127.0.0.1:<실제 포트> 를 한 줄 출력합니다.
public 폴더는 명령을 실행한 폴더가 아니라 serve.mjs가 있는 폴더를 기준으로 찾습니다(import.meta.dirname의 ../public). 주소가 /이면 public/index.html을 보냅니다.
```
- 확인: `scripts` 폴더에 `serve.mjs`가 생깁니다. 서버는 1-9에서 직접 켭니다.

## 1-6. 파일 종류와 캐시

```text
serve.mjs가 보내는 파일의 Content-Type을 정해 주세요. html은 text/html, css는 text/css, js는 text/javascript(셋 다 뒤에 ; charset=utf-8), png는 image/png, 그 밖의 파일은 text/plain; charset=utf-8입니다.
모든 응답에 Cache-Control: no-store를 붙여, 파일을 고친 뒤 새로고침하면 바로 보이게 합니다.
```
- 확인: Antigravity가 `serve.mjs`만 고칩니다.

## 1-7. API 주소는 화면 서버가 받지 않기

```text
serve.mjs에서 주소의 ? 뒤는 무시하고, 경로를 먼저 decodeURIComponent로 푼 다음 아래 검사를 해 주세요.
경로가 /api/로 시작하면 파일을 찾지 않고 상태 404, Content-Type application/json; charset=utf-8로 아래 JSON을 보냅니다. 이 서버는 API 요청을 대신 전달하지 않습니다.
{"error":"이 서버는 화면 파일만 보냅니다. 화면은 public/config.js의 apiBaseUrl로 API 서버를 직접 부릅니다."}
```
- 확인: Antigravity가 `serve.mjs`만 고칩니다. 화면 확인은 1-9에서 합니다.

## 1-8. 없는 주소는 404 화면으로

```text
serve.mjs에서 없는 파일, decodeURIComponent로 풀 수 없는 경로, public 폴더 밖을 가리키는 주소는 상태 404로 답하고 public/404.html의 내용을 보내 주세요.
이때 Content-Type은 text/html; charset=utf-8입니다.
```
- 확인: Antigravity가 `serve.mjs`만 고칩니다. 화면 확인은 1-9에서 합니다.

## 1-9. 화면 서버 켜기 (직접)

프롬프트는 없습니다. Antigravity 아래쪽에서 새 터미널을 하나 더 열어 서버 터미널로 쓰고 아래 명령을 칩니다. 이 창은 수업 내내 켜 둡니다.

```powershell
npm.cmd start
```
- 확인: 서버 터미널에 `http://127.0.0.1:4173`이 한 줄 나옵니다.
- 확인: Chrome에서 http://127.0.0.1:4173 을 열면 "오늘 운영" 제목이 보이고, 탭 이름이 "텀블공장 · 오늘 운영"입니다.
- 확인: http://127.0.0.1:4173/abc 를 열면 "요청한 주소의 화면이 없습니다.", "주소가 맞는지 확인해 주세요.", "오늘 운영으로 이동하기"가 보입니다. 링크를 누르면 "오늘 운영"으로 갑니다.
- 확인: http://127.0.0.1:4173/api/v1/snapshot 을 열면 404 화면이 아니라 `{"error":"이 서버는 화면 파일만 보냅니다. …"}` 글자가 보입니다. 자료는 3회차부터 이 화면 서버가 아니라 API 서버에서 받습니다.
- 서버가 켜지지 않고 빨간 오류가 나오면 그 줄을 Antigravity에 붙여 넣고 "npm.cmd start로 켜면 이 오류가 납니다. 고쳐 주세요"라고 보냅니다. `EADDRINUSE`가 나오면 다른 창에서 서버가 이미 켜져 있는 것이니 그 창을 찾아 Ctrl+C로 끕니다.
- (선택) 포트 바꾸기: 서버를 끄고 `$env:PORT=4180; npm.cmd start`로 켜면 `http://127.0.0.1:4180`이 나옵니다. 확인한 뒤 서버를 끄고 `Remove-Item Env:PORT`를 친 다음 `npm.cmd start`로 다시 켭니다.

## 1-10. 건너뛰기 링크와 머리 부분

```text
public/index.html 본문 맨 앞에 a(class="skip-link", href="#main") "본문으로 이동"을 넣어 주세요.
그 뒤에 header(class="site-header")를 두고, 그 안에 div(class="header-inner"), 그 안에 빈 div(class="header-actions")를 둡니다.
기존 h1 "오늘 운영"은 아직 그대로 둡니다. CSS와 JavaScript는 넣지 마세요.
```
- 확인: 새로고침하면 맨 위에 "본문으로 이동" 링크가 보이고 그 아래 "오늘 운영"이 그대로 있습니다.

## 1-11. 로고 홈 링크

```text
header-inner 안, header-actions 앞에 홈 링크 a(class="brand", href="#/today", aria-label="텀블공장 관제 대시보드 오늘 운영")를 넣어 주세요.
링크 안에는 img(class="brand-logo", src="./assets/tumble-factory-logo.png", alt="")와 span(class="brand-copy")을 둡니다.
brand-copy 안에는 strong "텀블공장"과 span(class="brand-site-name") "관제 대시보드"를 넣습니다.
```
- 확인: 로고와 "텀블공장관제 대시보드"가 보입니다(두 글자 묶음을 붙여 쓰면 이렇게 보이고, 띄어 보여도 괜찮습니다. 1-33의 CSS에서 간격이 생깁니다). 로고가 화면보다 크게 보여도 지금은 괜찮습니다(CSS에서 줄입니다).
- 확인: 로고나 "텀블공장"을 누르면 주소 끝이 `#/today`로 바뀝니다.

## 1-12. 본문 자리

```text
header 뒤에 main(id="main", tabindex="-1")을 두고, 그 안에 section(id="page-content", aria-labelledby="page-title")을 넣어 주세요.
section 안에는 div(class="page-heading")와 빈 div(id="today-view")를 차례로 둡니다.
기존 h1 "오늘 운영"은 page-heading 안으로 옮겨 id="page-title"을 붙이고, 그 뒤에 p(id="page-description") "생산·출고 실적과 운영 상태를 살펴봅니다."를 둡니다.
```
- 확인: 로고 아래에 "오늘 운영"과 "생산·출고 실적과 운영 상태를 살펴봅니다."가 보입니다.

## 1-13. 자바스크립트 안내와 바닥글

```text
main 안 맨 끝(section 뒤)에 noscript를 두고, 그 안에 p(class="notice warning") "화면을 보려면 브라우저에서 자바스크립트를 허용해 주세요."를 넣어 주세요.
main 뒤에는 footer "텀블공장 · 생산·출고 운영"을 둡니다.
```
- 확인: 맨 아래에 "텀블공장 · 생산·출고 운영"이 보입니다. noscript 안내는 보이지 않는 것이 정상입니다.
- 확인: F5로 새로고침하고 아무 데도 누르지 않은 채 Tab 키를 누르면 "본문으로 이동"에 초점이 갑니다. 주소창에 커서가 있으면 Tab을 몇 번 더 누릅니다.

## 1-14. 기준 시각과 조회 상태 자리

```text
header-actions 안에 아래 두 가지를 차례로 넣어 주세요. 동작은 아직 넣지 않습니다.
1. label(class="view-time-control") 안에 글자 "기준 시각"과 select(id="view-time", aria-label="기준 시각"). 선택지는 option(value="") "현재" 하나입니다.
2. span(id="freshness", class="connection-status neutral", role="status") "확인 중".
```
- 확인: "기준 시각 [현재]"와 "확인 중"이 보입니다. 선택 상자를 누르면 "현재"만 있습니다.

## 1-15. 새로고침 버튼 자리

```text
header-actions의 "확인 중" 뒤에 div(class="refresh-wrap")를 넣고, 그 안에 button(id="refresh-btn", type="button", class="refresh-btn", aria-label="데이터 새로고침", title="데이터 새로고침")을 둬 주세요.
버튼 안에는 원을 따라 도는 화살표 두 개 모양의 SVG 아이콘(class="refresh-icon", 20px, viewBox 0 0 24 24, fill none, stroke currentColor, 선 두께 2, aria-hidden="true")을 넣습니다.
버튼 뒤에는 span(id="countdown-text", class="countdown-text", aria-hidden="true") "조회 중…"을 둡니다.
```
- 확인: 새로고침 아이콘 버튼과 "조회 중…"이 보입니다. 버튼에 마우스를 올리면 "데이터 새로고침" 풍선 글이 뜹니다.

## 1-16. 알림 버튼 자리

```text
refresh-wrap 뒤에 div(class="notification-wrap")를 넣고, 그 안에 button(id="header-alerts-link", type="button", class="alerts-link neutral", aria-label="알림 확인 중", aria-expanded="false", aria-controls="notification-dropdown")을 둬 주세요.
버튼 안에는 종 모양 SVG 아이콘(class="bell-icon", 20px, 새로고침 아이콘과 같은 선 설정, aria-hidden="true")과 span(id="header-alerts-text", class="alerts-text") "알림 확인 중"을 넣습니다.
버튼 뒤에는 비어 있고 숨긴 section(id="notification-dropdown", class="notification-dropdown", aria-label="알림 목록", hidden)을 둡니다.
```
- 확인: 종 아이콘과 "알림 확인 중" 버튼이 보입니다. 알림 목록은 보이지 않습니다.

## 1-17. 먼저 확인할 일

```text
today-view 안에 section(id="hero", class="hero neutral")을 넣어 주세요. 안에는 차례로 아래 네 가지를 둡니다.
p(class="eyebrow") 안의 span "먼저 확인할 일", h2(id="hero-title") "우선 확인할 문제가 없습니다.",
숨긴 p(id="hero-owner", class="attention-owner", hidden), p(id="hero-action") "운영 담당자 · 기록 갱신 상태를 계속 확인해 주세요."
```
- 확인: "오늘 운영" 설명 아래에 "먼저 확인할 일", "우선 확인할 문제가 없습니다.", "운영 담당자 · 기록 갱신 상태를 계속 확인해 주세요."가 보입니다.

## 1-18. 공장 생산 카드

```text
hero 아래에 div(class="grid kpis two-columns")를 두고, 그 안에 공장 카드 article(class="card")를 넣어 주세요. 카드 안에는 차례로 아래를 둡니다.
p(class="card-label") 안의 span "공장 생산" / p(id="factory-quantity", class="value quantity-line") 안의 span "생산 100개"와 span(class="quantity-goal") "· 목표 120개"
p(id="factory-progress-text", class="card-description") "계획 대비 83.3%" / progress(id="factory-progress", class="production-progress", max="100", value="83.3")
숨긴 p(id="factory-exceeded", class="meta", hidden) "목표 초과" / a(class="card-link record-button", href="#/records/factory") "생산 기록 보기"
```
- 확인: "공장 생산", "생산 100개 · 목표 120개", "계획 대비 83.3%"와 83.3% 지점까지 찬 진행 막대가 보입니다. "목표 초과"는 보이지 않습니다.
- 확인: "생산 기록 보기"를 누르면 주소 끝이 `#/records/factory`로 바뀝니다(화면은 아직 그대로입니다).

## 1-19. 창고 출고 카드

```text
공장 카드 뒤에 같은 모양의 창고 카드 article(class="card")를 넣어 주세요. id 앞머리 factory를 warehouse로 바꿉니다(warehouse-quantity, warehouse-progress-text, warehouse-progress, warehouse-exceeded).
글자는 "창고 출고", "출고 75개", "· 목표 100개", "계획 대비 75.0%"이고 progress의 value는 75입니다.
링크는 "출고 기록 보기", href="#/records/warehouse"입니다.
```
- 확인: 공장 카드 아래에 "창고 출고", "출고 75개 · 목표 100개", "계획 대비 75.0%"와 75% 지점까지 찬 막대가 보입니다.

## 1-20. 현장 사진

```text
두 카드의 기록 보기 링크 아래에 사진을 넣어 주세요. 사진 파일 이름과 위치는 바꾸지 마세요.
공장: figure(id="factory-photo", class="photo-slot") 안에 img(src="./assets/approved/factory.png", alt="생산 라인 참고 사진")와 figcaption "공장 생산 참고 사진".
창고: figure(id="warehouse-photo", class="photo-slot") 안에 img(src="./assets/approved/warehouse.png", alt="물류창고 참고 사진")와 figcaption "창고 출고 참고 사진".
```
- 확인: 두 카드에 사진과 사진 설명이 보입니다. 깨진 그림 표시가 나오면 `public\assets\approved` 폴더 이름과 사진 파일 이름을 확인합니다.
- 확인: 사진 위에서 오른쪽 클릭, [이미지 주소 복사]로 복사한 주소가 `http://127.0.0.1:4173/assets/approved/factory.png`입니다.

## 1-21. 시간별 그래프 자리

```text
두 사진 아래에 그래프 자리를 넣어 주세요. 공장은 div(id="factory-graph", class="record-graph"), 창고는 div(id="warehouse-graph", class="record-graph")이고, 각각 안에 차례로 아래 네 개를 둡니다.
div(class="loading-graph") "시간별 기록 조회 중" / 숨긴 p(class="meta graph-empty", hidden) "시간별 기록이 없습니다."
비어 있고 숨긴 div(class="graph-scroll", tabindex="0", role="region", aria-label="텀블공장 시간별 수량 그래프. 좌우 방향키로 이동합니다.", hidden). 창고는 aria-label의 "텀블공장"을 "물류창고"로 바꿉니다.
숨긴 p(class="meta graph-caption", hidden) "오늘 시간별 완료 수량 · 좌우로 이동해 확인하세요."
```
- 확인: 두 사진 아래에 "시간별 기록 조회 중"이 보입니다. 나머지 셋은 숨겨져 있습니다.

## 1-22. 운영 상태 영역 틀

```text
today-view 안, 카드 묶음(div.kpis) 바로 뒤에 section(class="section")을 넣고, 안에 h2(class="title-with-help") "운영 상태"와 p(class="section-intro") "공장·창고의 마지막 기록 시각과 서비스별 상시 운영 상태를 확인합니다."를 둬 주세요.
그 아래 div(class="grid status-grid") 안에 article(class="card status-card") 세 개를 둡니다. id와 제목은 factory-status "공장 생산 기록", warehouse-status "창고 출고 기록", alerts-status "알림 전송 기록"입니다.
각 카드 안에는 차례로 div(class="status-line")(안에 h3 제목과 span(class="badge good")), p(class="card-description"), p(class="meta")를 둡니다.
공장 카드에만 맨 뒤에 a(class="card-link", href="#/records/factory") "오늘 생산 기록 보기", 창고 카드에만 a(class="card-link", href="#/records/warehouse") "오늘 출고 기록 보기"를 더합니다.
```
- 확인: "운영 상태" 제목과 안내 문장, 카드 세 장의 제목이 보입니다. 알림 카드에는 링크가 없습니다.

## 1-23. 운영 상태 글자 채우기

```text
운영 상태 카드 세 장의 배지, 설명(card-description), 시각 줄(meta)을 아래 글자로 채워 주세요.
공장: "정상" / "기록이 반영되고 있습니다." / "기준 시각 대비: 15분 전 · 발생 시각: 2026. 10. 26. 12:55:00"
창고: "정상" / "기록이 반영되고 있습니다." / "기준 시각 대비: 12분 전 · 발생 시각: 2026. 10. 26. 12:58:00"
알림: "전송 성공" / "알림 전송이 완료됐습니다." / "마지막 전송 시도: 2026. 10. 26. 12:30:00"
```
- 확인: 세 카드에 배지 글자("정상", "정상", "전송 성공")와 설명, 시각이 보입니다.

## 1-24. 기록 처리 상태 영역

```text
today-view 안, 운영 상태 section 바로 뒤에 section(class="section")을 하나 더 넣고, 안에 h2 "기록 처리 상태"와 p(class="section-intro") "현장 기록의 발생·서버 접수·서버 처리 시각을 확인합니다."를 둬 주세요.
그 아래 div(class="grid two-columns") 안에 article(id="factory-flow", class="card")와 article(id="warehouse-flow", class="card")를 둡니다.
각 카드에는 h3("텀블공장"·"물류창고")와 p(class="meta") "기록 처리 정보 조회 중"만 넣습니다.
```
- 확인: "기록 처리 상태" 아래에 "텀블공장", "물류창고" 카드와 "기록 처리 정보 조회 중"이 보입니다.

## 1-25. 데이터 조회 기록 영역

```text
today-view 안 맨 끝(기록 처리 상태 section 뒤)에 section(class="section")을 하나 더 넣고, 안에 h2 "데이터 조회 기록"과 p(class="section-intro") "이 탭에서 대시보드가 서버에 요청한 기록입니다. 공장·창고는 같은 요청으로 조회합니다."를 둬 주세요.
그 아래 div(class="grid two-columns") 안에 article(class="card") 두 개를 둡니다. 첫 카드는 h3 "공장 조회", p(id="factory-query") "조회 기록 없음", 숨긴 p(id="factory-query-meta", class="meta", hidden), a(class="card-link", href="#/queries/factory") "전체보기"입니다.
둘째 카드는 같은 모양으로 "창고 조회", warehouse-query, warehouse-query-meta, href="#/queries/warehouse"입니다.
```
- 확인: 맨 아래쪽에 "공장 조회"·"창고 조회"가 각각 "조회 기록 없음", "전체보기"와 함께 보입니다.
- 확인: 영역 순서가 먼저 확인할 일, 생산·출고 카드, 운영 상태, 기록 처리 상태, 데이터 조회 기록입니다.

1-26부터 1-45까지는 `public/styles.css`를 차례로 채웁니다. `index.html`은 더 고치지 않습니다.

## 1-26. 색 변수와 바탕

```text
public/styles.css에 기본 규칙을 넣어 주세요. index.html은 바꾸지 마세요.
:root에 color-scheme: light와 색 변수 --ink #222724, --muted #545b57, --line #dce1dd, --surface #f5f6f5, --good #176642, --good-bg #eef7f1, --warn #775407, --warn-bg #fff8df, --danger #ad302b, --danger-bg #fff1ef를 둡니다.
모든 요소는 box-sizing: border-box입니다. body는 margin 0, 흰 배경, 글자색 var(--ink), 글꼴 16px/1.65 system-ui, -apple-system, "Segoe UI", sans-serif입니다.
```
- 확인: 새로고침하면 글꼴이 바뀌고 화면 가장자리 여백이 없어집니다.

## 1-27. 제목과 글자 크기

```text
styles.css에 제목 규칙을 더해 주세요. h1, h2, h3, p의 margin은 0입니다.
h1은 clamp(28px, 4vw, 38px)·줄간격 1.3·자간 -.035em, h2는 23px·줄간격 1.45·자간 -.02em, h3는 20px·줄간격 1.45입니다. h1과 h2는 text-wrap: balance로 줄을 고르게 나눕니다.
p, td, th, a, button, .eyebrow는 글자 크기 16px입니다.
```
- 확인: 제목 크기가 정리되고 문단 사이 간격이 좁아집니다.

## 1-28. 링크, 입력, 숨김, 초점

```text
styles.css에 규칙을 더해 주세요. 링크는 글자색을 물려받고 text-underline-offset 4px입니다. button·input·select는 글꼴과 글자색을 물려받고, button은 손가락 커서, input의 caret-color는 var(--good)입니다.
a와 button은 -webkit-tap-highlight-color: transparent, touch-action: manipulation입니다. ::selection은 배경 #dbe9df, 글자 var(--ink)입니다.
[hidden]은 display: none !important로 확실히 숨깁니다. 키보드 초점(:focus-visible)은 outline 3px solid var(--good), outline-offset 4px입니다.
```
- 확인: 글자를 끌어 선택하면 연한 초록 배경이 됩니다. Tab 키로 이동하면 초록 테두리가 보입니다.

## 1-29. 카드와 먼저 확인할 일 모양

```text
styles.css에 카드 모양을 더해 주세요. .card는 1px solid var(--line) 테두리, padding 24px, 모서리 12px, 흰 배경, min-width 0이고, .card p + p(카드 안에서 p 바로 다음 p)는 위 간격 8px입니다.
.hero는 var(--danger-bg) 배경, #edc7c3 테두리, padding 24px, 모서리 12px, 아래 간격 24px입니다. .hero.neutral은 var(--surface) 배경과 var(--line) 테두리, .hero h2와 .hero p는 위 간격 8px입니다.
.eyebrow와 .card-label은 var(--muted) 글자에 굵기 650이고, .eyebrow는 아래 간격 8px, .attention-owner는 굵기 650입니다.
```
- 확인: 생산·출고와 운영 상태가 둥근 모서리 카드로 보이고, 먼저 확인할 일 영역은 회색 상자입니다. 카드 글자가 테두리에 붙어 있지 않습니다.

## 1-30. 수량 글자 모양

```text
styles.css에 수량 규칙을 더해 주세요. .value는 굵기 750, 줄간격 1.3, 위아래 간격 8px, overflow-wrap: anywhere이고, .kpis .value는 clamp(26px, 3vw, 38px)에 자간 -.03em입니다.
.value, .countdown-text, .time-list dd, table은 font-variant-numeric: tabular-nums로 숫자 폭을 고정합니다.
.quantity-line은 flex(baseline 정렬, 줄바꿈 허용, 간격 4px 12px)이고 그 안의 span(.quantity-line > span)은 최대 너비 100%입니다. .quantity-goal은 20px, 굵기 500, var(--muted), letter-spacing normal입니다.
```
- 확인: "생산 100개"가 크고 굵게, "· 목표 120개"가 옆에 작은 회색 글자로 한 줄에 보입니다.

## 1-31. 설명과 배지 모양

```text
styles.css에 규칙을 더해 주세요. .card-description은 var(--muted)입니다. .meta는 위 간격 16px, 14px이고 선택자는 .meta 하나로 둡니다(카드 안 p 바로 뒤의 p.meta가 .card p + p 때문에 8px이 되는 것이 맞습니다).
.badge는 inline-block, padding 4px 8px, 모서리 4px, 14px, 굵기 650입니다. .badge.good은 var(--good) 글자·var(--good-bg) 배경, .badge.warning은 --warn·--warn-bg, .badge.danger는 --danger·--danger-bg, .badge.neutral은 var(--muted) 글자·#eef0ee 배경입니다.
.card.danger는 #dfaaa5 테두리와 var(--danger-bg) 배경입니다.
```
- 확인: "정상", "정상", "전송 성공"이 같은 모양의 초록 배지로 보입니다.

## 1-32. 버튼 링크와 안내 상자 모양

```text
styles.css에 규칙을 더해 주세요. .card-link는 inline-flex, 세로 가운데, 최소 높이 44px, 굵기 650, 위 간격 16px, 밑줄입니다.
.record-button은 padding 8px 16px, 1px solid var(--ink) 테두리, 모서리 8px, var(--ink) 배경, 흰 글자, 밑줄 없음이고 .record-button:hover는 배경 #3d4941입니다.
button:not(:disabled):not([aria-disabled="true"]):active는 transform: scale(.97)로 누르는 동안 살짝 작아집니다.
.notice는 1px solid var(--line) 테두리, var(--surface) 배경, padding 16px 20px, 모서리 8px, 위 간격 16px이고, .notice.warning은 var(--warn-bg) 배경, #e3d49c 테두리, var(--warn) 글자입니다.
```
- 확인: "생산 기록 보기"와 "출고 기록 보기"가 검은 버튼으로 보이고, 마우스를 올리면 배경이 조금 옅어집니다.
- 확인: http://127.0.0.1:4173/abc 의 두 안내 문장이 회색 테두리 상자로 보입니다.

## 1-33. 머리 부분과 로고 정렬

```text
styles.css에 Flexbox로 머리 부분 규칙을 더해 주세요. .site-header는 position: sticky, top 0, z-index 200, 흰 배경, 아래 1px solid var(--line)입니다.
.header-inner, main, footer는 max-width 1200px, margin-inline auto, 좌우 padding 32px입니다. .header-inner는 flex, 세로 가운데, 양 끝 정렬, 간격 24px, 최소 높이 80px, 위아래 padding 16px입니다.
.brand는 flex, 세로 가운데, 간격 12px, 밑줄 없음, 줄어들지 않음이고 .brand-logo는 44px 정사각형(object-fit contain)입니다.
.brand-copy는 flex(baseline, 간격 8px), .brand strong은 20px(자간 -.02em), .brand-site-name은 14px, 굵기 600, var(--muted), 줄바꿈 없음입니다.
```
- 확인: 로고가 작아지고 "텀블공장 관제 대시보드"가 로고 옆 한 줄에 놓입니다. 아래로 스크롤해도 머리 부분이 위에 붙어 있습니다.

## 1-34. 기준 시각과 조회 상태 모양

```text
styles.css에 머리 부분 오른쪽 규칙을 더해 주세요. .header-actions는 flex, 세로 가운데, 간격 12px, margin-left auto입니다.
.view-time-control은 flex(세로 가운데, 간격 8px, 14px, 줄바꿈 없음)이고 그 안의 select는 16px, 최소 높이 44px, 최대 너비 144px, padding 8px, 1px solid var(--line), 모서리 8px, 흰 배경입니다.
.connection-status는 inline-flex(세로 가운데, 간격 8px, 굵기 600, 14px, 줄바꿈 없음)이고 ::before(content: "")로 8px 원형 점(배경 currentColor)을 붙입니다.
.connection-status.good은 var(--good), .connection-status.danger는 var(--danger), .connection-status.neutral은 var(--muted) 글자색입니다.
```
- 확인: 로고 오른쪽에 "기준 시각 [현재]"와 회색 점이 붙은 "확인 중"이 한 줄로 놓입니다.

## 1-35. 새로고침 버튼 모양

```text
styles.css에 규칙을 더해 주세요. .refresh-wrap은 inline-flex(세로 가운데, 간격 8px)입니다.
.refresh-btn은 44px 정사각형(최소 너비·높이도 44px), padding 0, 1px solid var(--line), 모서리 8px, 흰 배경, 아이콘 가운데(inline-grid, place-items center), transition: background .15s, border-color .15s입니다.
.refresh-icon과 .bell-icon은 20px 정사각형이고 flex-shrink 0입니다. .refresh-btn[aria-disabled="true"]는 opacity .6, 커서 not-allowed입니다.
.countdown-text는 14px, 굵기 650, var(--muted), 줄바꿈 없음, 최소 너비 88px입니다.
```
- 확인: 새로고침 버튼이 테두리 있는 정사각형이 되고, 그 옆에 회색 "조회 중…"이 보입니다.

## 1-36. 알림 버튼 모양

```text
styles.css에 규칙을 더해 주세요. .alerts-link는 inline-flex(세로 가운데, 간격 8px), 최소 높이·너비 44px, padding 8px 14px, 모서리 8px, 1px solid var(--line), 흰 배경, 굵기 650, .refresh-btn과 같은 transition입니다.
.alerts-link.danger는 #dfaaa5 테두리·var(--danger-bg) 배경·var(--danger) 글자, .alerts-link.warning은 #e3d49c·var(--warn-bg)·var(--warn), .alerts-link.neutral은 var(--muted) 글자입니다. .alerts-text는 14px, 굵기 700, 줄바꿈 없음입니다.
마우스가 있는 PC에서만(@media (hover: hover) and (pointer: fine)) .refresh-btn:hover:not([aria-disabled="true"])는 var(--surface) 배경과 var(--ink) 테두리, .alerts-link:hover는 var(--surface) 배경입니다.
```
- 확인: 새로고침 버튼에 마우스를 올리면 회색 배경에 진한 테두리, 알림 버튼에 올리면 회색 배경이 됩니다. 누르면 살짝 작아집니다.

## 1-37. 상태 줄, 건너뛰기 링크, 바닥글 모양

```text
styles.css에 규칙을 더해 주세요. .status-line은 flex, 세로 가운데, 양 끝 정렬, 줄바꿈 허용, 간격 12px, 아래 간격 12px입니다.
.skip-link는 position: fixed, left 16px, top -100px, 흰 배경, padding 12px 20px, z-index 300이고, 초점을 받으면(.skip-link:focus) top 12px로 내려옵니다.
footer는 위 padding 24px, 아래 padding 32px, 위쪽 1px solid var(--line), var(--muted) 글자, 14px입니다.
```
- 확인: 창을 넓게(1440px 정도) 두면 머리 부분이 한 줄입니다. 왼쪽은 로고, 오른쪽은 기준 시각·확인 중·새로고침·조회 중…·알림 확인 중입니다.
- 확인: "본문으로 이동"은 평소에 보이지 않다가, F5로 새로고침하고 아무 데도 누르지 않은 채 Tab 키를 누르면 왼쪽 위에 나타납니다.

## 1-38. 두 열 배치와 영역 간격

```text
styles.css에 Grid 규칙을 더해 주세요. .grid는 display: grid, 간격 24px입니다. .two-columns는 grid-template-columns: repeat(2, minmax(0, 1fr)), .status-grid는 repeat(auto-fit, minmax(280px, 1fr))입니다.
main은 위 padding 24px, 아래 48px, min-height 65vh, scroll-margin-top 110px입니다. .page-heading은 아래 간격 24px이고, 그 안의 p는 var(--muted), 위 간격 8px, 최대 너비 70ch입니다.
.section은 위 간격 48px, .section > h2는 아래 간격 12px, .section-intro는 var(--muted), 아래 간격 24px, 최대 너비 75ch입니다.
```
- 확인: PC에서 생산·출고 카드가 같은 폭으로 나란히 두 열이 되고, 운영 상태 카드 세 장이 한 줄에 놓입니다.

## 1-39. 상태 카드, 진행 막대, 그래프 자리 모양

```text
styles.css에 규칙을 더해 주세요. .status-card는 세로 flex입니다. .status-card .status-line은 아래 간격 8px, 그 안의 h3는 18px입니다. .status-card .meta는 margin-top auto, padding-top 16px로 카드 맨 아래에 놓습니다.
.production-progress는 너비 100%, 높이 12px, accent-color #47594d입니다.
.loading-graph는 최소 높이 190px, 가운데 정렬(display grid, place-items center), var(--muted) 글자, var(--surface) 배경, 모서리 8px입니다.
.graph-scroll은 overflow-x auto, 최대 너비 100%, 위 padding 12px, overscroll-behavior-x: contain입니다.
```
- 확인: 진행 막대가 카드 폭만큼 길어지고, "시간별 기록 조회 중"이 회색 상자 가운데에 보입니다.

## 1-40. 사진 칸 모양

```text
styles.css에 사진 규칙을 더해 주세요. .photo-slot은 margin 24px 0 16px입니다.
.photo-slot img와 .photo-placeholder는 display block, 너비 100%, aspect-ratio 16 / 9, object-fit contain, 모서리 8px, var(--surface) 배경입니다.
.photo-placeholder는 display grid, 가운데 정렬, var(--muted) 글자, 1px dashed var(--line), padding 12px입니다. .photo-slot figcaption은 var(--muted), 14px, 위 간격 8px입니다.
```
- 확인: 사진이 잘리지 않고 16:9 칸 안에 원래 비율로 들어갑니다. 사진 양옆이 회색으로 비어 보이는 것은 정상입니다.

## 1-41. 중간 폭 화면 규칙

```text
styles.css 맨 아래에 화면 폭 규칙을 더해 주세요. PC 화면은 그대로 둡니다.
폭 1199px~701px: .header-inner는 줄바꿈 허용(간격 12px 24px), .header-actions는 한 줄 전체(flex: 1 0 100%)를 쓰고 오른쪽 정렬입니다.
폭 850px~701px: .status-grid는 같은 폭 두 열입니다.
```
- 확인: 창 폭을 1000px 정도로 줄이면 기준 시각·새로고침·알림이 로고 아래 줄로 내려가 오른쪽에 붙습니다.

## 1-42. 휴대폰 폭: 머리 부분

```text
styles.css 맨 아래에 @media (max-width: 700px) 묶음을 하나 만들어 주세요. 1-43, 1-44의 규칙도 이 묶음 안에 넣습니다.
.header-inner, main, footer의 좌우 padding은 16px이고, .header-inner는 display block, 위아래 padding 12px입니다.
.brand는 너비 fit-content, 최소 높이 44px, 간격 8px입니다. .brand-logo는 36px, .brand strong은 18px이고, .brand-copy는 세로(왼쪽 정렬, 간격 0)로 바꿔 "관제 대시보드"가 회사명 아래에 오게 합니다.
```
- 확인: Chrome에서 F12를 누르고 기기 툴바(기기 모양 아이콘)를 켠 뒤 폭을 375로 맞춥니다. 로고 옆에 "텀블공장"과 그 아래 "관제 대시보드"가 두 줄로 보입니다. 기기 툴바는 1-44까지 켜 둡니다.

## 1-43. 휴대폰 폭: 조작 영역

```text
700px 이하 묶음 안에 규칙을 더해 주세요. .header-actions는 줄바꿈 허용, 양 끝 정렬, margin 12px 0 0, 간격 8px입니다.
.view-time-control은 flex: 1 0 calc(100% - 104px)이고 그 select는 최대 너비 180px에 flex: 1입니다. .refresh-wrap은 flex: 1입니다. main의 scroll-margin-top은 200px입니다.
.notification-wrap은 position absolute, top 16px, right 16px입니다. .alerts-link는 44px 정사각형 아이콘 버튼(padding 0, 가운데 정렬)이고 .alerts-text는 숨깁니다.
```
- 확인: 폭 375px에서 머리 부분 오른쪽 위에 종 아이콘만 남고, 기준 시각과 새로고침이 로고 아래 줄로 내려갑니다.

## 1-44. 휴대폰 폭: 카드 한 열

```text
700px 이하 묶음 안에 규칙을 더해 주세요. .two-columns와 .status-grid는 한 열, .grid 간격 16px, .card와 .hero의 padding 16px, .hero h2는 22px입니다.
.section 위 간격은 32px, .section-intro 아래 간격은 16px입니다. 생산·출고 수량 글자(.kpis .value)는 여기서 바꾸지 않습니다.
폭 375px에서 가로 스크롤이 생기지 않아야 합니다.
```
- 확인: 폭 375px에서 카드가 생산, 출고 순서로 한 열이 됩니다. 화면을 좌우로 밀어도 가로로 넘치는 부분이 없고, 사진이 카드 밖으로 나가지 않습니다.
- 확인한 뒤 기기 툴바를 끕니다.

## 1-45. 움직임 줄이기 설정

```text
styles.css 맨 아래에 @media (prefers-reduced-motion: reduce) 규칙을 더해 주세요.
button:not(:disabled):not([aria-disabled="true"]):active는 transform: none으로 눌러도 작아지지 않게 하고, .refresh-btn과 .alerts-link의 transition은 none으로 합니다.
```
- 확인: 평소 PC 화면은 바뀌지 않습니다. Windows의 애니메이션 효과를 끈 PC에서만 버튼이 눌려도 작아지지 않습니다.

## 회차 끝 확인

| 확인할 것 | 기대 결과 |
|---|---|
| 서버 터미널에서 `npm.cmd start` | `http://127.0.0.1:4173` 한 줄이 나옴 |
| Chrome에서 http://127.0.0.1:4173 | 탭 이름 "텀블공장 · 오늘 운영", 영역 순서는 먼저 확인할 일, 생산·출고 카드, 운영 상태, 기록 처리 상태, 데이터 조회 기록 |
| PC 폭 1440px | 머리 부분 한 줄, 생산·출고 카드 두 열, 운영 상태 카드 세 장이 한 줄 |
| 폭 375px(F12 기기 툴바) | 카드 한 열, 가로 넘침 없음, 알림은 종 아이콘만 보임 |
| 숫자 | 생산 100개 · 목표 120개 · 계획 대비 83.3%, 출고 75개 · 목표 100개 · 계획 대비 75.0% |
| 사진과 로고 | 현장 사진 두 장이 잘리지 않음, 머리 부분에 로고, 로고를 누르면 주소 끝이 `#/today` |
| http://127.0.0.1:4173/abc | "요청한 주소의 화면이 없습니다."와 "오늘 운영으로 이동하기" 링크 |
| http://127.0.0.1:4173/api/v1/snapshot | `{"error":"이 서버는 화면 파일만 보냅니다. …"}` |
| 키보드 | F5로 새로고침하고 아무 데도 누르지 않은 채 Tab을 누르면 "본문으로 이동"이 나타나고, 이동할 때 초록 테두리가 보임 |
| 폴더 | `AGENTS.md`, `API_CONTRACT.md`, `package.json`, `scripts\serve.mjs`, `public\index.html`, `public\404.html`, `public\styles.css`, `public\assets\` |

다 끝내지 못했으면 2회차 전에 `milestone-1` 브랜치를 받습니다. 방법은 [README.md](README.md)의 "회차를 다 못 끝냈을 때: 완료 브랜치 받기"에 있습니다. 이 브랜치에는 `AGENTS.md`가 없으므로, 옛 폴더의 `AGENTS.md`를 새 폴더로 복사합니다. 옛 폴더에도 없으면 아래 부록의 내용으로 1-1을 다시 보냅니다.

## 부록: AGENTS.md 최종 내용

1-1에서 만드는 파일의 내용입니다.

```markdown
# 프로젝트 규칙

- 병렬·서브 에이전트를 사용하지 말고 현재 에이전트가 순서대로 직접 수행하세요.
- 한 번에 요청한 일만 하고, 요청하지 않은 파일은 고치지 마세요.
- 프롬프트에 적힌 화면 글자와 이름(폴더·파일·class·id·주소·포트·설정 키)은 한 글자도 바꾸지 마세요.
- 이미 있는 CSS 규칙을 바꿀 때는 그 규칙을 고치고, 같은 규칙을 파일 끝에 다시 더하지 마세요.
- .env, .clasp.json 파일은 열지 말고, 내용을 화면에 출력하지 마세요.
- 화면 파일은 public 폴더, 화면 서버는 scripts/serve.mjs, 내 서버(NestJS)는 backend 폴더, Google Apps Script 코드는 gas 폴더에 둡니다.
- 터미널 명령은 Windows PowerShell 기준으로 npm.cmd, npx.cmd를 씁니다.
- 서버 켜기(npm.cmd start)는 사용자가 직접 합니다. 실행하지 마세요.
- npm.cmd run gas:로 시작하는 명령(Google 로그인·코드 올리기·배포)은 사용자가 직접 합니다. 실행하지 마세요.
- 패키지는 프롬프트에 적힌 이름과 버전 그대로만 설치하세요. 그 밖의 패키지를 더하거나 버전을 바꾸지 말고, npm audit fix도 실행하지 마세요.
```
