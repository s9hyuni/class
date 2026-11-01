# 5회차: 내 구글 시트와 GAS 웹 앱

- 시작 상태: 4회차를 끝낸 `C:\ai-class\tumble-dashboard`에서 이어 합니다. 화면이 내 NestJS 서버(`http://127.0.0.1:3000`)의 값으로 "조회 정상"입니다. 4회차를 다 못 끝냈으면 [README.md](README.md)의 공통 안내대로 `milestone-4` 브랜치를 받습니다.
- 끝나면 되는 것: 내 Google 시트의 기록을 읽는 Google Apps Script(GAS) 웹 앱이 생기고, 화면이 그 웹 앱의 값으로 4회차와 같은 배치로 나옵니다. 생산 기록 보기와 출고 기록 보기도 됩니다. 4회차의 내 서버(`backend`)는 켜지 않아도 되고, 화면 코드는 고치지 않습니다.
- 준비물: 개인 Google 계정으로 로그인한 Chrome, 인터넷. 회사·학교 Google 계정은 관리자 정책으로 Apps Script API나 "로그인 없이 누구나" 웹 앱 배포가 막혀 있을 수 있습니다. 막히면 개인 계정으로 처음부터 합니다.

| 번호 | 하는 일 |
|---|---|
| 5-1 | 5회차 약속 더하기 |
| 5-2 | Apps Script API 켜기 (직접 하기) |
| 5-3 ~ 5-12 | Google 명령(`npm.cmd run gas:…`) 만들기 |
| 5-13 | Google 로그인 (직접 하기) |
| 5-14 ~ 5-38 | Google에서 돌아갈 코드(`gas` 폴더) 만들기 |
| 5-39 ~ 5-44 | 올리기, 권한 승인과 실습 시트, 배포, 화면 확인 (직접 하기) |
| 5-45 ~ 5-47 | 기록 조회를 더하고 다시 배포 |

## 시작 전에 (프롬프트 없이 직접 합니다)

1. Antigravity에서 `C:\ai-class\tumble-dashboard` 폴더를 엽니다.
2. 앱 폴더 맨 위의 `AGENTS.md`를 열어 끝에 "## 4회차 약속" 절이 있는지 봅니다. 보기만 하고 고치지 않습니다.
3. 4회차 서버(`backend`)를 켜 둔 터미널이 있으면 Ctrl+C로 꺼도 됩니다. 이번 회차에는 쓰지 않습니다.
4. Chrome에서 수업에 쓸 개인 Google 계정으로 로그인해 둡니다. 이 회차의 Google 작업은 모두 이 계정 하나로 합니다.

## 진행 방법

- 프롬프트 상자 하나를 통째로 복사해 Antigravity 대화창에 붙여 넣습니다. 앞 번호가 끝난 뒤에 다음 번호를 보냅니다.
- 제목에 (직접 하기)가 붙은 단계와 "직접 하기"에 적힌 일은 Antigravity에 맡기지 않고 내가 합니다. 명령은 Antigravity 아래쪽 터미널에 직접 치고, Google 로그인과 권한 승인도 내가 브라우저에서 합니다.
- 5-14부터 만드는 `gas` 폴더의 코드는 내 컴퓨터가 아니라 Google에서 실행됩니다. 5-40에서 Google에 올리기 전까지는 파일을 열어 `Ctrl+F`로 글자를 찾는 것까지만 확인합니다.
- 화면 서버는 4회차와 같이 내가 직접 `npm.cmd start`로 켜고 http://127.0.0.1:4173 을 엽니다. 이번 회차에는 화면 코드가 바뀌지 않으니 브라우저만 새로고침합니다.
- 꼭 지킬 것: 웹 앱 주소를 아는 사람은 누구나 내 시트의 기록을 읽을 수 있습니다. 배포 주소와 그 주소가 든 `public\config.js`는 다른 사람에게 보내지 않고, 채팅·화면 공유·문서에 옮기지 않습니다. Antigravity 대화창에도 붙여 넣지 않습니다.

## 5-1. 5회차 약속 더하기

이번 회차에 필요한 약속을 규칙 파일 끝에 덧붙입니다. 내용은 이해하지 않아도 됩니다.

```text
AGENTS.md 맨 끝에 아래 글을 한 글자도 바꾸지 말고 덧붙여 주세요. 다른 파일은 고치지 마세요.
"## 5회차 약속" 절이 이미 있으면 아무것도 바꾸지 않습니다.

---- 아래 글 그대로 ----
## 5회차 약속
- 3단계는 Google Apps Script(GAS) 웹 앱이 내 Google 시트를 읽어 1·2단계와 같은 모양으로 답합니다. 화면 코드(public)와 backend는 고치지 않습니다. 웹 앱 주소가 들어간 뒤로는 public/config.js를 열거나 출력하지 않습니다.
- clasp는 늘 npx --yes @google/clasp@3.4.1 로 부릅니다. package.json scripts에 일곱 개를 더합니다(start·check는 그대로): "gas:login": "npx --yes @google/clasp@3.4.1 login", "gas:push": "npx --yes @google/clasp@3.4.1 push --force", "gas:editor": "npx --yes @google/clasp@3.4.1 open-script", "gas:create"·"gas:deploy"·"gas:redeploy"·"gas:open"은 각각 "node scripts/gas-clasp.mjs create"(deploy, redeploy, open)입니다.
- .gitignore에 .clasp.json과 .runtime/ 줄을 둡니다(이미 있으면 그대로).
- scripts/gas-clasp.mjs는 node scripts/gas-clasp.mjs create|deploy|redeploy|open으로 실행하는 Node.js 파일이고, 주석과 빈 줄을 빼고 60줄 안입니다. 다른 이름이면 "사용법: node scripts/gas-clasp.mjs create|deploy|redeploy|open"을 오류로 출력하고 종료 코드 1로 끝냅니다.
- clasp는 "npx " + 인자를 공백으로 이은 한 줄 글자를 spawnSync에 shell: true로 넘겨 부르고(공백이 든 인자는 큰따옴표로 감쌈), 받은 출력을 화면에 그대로 보여 줍니다. 실패는 모두 오류로 출력하고 종료 코드 1로 끝냅니다.
- 로그인 안내 글은 "로그인이 만료됐으면 npm.cmd run gas:login(macOS: npm run gas:login)을 다시 실행하세요."입니다. 웹 앱 주소가 있다는 것은 apiBaseUrl이 https://script.google.com/macros/s/(AKfyc로 시작하는 배포 ID)/exec 꼴이라는 뜻입니다.
- create: .runtime/gas-create를 지우고 빈 폴더로 만든 뒤 clasp create-script --type standalone --title "텀블공장 개인 백엔드" --rootDir .runtime/gas-create 를 실행합니다. 출력에 Created new script가 없으면 "clasp가 프로젝트를 만들지 못했습니다. 위 출력을 확인하고, " + 로그인 안내 글입니다.
- create가 성공하면 .clasp.json의 rootDir만 "gas"로 바꿔 2칸 들여쓴 JSON + 줄바꿈으로 저장하고 ".clasp.json이 gas 폴더를 가리키게 했습니다. 다음: npm.cmd run gas:push(macOS: npm run gas:push)"를 출력합니다.
- deploy: 웹 앱 주소가 이미 있으면 clasp를 부르지 않고 "이미 배포 주소가 있습니다. npm.cmd run gas:redeploy(macOS: npm run gas:redeploy)로 갱신하세요."입니다. 없으면 clasp create-deployment --description dashboard 출력에서 AKfyc로 시작하는 ID(영문·숫자·_·-)를 모아 겹친 것을 빼고 정확히 하나일 때만 성공입니다.
- deploy가 성공하면 public/config.js에서 apiBaseUrl 값을 https://script.google.com/macros/s/(배포 ID)/exec 로, timeoutMs 값을 15000으로 바꾸고 나머지 글자는 그대로 둔 뒤 "public/config.js에 웹 앱 주소와 timeoutMs 15000을 적었습니다. 이 파일에는 내 웹 앱 주소가 들어가니 커밋하거나 남에게 보내지 마세요."를 출력합니다. ID가 하나가 아니면 config.js를 바꾸지 않고 "clasp 출력에서 배포 ID를 찾지 못했습니다. 위 출력을 확인하고, " + 로그인 안내 글입니다.
- redeploy: 웹 앱 주소가 없으면 "public/config.js에 웹 앱 주소가 없습니다. 먼저 npm.cmd run gas:deploy(macOS: npm run gas:deploy)를 실행하세요."입니다. 있으면 clasp update-deployment (배포 ID) --description dashboard 를 실행하고, 출력에 "Redeployed (배포 ID) @"가 있으면 "같은 배포를 새 버전으로 갱신했습니다. 주소는 그대로입니다.", 없으면 deploy의 배포 ID 문장으로 실패합니다.
- open: 웹 앱 주소가 없으면 redeploy와 같은 문장으로 실패합니다. 있으면 "브라우저로 엽니다. JSON이 보이면 웹 앱이 동작합니다."와 주소 + "?path=/api/v1/snapshot"을 출력하고 그 주소를 기본 브라우저로 엽니다(Windows start "", macOS open, 그 밖 xdg-open).
- gas 폴더의 파일은 정확히 다섯 개입니다: appsscript.json, Exercises.gs, Core.gs, Code.gs, Setup.gs. .gs 파일은 Apps Script용 일반 JavaScript(import·export·require·TypeScript 형 표시 없음)이고 파일끼리 전역 이름을 함께 씁니다.
- appsscript.json은 2칸 들여쓰기로 {"timeZone": "Asia/Seoul", "runtimeVersion": "V8", "exceptionLogging": "STACKDRIVER", "oauthScopes": ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/script.external_request", "https://www.googleapis.com/auth/script.scriptapp"], "webapp": {"access": "ANYONE_ANONYMOUS", "executeAs": "USER_DEPLOYING"}}입니다.
- Exercises.gs는 교재와 함께 쓰는 작은 함수 다섯 개입니다(이름 그대로): readRecordRows_(sheet) 첫 행을 뺀 행 배열, sumQuantities_(records) quantity 합(빈 배열 0), groupHourly_(records) occurredAt을 UTC 정시 ISO로 내린 키별 quantity 합 객체, isDelayed_(latest, at, minutes) latest가 있고 at − latest.occurredAt이 minutes분보다 길면 true, alertMessage_(incident) title + " 담당자: " + owner + " / 할 일: " + action. 다른 파일은 같은 계산을 새로 만들지 않고 이 함수를 부릅니다.
- Core.gs는 Google 서비스를 쓰지 않는 계산을 var TumbleCore = (function () { … return { iso, day, view, parse, recordsAt, snapshot }; })(); 하나에 모읍니다.
- iso(value): Date면 toISOString(), 날짜T…(Z 또는 ±hh:mm) 꼴이고 Date.parse로 읽히는 글자면 Z로 끝나는 ISO, 아니면 "시간대를 포함한 시각을 입력해 주세요.". day(value): 한국 날짜 "YYYY-MM-DD". view(at, now): 기준 시각(at, 없으면 now)의 한국 날짜가 now와 다르거나 now보다 늦으면 "오늘의 현재 이전 시각을 선택해 주세요.".
- parse(rows, kind, now)는 시트 행 [기록 ID, 수량, 발생 시각, 접수 시각, 처리 시각, 처리 상태]를 { records, errors }로 바꿉니다. 모두 빈 행은 건너뛰고, 문제 행은 errors에 { row: 순번 + 2, message }를 넣고 다음 행으로 갑니다.
- parse 검사(차례로): ID는 null·undefined면 "", 아니면 String(값)(숫자 0도 "0")이고 /^[A-Za-z0-9_-]{1,100}$/에 맞지 않거나 앞에서 나온 ID면 "고유한 영문·숫자 기록 ID가 필요합니다."(new Set으로 확인), 수량이 숫자나 글자가 아니거나(TRUE·FALSE 포함) 빈칸이거나 1~10000 정수가 아니면 "수량은 1~10000의 정수입니다.", 시각은 iso(접수·처리는 있을 때만, 없으면 null), 발생 ≤ now, 발생 ≤ 접수 ≤ now, 처리가 있으면 접수가 있고 접수 ≤ 처리 ≤ now가 아니면 "발생·접수·처리 시각의 순서를 확인해 주세요.".
- recordsAt(records, kind, at, from, to): kind가 틀리면 "생산 또는 출고를 선택해 주세요.", 시작은 from 또는 at 날짜의 한국 0시(day(at) + "T00:00:00+09:00"), 끝은 to 또는 at입니다. 날짜가 at과 다르거나 시작 > 끝 또는 끝 > at이면 "조회 시간 구간을 확인해 주세요.". 결과는 4회차 records 결과와 같은 규칙(정렬, at 뒤 시각 null, status 세 가지)입니다.
- snapshot(records, settings, meta, alerts, at, now, errors): 기준 시각은 view(at, now)입니다. 현장마다 recordsAt의 마지막 기록(latest), 처리 시각이 있는 기록(completed), 처리 시각이 없는 기록이 있는지(pending), pending이면서 설정 factory_paused(창고 warehouse_paused)가 true인지(paused), isDelayed_(latest, 기준 시각, delay_minutes)(stale)를 구합니다.
- note는 차례로 latest 없음 "기록이 없습니다.", paused "기록 처리가 일시 정지됐습니다.", pending "처리를 기다리는 기록이 있습니다.", stale "새 기록이 늦게 들어오고 있습니다.", 그 밖 "기록이 반영되고 있습니다."입니다. processingState는 paused면 paused, pending이거나 latest가 없으면 waiting, 아니면 completed입니다. status는 latest 없음·pending·stale이면 warning, 아니면 normal입니다.
- sites 값: label "텀블공장"·"물류창고", target은 설정 factory_target·warehouse_target, completed는 completed의 sumQuantities_(없으면 null), 세 시각은 latest 값, history는 groupHourly_(completed)를 시각 순 { timestamp, quantity } 배열로, image는 { url: "./assets/approved/factory.png"(창고 warehouse.png), alt: "공장 생산 참고 사진"(창고 "창고 출고 참고 사진") }입니다. 사진 주소는 화면 서버 기준이라 public의 사진이 보입니다.
- incidents(차례로): warning 현장마다 { id FACTORY-FEED·WAREHOUSE-FEED, scope factory·warehouse, level "warning", title: label + ": " + note, owner "기록 담당자", action "시트의 기록과 처리 상태를 확인해 주세요." }, errors가 있으면 { id "INPUT-ERROR", scope "service", level "warning", title "입력값을 확인할 기록이 있습니다.", owner "기록 담당자", action: 오류마다 sheet + " " + row + "행: " + message를 " / "로 이은 글 }입니다.
- 이어서 alerts({ at, status, message } 목록) 가운데 기준 시각 이전 마지막 항목(last)이 failed면 { id "ALERT-DELIVERY", scope "service", level "error", title "알림 전송에 실패했습니다.", owner "서비스 담당자", action "알림 기록과 웹훅 설정을 확인해 주세요." }를 넣습니다.
- snapshot이 돌려주는 값: schemaVersion 1, scenarioId "normal", revision·changedAt(meta), serverTime iso(now), viewTime(기준 시각), mode(at이 있으면 "past", 아니면 "current"), sessionId(meta), trainingOnly true, sites, services { api: { status "normal", note "시트 조회가 가능합니다." }, alerts: { status: last.status 또는 "unknown", lastAttemptAt: last.at 또는 null, note: last.message 또는 "알림 발송 기록이 없습니다." } }, incidents.
- 실습 시트 탭은 "생산 기록", "출고 기록", "설정", "알림 기록"입니다(var TUMBLE_SHEETS = { production, shipment, settings, alerts }). 기록 탭 첫 행은 TUMBLE_HEADERS = ["기록 ID", "수량", "발생 시각", "접수 시각", "처리 시각", "처리 상태"], 알림 기록 탭 첫 행은 ["시각", "사건 ID", "내용", "발송 상태", "상세"]입니다.
- 설정 탭은 첫 행 ["설정 이름", "값"] 아래 factory_target 120, warehouse_target 100, delay_minutes 30, cooldown_minutes 10, factory_paused false, warehouse_paused false입니다. 설정 이름은 밑줄 이름 그대로 씁니다.
- 스크립트 속성: SPREADSHEET_ID(실습 시트 ID), TUMBLE_META(세션 정보(초기 자료)인 { sessionId, revision, changedAt }의 JSON 글자). 6회차에 DISCORD_WEBHOOK_URL과 ALERT_로 시작하는 속성이 더해집니다.
- 시트에 쓸 때 숫자·=·+·-·@로 시작하는 글자는 앞에 '를 붙여 글자 그대로 남깁니다(toCell_, 행은 toRow_). 읽을 때는 Date면 ISO로 바꾸고, toCell_이 붙인 '만 뗍니다(' 뒤가 숫자·=·+·-·@일 때, fromCell_). 시각 칸은 늘 Z로 끝나는 ISO 글자입니다.
- 기록 행의 A칸 메모는 접수한 원본(그 행 여섯 칸의 JSON 배열)입니다. 읽을 때 메모가 없는 행은 아직 접수 전이라 접수·처리 시각을 비우고, 메모가 있는 행은 원본을 씁니다. 앞 여섯 칸이 원본과 하나라도 다르면 errors에 "접수한 기록의 수정은 반영하지 않습니다. 새 실습 시트를 만들어 주세요."를 넣습니다(G열부터는 보지 않음).
- 설정은 설정 탭이 아니라 설정 탭 A1 메모의 설정 이력 [{ at, revision, settings }]에서 기준 시각 이전 마지막 항목을 씁니다. 없으면 "이 시점의 설정 자료가 없습니다.". meta의 revision·changedAt은 그 항목의 revision·at입니다.
- readData_(at, kinds)(kinds가 없으면 생산·출고 둘 다)는 { now, at, records, errors, settings, meta }를 돌려줍니다: now는 지금 ISO 시각, at은 기준 시각(view(at, now)), records·errors는 기록 탭을 parse한 결과(errors 항목은 { sheet, row, message }), settings·meta는 위 설정 이력 항목에서 고른 값(meta의 sessionId는 TUMBLE_META 값)입니다.
- alerts_()는 알림 기록 탭에서 첫 칸(시각)이 있는 행만 읽어 { at: 시각(iso), status: 발송 상태, message: 내용 } 목록으로 돌려줍니다.
- Code.gs의 공통 이름(다른 파일이 부름): TUMBLE_SHEETS, TUMBLE_HEADERS, properties_(), spreadsheet_()(SPREADSHEET_ID가 없으면 "먼저 createTrainingSpreadsheet를 실행해 주세요."), toCell_, toRow_, fromCell_, rows_(탭 이름), settings_(), meta_()(없으면 "초기 자료가 없습니다."), json_(값), readData_(at, kinds), alerts_().
- settings_()는 설정 탭의 행(설정 이름, 값)을 읽어 { 설정 이름: 값 } 객체로 만듭니다(A1 메모의 설정 이력이 아님). 검사를 통과한 값은 목표는 수(빈칸은 null), 분은 수, 처리 정지는 true·false로 바꿉니다. 검사 문장: 목표가 빈칸도 1 이상 정수도 아니면 "목표는 양의 정수 또는 빈칸입니다.", delay_minutes·cooldown_minutes가 1~1440 밖이면 "대기 기준은 1~1440분입니다.", 처리 정지가 true·false·"TRUE"·"FALSE" 밖이면 "처리 정지는 TRUE 또는 FALSE입니다.".
- 웹 앱 입구 doGet(e): path 매개변수의 앞뒤 /를 모두 떼고, "api/v1/snapshot"이면 snapshot(입력 오류는 at이 없을 때만 넘김), "api/v1/records"면 kind(아니면 "생산 또는 출고 기록을 선택해 주세요.")·at·from·to로 { sessionId, viewTime, records }를 돌려줍니다. 그 밖은 "웹 앱 주소 뒤에 ?path=/api/v1/snapshot 또는 ?path=/api/v1/records를 붙여 주세요.".
- 웹 앱 응답은 { ok, data } 같은 봉투 없이 JSON 그대로입니다(ContentService, MimeType.JSON). 웹 앱은 상태 코드를 정할 수 없으므로 모든 오류를 잡아 { error: 문장 }으로 답합니다.
- Setup.gs의 createTrainingSpreadsheet(편집기에서 실행): 실행할 때마다 새 시트 "텀블공장 개인 실습 " + 지금 ISO 시각을 만들고(이전 시트는 그대로), 시간대 Asia/Seoul, 네 탭, SPREADSHEET_ID 저장, 모든 탭 첫 행 고정과 열 폭 자동 맞춤(autoResizeColumns), 로그 "새 실습 시트: " + 시트 주소를 남기고 시트 주소를 돌려줍니다.
- 시드 기록은 탭마다 5행(i = 0~4)입니다: ID "P-seed-" + i(출고 "S-seed-" + i), 수량 20(출고 15), 발생은 오늘 한국 0시와 지금 사이를 다섯으로 나눈 (i+1)번째 시각, 접수는 발생 + gap, 처리는 발생 + gap × 2(지금보다 늦지 않게), gap = min(2초, (지금 − 발생) ÷ 2), 처리 상태 "완료", A칸 메모에 원본입니다.
- 설정 탭 A1 메모에는 [{ at: 오늘 한국 0시, revision: 1, settings: 여섯 값 }], TUMBLE_META에는 { sessionId: Utilities.getUuid(), revision: 1, changedAt: 지금 }을 저장합니다.
- Google 쪽 코드를 고치면 사용자가 gas:push 뒤 gas:redeploy를 합니다(웹 앱은 배포한 때의 코드로 답합니다). gas:deploy는 처음 한 번만 합니다.
```

- 확인: `AGENTS.md` 맨 끝에 "## 5회차 약속" 절이 보이고, 그 앞의 "## 4회차 약속" 절은 그대로입니다.

## 5-2. Apps Script API 켜기 (직접 하기)

1. Chrome에서 개인 Google 계정으로 https://script.google.com/home/usersettings 를 엽니다.
2. "Google Apps Script API"를 사용(켜짐)으로 바꿉니다.

- 확인: 설정이 "사용"으로 보입니다.
- 이 설정이 꺼져 있으면 뒤의 Google 명령이 `User has not enabled the Apps Script API`로 실패합니다. 그 문구가 나오면 이 단계를 다시 하고 1~2분 뒤 같은 명령을 다시 칩니다.

## 5-3. Google 명령 파일의 틀

```text
5회차 약속에 적힌 Google 명령 파일을 틀만 만들어 주세요. 네 명령의 내용은 다음 단계부터 하나씩 채웁니다.
네 명령 이름이 아닌 것으로 실행하면 약속한 사용법 문장을 보여 주고 끝나게 해 주세요.
```

- 직접 하기: 터미널에서 `node scripts\gas-clasp.mjs`를 칩니다.
- 확인: `사용법: node scripts/gas-clasp.mjs create|deploy|redeploy|open`이 나오고 끝납니다.

## 5-4. clasp를 부르는 부분

```text
Google 명령 파일에 clasp를 부르는 부분을 5회차 약속대로 더해 주세요.
Windows에서도 되게 하고, clasp가 낸 출력은 화면에 그대로 보여 줍니다. 아무것도 실행하지 마세요.
```

- 확인: Antigravity가 더했다고 알려 줍니다. 아직 아무것도 실행하지 않습니다.

## 5-5. npm 명령 일곱 개

```text
5회차 약속에 적힌 npm 명령 일곱 개를 더하고, Git에 올리지 않을 목록도 약속대로 맞춰 주세요.
지금 있는 명령은 그대로 두고, 만들기만 하고 실행하지 마세요.
```

- 직접 하기: 터미널에서 `npm.cmd run`을 칩니다.
- 확인: 목록에 `gas:login`, `gas:create`, `gas:push`, `gas:deploy`, `gas:redeploy`, `gas:open`, `gas:editor` 일곱 개가 보이고, `start`와 `check`도 그대로 있습니다.

## 5-6. 프로젝트 만들기 명령 1

```text
Google 프로젝트를 만드는 명령이 할 일을 5회차 약속대로 채워 주세요.
이번에는 빈 폴더에 Google 프로젝트를 만들고, 실패하면 약속한 안내로 끝나는 데까지만 합니다.
```

- 확인: Antigravity가 채웠다고 알려 줍니다. 실행은 5-39에서 합니다.

## 5-7. 프로젝트 만들기 명령 2

```text
그 명령이 성공한 뒤에 할 일을 5회차 약속대로 더해 주세요. 만든 프로젝트가 Google 쪽 코드 폴더를 가리키게 하는 일입니다.
```

- 확인: Antigravity가 더했다고 알려 줍니다.

## 5-8. 배포 명령 1: 성공했을 때

```text
배포 명령을 5회차 약속대로 채워 주세요.
이번에는 배포 ID를 하나 찾았을 때 연결 설정에 웹 앱 주소와 기다리는 시간을 적는 데까지만 합니다.
```

- 확인: Antigravity가 채웠다고 알려 줍니다. `public\config.js`는 아직 그대로(`timeoutMs: 5000`)입니다.

## 5-9. 배포 명령 2: 하지 않고 끝날 때

```text
배포 명령이 약속대로 하지 않고 끝나는 두 경우(웹 앱 주소가 이미 있을 때, 배포 ID를 못 찾았을 때)를 더해 주세요.
웹 앱 주소가 있는지 보는 검사는 다른 명령도 함께 쓰도록 하나로 만듭니다.
```

- 확인: Antigravity가 더했다고 알려 줍니다.

## 5-10. 다시 배포 명령

```text
다시 배포 명령을 5회차 약속대로 채워 주세요. 새 배포를 만들지 않고 같은 주소를 새 버전으로 바꾸는 명령입니다.
```

- 직접 하기: 터미널에서 `npm.cmd run gas:redeploy`를 칩니다.
- 확인: `public/config.js에 웹 앱 주소가 없습니다. …`가 나오고 끝납니다. 아직 배포하지 않았으니 정상입니다(npm이 종료 코드 1을 알리는 줄이 더 나와도 괜찮습니다).

## 5-11. 웹 앱 열기 명령

```text
웹 앱 열기 명령을 5회차 약속대로 채워 주세요. 웹 앱 주소를 기본 브라우저로 여는 명령입니다.
```

- 직접 하기: 터미널에서 `npm.cmd run gas:open`을 칩니다.
- 확인: `public/config.js에 웹 앱 주소가 없습니다. …`가 나오고 끝납니다.

## 5-12. Google 명령 파일 점검

```text
Google 명령 파일을 읽고, 주석과 빈 줄을 뺀 줄 수와 네 명령이 5회차 약속대로 다 들어 있는지 알려 주세요.
60줄이 넘으면 동작을 바꾸지 말고 주석과 빈 줄을 뺀 60줄 안으로 줄이고, 넘지 않으면 파일을 고치지 마세요.
```

- 확인: 줄 수가 60줄 이하이고, 네 명령이 모두 있다고 나옵니다.
- 확인: `public\config.js`는 아직 4회차 그대로(`http://127.0.0.1:3000`, `timeoutMs: 5000`)입니다.

## 5-13. Google 로그인 (직접 하기)

1. 터미널에서 `npm.cmd run gas:login`을 칩니다. 처음에는 clasp를 내려받느라 시간이 조금 걸립니다.
2. 기본 브라우저가 열리면 5-2와 같은 개인 Google 계정을 고르고 허용합니다. "확인하지 않은 앱" 경고가 나오면 clasp가 맞는지 보고 계속 진행합니다. 브라우저가 열리지 않으면 터미널에 나온 주소를 직접 엽니다.
3. 끝났다는 글이 나온 브라우저 탭은 닫습니다.

- 확인: 터미널에 로그인됐다는 문구가 나오고 명령이 끝납니다.
- 어느 계정으로 로그인됐는지는 5-41에서 편집기 오른쪽 위로 확인합니다.

## 5-14. 웹 앱 설정 파일

이제 Google에서 돌아갈 코드를 `gas` 폴더에 씁니다. 파일 다섯 개를 여러 번에 나눠 만듭니다.

```text
5회차 약속대로 Google 쪽 코드 폴더를 만들고, 웹 앱 설정 파일을 약속에 적힌 내용 그대로 넣어 주세요.
```

- 확인: 왼쪽 파일 목록에 `gas\appsscript.json`이 생기고, 안에 `ANYONE_ANONYMOUS`와 `USER_DEPLOYING`이 있습니다. 이 두 값이 다르면 화면이 로그인 없이 웹 앱을 부르지 못합니다.
- 권한 세 가지(시트, 외부 서비스 연결, 트리거)를 지금 적어 두면 5-41에서 한 번에 승인합니다. 뒤의 두 권한은 6회차에 씁니다.

## 5-15. 작은 함수 1: 행 읽기와 합계

```text
5회차 약속의 교재와 함께 쓰는 작은 함수 파일을 만들어 주세요.
다섯 함수 가운데 이번에는 첫 행을 뺀 행 읽기와 수량 합계 두 개만 넣습니다.
```

- 확인: 왼쪽 파일 목록에 `gas\Exercises.gs`가 생깁니다.

## 5-16. 작은 함수 2: 시간별 합, 늦음 판단, 알림 문장

```text
작은 함수 파일에 나머지 세 함수(시간별 합, 늦음 판단, 알림 문장)를 5회차 약속대로 더해 주세요. 앞의 두 함수는 고치지 마세요.
```

- 확인: `gas\Exercises.gs`에 함수 다섯 개(`readRecordRows_`, `sumQuantities_`, `groupHourly_`, `isDelayed_`, `alertMessage_`)가 있습니다.
- 확인: `Ctrl+F`로 `import`, `require`를 찾으면 없습니다.

## 5-17. 계산 모음 1: 시각 바꾸기와 한국 날짜

```text
5회차 약속대로 Google 서비스를 쓰지 않는 계산 모음 파일을 만들어 주세요.
이번에는 시각을 바꾸는 일과 한국 날짜를 구하는 일 두 가지만 넣습니다.
```

- 확인: 왼쪽 파일 목록에 `gas\Core.gs`가 생기고, `Ctrl+F`로 "시간대를 포함한 시각을 입력해 주세요."를 찾으면 보입니다.

## 5-18. 계산 모음 2: 기준 시각

```text
계산 모음에 기준 시각을 정하고 검사하는 일을 5회차 약속대로 더해 주세요. 다른 일은 고치지 마세요.
```

- 확인: `gas\Core.gs`에서 "오늘의 현재 이전 시각을 선택해 주세요."를 찾으면 보입니다.

## 5-19. 계산 모음 3: 시트 행 읽기와 기록 ID

```text
계산 모음에 시트 행을 기록과 오류 목록으로 바꾸는 일을 5회차 약속대로 더해 주세요.
이번에는 빈 행 건너뛰기와 기록 ID 검사까지만 하고, 나머지 칸 검사는 다음 단계에서 더합니다.
```

- 확인: `gas\Core.gs`에서 "고유한 영문·숫자 기록 ID가 필요합니다."를 찾으면 보입니다.

## 5-20. 계산 모음 4: 수량과 시각 검사

```text
시트 행 바꾸기에서 기록 ID 다음에 수량 검사와 세 시각 검사를 5회차 약속의 차례대로 더해 주세요.
```

- 확인: `gas\Core.gs`에서 "수량은 1~10000의 정수입니다."와 "발생·접수·처리 시각의 순서를 확인해 주세요."를 찾으면 둘 다 보입니다.

## 5-21. 계산 모음 5: 기록 고르기 구간

```text
계산 모음에 기준 시각까지의 기록을 고르는 일을 5회차 약속대로 더해 주세요.
이번에는 생산·출고 확인과 고를 시간 구간 검사까지만 합니다.
```

- 확인: `gas\Core.gs`에서 "조회 시간 구간을 확인해 주세요."와 `T00:00:00+09:00`을 찾으면 보입니다. 하루의 시작을 한국 시각 0시로 잡는 곳입니다.

## 5-22. 계산 모음 6: 기록 고르기 결과

```text
기록 고르기가 구간 안의 기록을 5회차 약속대로 정렬하고, 기준 시각보다 늦은 시각은 비우고, 상태를 붙여 돌려주게 해 주세요.
```

- 확인: `gas\Core.gs`에서 `processing-wait`와 `receipt-wait`를 찾으면 보입니다.

## 5-23. 오늘 운영 계산 1: 현장별 재료

다음 다섯 단계는 오늘 운영 화면이 받는 자료를 만듭니다. 1~4회차 화면이 받던 것과 같은 모양입니다.

```text
계산 모음에 오늘 운영 자료를 만드는 일을 5회차 약속대로 더해 주세요.
이번에는 공장, 창고 차례로 현장마다 계산 재료(마지막 기록, 처리된 기록, 처리 대기, 처리 정지, 늦음)만 구합니다.
```

- 확인: Antigravity가 더했다고 알려 줍니다. 작은 함수 파일의 함수를 불러 쓴다고 말하면 맞습니다.

## 5-24. 오늘 운영 계산 2: 안내 문구와 수량

```text
오늘 운영 자료에 현장 안내 문구와, 현장 이름·목표·완료 수량·마지막 기록의 세 시각을 5회차 약속대로 넣어 주세요.
```

- 확인: `gas\Core.gs`에서 "기록 처리가 일시 정지됐습니다."와 "새 기록이 늦게 들어오고 있습니다."를 찾으면 보입니다.

## 5-25. 오늘 운영 계산 3: 상태, 그래프, 사진

```text
오늘 운영 자료의 현장마다 처리 상태, 현장 상태, 시간별 그래프 자료, 사진을 5회차 약속대로 넣어 주세요.
```

- 확인: `gas\Core.gs`에서 `./assets/approved/`와 "공장 생산 참고 사진"을 찾으면 보입니다.

## 5-26. 오늘 운영 계산 4: 먼저 확인할 일

```text
오늘 운영 자료에 먼저 확인할 일 목록을 5회차 약속의 차례대로 채워 주세요.
```

- 확인: `gas\Core.gs`에서 "시트의 기록과 처리 상태를 확인해 주세요."와 "알림 전송에 실패했습니다."를 찾으면 보입니다.

## 5-27. 오늘 운영 계산 5: 돌려주는 모양

```text
오늘 운영 자료가 돌려주는 모양을 5회차 약속대로 마무리해 주세요.
```

- 확인: `gas\Core.gs`에서 "시트 조회가 가능합니다."와 "알림 발송 기록이 없습니다."를 찾으면 보입니다.
- 확인: 파일 맨 아래에서 돌려주는 이름이 여섯 개(`iso`, `day`, `view`, `parse`, `recordsAt`, `snapshot`)입니다.

## 5-28. 시트 도구 1: 이름표와 시트 열기

```text
5회차 약속대로 시트 공통 도구 파일을 만들고, 탭 이름표와 머리글, 스크립트 속성 읽기, 실습 시트 열기를 넣어 주세요.
웹 앱 입구는 나중에 만드니 지금은 만들지 않습니다.
```

- 확인: 왼쪽 파일 목록에 `gas\Code.gs`가 생기고, "먼저 createTrainingSpreadsheet를 실행해 주세요."를 찾으면 보입니다.

## 5-29. 시트 도구 2: 칸 값 바꾸기와 탭 읽기

```text
시트 공통 도구에 칸 값을 글자 그대로 쓰고 읽는 도구와, 이름으로 탭을 읽는 도구를 5회차 약속대로 더해 주세요.
```

- 확인: `gas\Code.gs`에 숫자뿐 아니라 `=`, `+`, `-`, `@`로 시작하는 글자에도 `'`를 붙이는 부분이 있습니다. 이 글자로 시작하는 값은 시트가 숫자·날짜·수식으로 바꾸기 때문입니다.

## 5-30. 시트 도구 3: 설정과 세션 정보 읽기

```text
시트 공통 도구에 설정 탭에 지금 적힌 값을 읽어 검사하는 도구와, 스크립트 속성의 세션 정보(초기 자료)를 읽는 도구를 5회차 약속대로 더해 주세요.
설정 탭 읽기는 6회차에 쓰니 지금은 다른 곳에서 부르지 않습니다.
```

- 확인: `gas\Code.gs`에서 "목표는 양의 정수 또는 빈칸입니다."를 찾으면 보이고, 설정 이름이 `factory_target`, `delay_minutes`처럼 밑줄 이름입니다.

## 5-31. 실습 시트 만들기 1: 파일과 탭

```text
5회차 약속대로 실습 시트 만들기 파일과 함수를 만들어 주세요.
이번에는 새 시트 파일, 시간대, 네 탭, 시트 ID 저장까지만 합니다.
```

- 확인: 왼쪽 파일 목록에 `gas\Setup.gs`가 생기고, `Asia/Seoul`을 찾으면 보입니다.

## 5-32. 실습 시트 만들기 2: 시드 기록

```text
실습 시트 만들기에 생산·출고 시드 기록 5행씩을 5회차 약속대로 더해 주세요.
각 행의 A칸 메모에는 그 행의 원본을 남깁니다.
```

- 확인: `gas\Setup.gs`에서 `P-seed-`와 `S-seed-`를 찾으면 보입니다.

## 5-33. 실습 시트 만들기 3: 설정과 마무리

```text
실습 시트 만들기를 5회차 약속대로 마무리해 주세요. 설정 탭 값과 그 A1 메모, 알림 기록 탭 첫 행, 모든 탭 첫 행 고정을 넣습니다.
세션 정보를 스크립트 속성에 저장하고, 로그에 시트 주소를 남긴 뒤 그 주소를 돌려줍니다.
```

- 확인: `gas\Setup.gs`에서 "새 실습 시트: "를 찾으면 보이고, `setNote`가 두 곳(시드 행 A칸, 설정 탭 A1)에 있습니다.

## 5-34. 웹 앱 1: 응답 도구와 알림 기록 읽기

```text
시트 공통 도구에 웹 앱 응답 도구와 알림 기록 탭 읽기를 5회차 약속대로 더해 주세요. 지금 있는 도구는 고치지 마세요.
```

- 확인: `gas\Code.gs`에 `ContentService`가 있고, 응답을 `ok`나 `data`로 감싸는 코드가 없습니다.

## 5-35. 웹 앱 2: 기록 탭 읽기

```text
시트 공통 도구에 기록 탭 읽기를 5회차 약속대로 더해 주세요.
이번에는 행마다 A칸 메모를 보고 쓸 여섯 칸을 고르고, 접수 뒤 고친 행을 오류로 모으는 데까지만 합니다.
```

- 확인: `gas\Code.gs`에서 "접수한 기록의 수정은 반영하지 않습니다. 새 실습 시트를 만들어 주세요."를 찾으면 보입니다.

## 5-36. 웹 앱 3: 기록과 설정 이력 고르기

```text
기록 탭 읽기를 5회차 약속대로 마무리해 주세요. 고른 행을 계산 모음으로 기록과 오류로 바꾸고, 설정 이력에서 기준 시각의 설정을 고릅니다.
```

- 확인: `gas\Code.gs`에서 "이 시점의 설정 자료가 없습니다."를 찾으면 보입니다.

## 5-37. 웹 앱 4: 웹 앱 입구

```text
시트 공통 도구에 웹 앱 입구를 5회차 약속대로 만들어 주세요.
이번에는 오늘 운영 자료 길만 만들고, 기록 조회 길은 나중에 더하니 만들지 않습니다. 그 밖의 길에 답하는 안내 문장은 약속 그대로 둡니다.
```

- 확인: `gas\Code.gs`에 `doGet`이 있고, "웹 앱 주소 뒤에 ?path=/api/v1/snapshot 또는 ?path=/api/v1/records를 붙여 주세요."를 찾으면 보입니다.
- 확인: "생산 또는 출고 기록을 선택해 주세요."를 찾으면 아직 없습니다.

## 5-38. 올리기 전 점검

```text
Google 쪽 코드 폴더의 파일을 모두 읽고, 일반 JavaScript가 아닌 문법이 있는 곳과 부르기만 하고 어디에도 만들지 않은 이름이 있는지만 알려 주세요.
파일은 고치지 마세요.
```

- 확인: 두 가지 모두 "없음"이라고 나옵니다.
- 확인: `gas` 폴더 안에 파일이 정확히 다섯 개(`appsscript.json`, `Exercises.gs`, `Core.gs`, `Code.gs`, `Setup.gs`)입니다.

## 5-39. 프로젝트 만들기 (직접 하기)

- 직접 하기: 터미널에서 `npm.cmd run gas:create`를 한 번만 칩니다.
- 확인: clasp 출력에 `Created new script`가 있고, 이어서 `.clasp.json이 gas 폴더를 가리키게 했습니다. 다음: npm.cmd run gas:push(macOS: npm run gas:push)`가 나옵니다.
- 확인: `notepad .clasp.json`으로 열면 `"rootDir": "gas"`가 보입니다. 확인했으면 메모장을 닫습니다(Antigravity에게 이 파일을 열게 하지 않습니다).
- 확인: `gas` 안의 다섯 파일이 그대로입니다.
- `Project file already exists.`가 나오면 이미 만든 프로젝트가 있는 것입니다. 그대로 5-40으로 갑니다.

## 5-40. 코드 올리기 (직접 하기)

- 직접 하기: 터미널에서 `npm.cmd run gas:push`를 칩니다.
- 확인: `Pushed 5 files`와 `gas/appsscript.json`, `gas/Code.gs`, `gas/Core.gs`, `gas/Exercises.gs`, `gas/Setup.gs` 목록이 나옵니다(순서는 다를 수 있습니다). `gas` 밖의 파일은 목록에 없습니다.

## 5-41. 첫 권한 승인과 실습 시트 만들기 (직접 하기)

이 승인을 하기 전에는 웹 앱이 응답하지 않습니다.

1. 터미널에서 `npm.cmd run gas:editor`를 칩니다. 브라우저에 Apps Script 편집기가 열립니다. 열리지 않으면 터미널에 나온 편집기 주소를 직접 엽니다. 다른 계정으로 열렸으면 오른쪽 위에서 계정을 바꿉니다.
2. 왼쪽 파일 목록에서 `Setup.gs`를 누르고, 위쪽 함수 선택에 `createTrainingSpreadsheet`가 잡혔는지 봅니다(아니면 직접 고릅니다). "실행"을 누릅니다.
3. "승인 필요" 창에서 "권한 검토"를 누르고 개인 계정을 고릅니다. "Google에서 확인하지 않은 앱" 화면이 나오면 "고급", "텀블공장 개인 백엔드(으)로 이동" 순서로 누릅니다. 내가 올린 코드라서 나오는 화면입니다.
4. 권한 목록의 세 줄("모든 Google Sheets 스프레드시트 확인, 수정, 생성, 삭제", "외부 서비스에 연결", "부재중에 이 애플리케이션을 실행하도록 허용")을 위쪽 "모두 선택"으로 모두 체크합니다. 하나라도 빠지면 6회차 알림이나 트리거에서 권한 오류가 납니다.
5. 아래쪽 "계속"을 누릅니다. 아래로 내리는 화살표에 가려 있으면 그 화살표를 눌러 끝까지 내린 뒤 누릅니다.

- 확인: 아래 실행 로그에 실행 완료와 `새 실습 시트: https://docs.google.com/spreadsheets/…` 한 줄이 나옵니다.
- 확인: 로그의 시트 주소를 열면 탭 넷(생산 기록, 출고 기록, 설정, 알림 기록)이 있습니다. 생산 기록 탭에는 `P-seed-0`~`P-seed-4`가 수량 20씩, 처리 상태 "완료"로 있고, 출고 기록 탭에는 `S-seed-0`~`S-seed-4`가 15씩 있습니다.
- 확인: 시각 칸이 `2026-10-26T01:00:00.000Z` 같은 글자 그대로(왼쪽 정렬) 보입니다. 끝의 `Z`는 세계 표준시라 한국 시각보다 9시간 이르게 적힙니다. 화면에는 한국 시각으로 나옵니다.
- 확인: 기록 행 A칸 오른쪽 위에 작은 검은 삼각형(메모)이 있고, 마우스를 올리면 `["P-seed-0",20,…]`처럼 그 행의 값이 보입니다. 설정 탭에는 여섯 행(`factory_target` 120 … `warehouse_paused` FALSE)이 있고, 알림 기록 탭에는 첫 행만 있습니다.
- 확인: 편집기 왼쪽 프로젝트 설정(톱니바퀴)의 스크립트 속성에 `SPREADSHEET_ID`와 `TUMBLE_META`가 있습니다. 값은 캡처하거나 옮겨 적지 않습니다.
- 확인: 편집기 오른쪽 위 계정이 5-2의 개인 계정입니다.

## 5-42. 웹 앱 배포 (직접 하기)

- 직접 하기: 터미널에서 `npm.cmd run gas:deploy`를 칩니다.
- 확인: clasp 출력에 `Deployed AKfyc… @1` 같은 줄이 나오고, 이어서 `public/config.js에 웹 앱 주소와 timeoutMs 15000을 적었습니다.`로 시작하는 줄이 나옵니다.
- 확인: `notepad public\config.js`로 열면 `apiBaseUrl`이 `https://script.google.com/macros/s/…/exec`이고 `timeoutMs`가 `15000`이며 다른 줄은 그대로입니다.
- 이 주소는 내 컴퓨터의 메모에만 적어 둡니다. 잃어버리면 `npm.cmd run gas:editor`로 편집기를 열고 위쪽 "배포", "배포 관리"에서 설명이 `dashboard`인 배포의 웹 앱 URL을 다시 볼 수 있습니다.
- 한 번 더 쳤을 때 `이미 배포 주소가 있습니다. …`가 나오는 것은 정상입니다. 배포를 하나 더 만들면 주소가 바뀌기 때문입니다.

## 5-43. 웹 앱 응답 확인 (직접 하기)

- 직접 하기: 터미널에서 `npm.cmd run gas:open`을 칩니다.
- 확인: 터미널에 `브라우저로 엽니다. JSON이 보이면 웹 앱이 동작합니다.`와 `…/exec?path=/api/v1/snapshot` 주소가 나오고, 기본 브라우저가 그 주소를 엽니다.
- 확인: 브라우저에 `"schemaVersion":1`로 시작하는 JSON이 보이고, 그 안에 `"completed":100`(공장), `"completed":75`(창고), `"시트 조회가 가능합니다."`가 있습니다.

## 5-44. 화면 확인 (직접 하기)

- 직접 하기: 화면 서버 터미널에서 `npm.cmd start`를 치고(이미 켜져 있으면 그대로) http://127.0.0.1:4173 을 열어 새로고침합니다. 4회차 서버는 켜지 않아도 됩니다.
- 확인: "생산 100개 · 목표 120개", "출고 75개 · 목표 100개", 사진 두 장, 시간별 그래프가 나옵니다.
- 확인: 시트를 만든 뒤 30분 안에는 두 현장 모두 "기록이 반영되고 있습니다."이고 "우선 확인할 문제가 없습니다."가 보입니다. 30분이 지나면 두 현장이 "새 기록이 늦게 들어오고 있습니다."로 바뀌고, "먼저 확인할 일"에 "텀블공장: 새 기록이 늦게 들어오고 있습니다."와 "담당자: 기록 담당자"가 나옵니다. 마지막 시드 기록이 시트를 만든 시각이라 그렇습니다.
- 확인: 첫 조회는 5~7초, 그 뒤는 2~3초 걸릴 수 있습니다. "데이터 조회 기록"의 응답시간이 그 정도입니다.
- 확인: 기준 시각에서 앞 시각을 고르면 그 시각까지의 기록만 세어 수량이 줄어듭니다.
- 확인: 생산 기록 보기를 누르면 아직 표 대신 "서버가 알린 이유: 웹 앱 주소 뒤에 ?path=/api/v1/snapshot 또는 ?path=/api/v1/records를 붙여 주세요."가 나옵니다. 다음 단계에서 고칩니다.

## 5-45. 기록 조회 길 더하기

```text
웹 앱 입구에 기록 조회 길을 5회차 약속대로 더해 주세요. 다른 곳은 고치지 마세요.
```

- 확인: `gas\Code.gs`에서 "생산 또는 출고 기록을 선택해 주세요."를 찾으면 보입니다.

## 5-46. 올리기만 해 보기 (직접 하기)

- 직접 하기: 터미널에서 `npm.cmd run gas:push`를 칩니다.
- 확인: `Pushed 5 files`가 나옵니다.
- 확인: 화면에서 생산 기록 보기를 다시 열어도 여전히 "서버가 알린 이유: 웹 앱 주소 뒤에 …"가 보입니다. 웹 앱은 배포한 때의 코드로 답하기 때문입니다. 올리기만 해서는 웹 앱이 바뀌지 않습니다.

## 5-47. 같은 주소로 다시 배포 (직접 하기)

- 직접 하기: 터미널에서 `npm.cmd run gas:redeploy`를 칩니다.
- 확인: clasp 출력에 `Redeployed AKfyc… @2`가 나오고, `같은 배포를 새 버전으로 갱신했습니다. 주소는 그대로입니다.`가 이어집니다.
- 확인: 10~20초 뒤 생산 기록 보기를 다시 열면 시드 기록 5행이 발생 시각 순으로 나오고 상태가 모두 "완료"입니다. 바로 바뀌지 않으면 한 번 더 엽니다. 출고 기록 보기에도 5행이 나옵니다.
- 확인: `public\config.js`의 `apiBaseUrl`이 5-42에서 적힌 주소와 같습니다.

## 참고

- **Google 쪽 코드를 고친 뒤에는** `npm.cmd run gas:push`와 `npm.cmd run gas:redeploy`를 차례로 칩니다. 둘 다 해야 웹 앱이 바뀌고, 주소는 그대로입니다.
- **로그인이 만료되면** 명령에서 `invalid_grant`가 나옵니다. `npm.cmd run gas:login`을 다시 치고 같은 명령을 다시 칩니다.
- **1·2단계로 돌아갈 때**는 `public\config.js`의 `apiBaseUrl`과 `timeoutMs`를 `README.md`의 단계별 값 표에 있는 그 단계 값으로 바꿉니다.
- **다시 3단계로 올 때는 `gas:deploy`를 다시 하지 않습니다.** 주소가 없는 `config.js`에서 `gas:deploy`를 하면 배포가 하나 더 생겨 주소가 바뀝니다. 메모해 둔 `/exec` 주소를 `apiBaseUrl`에 직접 넣고 `timeoutMs`를 `15000`으로 바꿉니다.
- 실습 시트를 새로 만들고 싶으면 편집기에서 `createTrainingSpreadsheet`를 다시 실행합니다. 새 시트가 생기고 웹 앱은 새 시트를 읽습니다. 이전 시트는 그대로 남습니다.

## 5회차 끝 확인

- [ ] `public\config.js`의 `apiBaseUrl`이 `https://script.google.com/macros/s/…/exec`, `timeoutMs`가 `15000`입니다.
- [ ] `npm.cmd run gas:open`으로 열린 브라우저에 `"schemaVersion":1`로 시작하는 JSON이 보이고, 공장 `completed` 100, 창고 75입니다.
- [ ] 4회차 서버를 끈 채로 http://127.0.0.1:4173 에 "생산 100개 · 목표 120개", "출고 75개 · 목표 100개", 사진 두 장, 시간별 그래프가 보입니다.
- [ ] 생산 기록 보기와 출고 기록 보기에 시드 기록이 5행씩, 발생 시각 순, 상태 모두 "완료"로 나옵니다.
- [ ] 기준 시각을 앞 시각으로 고르면 그 시각까지의 기록만 세어 수량이 줄어듭니다.
- [ ] `npm.cmd run gas:deploy`를 한 번 더 치면 "이미 배포 주소가 있습니다. …"로 끝나고 주소가 바뀌지 않습니다.
- [ ] `git check-ignore -v .clasp.json`을 치면 `.gitignore`의 `.clasp.json` 줄이 나옵니다.
- [ ] `gas` 폴더에 `appsscript.json`, `Exercises.gs`, `Core.gs`, `Code.gs`, `Setup.gs` 다섯 파일이 있습니다.

못 끝냈으면 6회차 전에 공통 안내의 "5회차 이후 브랜치" 안내대로 `milestone-5` 브랜치를 받고, 옛 폴더의 `.clasp.json`과 웹 앱 주소를 옮깁니다. `gas:deploy`는 다시 하지 않습니다. 옛 폴더에 둘 다 없으면(프로젝트를 만들기 전에 멈췄으면) 새 폴더에서 5-2, 5-13, 5-39 ~ 5-44를 차례로 합니다. 그 브랜치 코드에는 기록 조회가 이미 들어 있어 5-45 ~ 5-47은 하지 않습니다.

## 부록: AGENTS.md 5회차 약속

5-1에서 덧붙이는 글 전문입니다. `milestone-5` 이후 브랜치의 `AGENTS.md`에는 앞 회차 약속 뒤에 이 절이 들어갑니다.

```markdown
## 5회차 약속
- 3단계는 Google Apps Script(GAS) 웹 앱이 내 Google 시트를 읽어 1·2단계와 같은 모양으로 답합니다. 화면 코드(public)와 backend는 고치지 않습니다. 웹 앱 주소가 들어간 뒤로는 public/config.js를 열거나 출력하지 않습니다.
- clasp는 늘 npx --yes @google/clasp@3.4.1 로 부릅니다. package.json scripts에 일곱 개를 더합니다(start·check는 그대로): "gas:login": "npx --yes @google/clasp@3.4.1 login", "gas:push": "npx --yes @google/clasp@3.4.1 push --force", "gas:editor": "npx --yes @google/clasp@3.4.1 open-script", "gas:create"·"gas:deploy"·"gas:redeploy"·"gas:open"은 각각 "node scripts/gas-clasp.mjs create"(deploy, redeploy, open)입니다.
- .gitignore에 .clasp.json과 .runtime/ 줄을 둡니다(이미 있으면 그대로).
- scripts/gas-clasp.mjs는 node scripts/gas-clasp.mjs create|deploy|redeploy|open으로 실행하는 Node.js 파일이고, 주석과 빈 줄을 빼고 60줄 안입니다. 다른 이름이면 "사용법: node scripts/gas-clasp.mjs create|deploy|redeploy|open"을 오류로 출력하고 종료 코드 1로 끝냅니다.
- clasp는 "npx " + 인자를 공백으로 이은 한 줄 글자를 spawnSync에 shell: true로 넘겨 부르고(공백이 든 인자는 큰따옴표로 감쌈), 받은 출력을 화면에 그대로 보여 줍니다. 실패는 모두 오류로 출력하고 종료 코드 1로 끝냅니다.
- 로그인 안내 글은 "로그인이 만료됐으면 npm.cmd run gas:login(macOS: npm run gas:login)을 다시 실행하세요."입니다. 웹 앱 주소가 있다는 것은 apiBaseUrl이 https://script.google.com/macros/s/(AKfyc로 시작하는 배포 ID)/exec 꼴이라는 뜻입니다.
- create: .runtime/gas-create를 지우고 빈 폴더로 만든 뒤 clasp create-script --type standalone --title "텀블공장 개인 백엔드" --rootDir .runtime/gas-create 를 실행합니다. 출력에 Created new script가 없으면 "clasp가 프로젝트를 만들지 못했습니다. 위 출력을 확인하고, " + 로그인 안내 글입니다.
- create가 성공하면 .clasp.json의 rootDir만 "gas"로 바꿔 2칸 들여쓴 JSON + 줄바꿈으로 저장하고 ".clasp.json이 gas 폴더를 가리키게 했습니다. 다음: npm.cmd run gas:push(macOS: npm run gas:push)"를 출력합니다.
- deploy: 웹 앱 주소가 이미 있으면 clasp를 부르지 않고 "이미 배포 주소가 있습니다. npm.cmd run gas:redeploy(macOS: npm run gas:redeploy)로 갱신하세요."입니다. 없으면 clasp create-deployment --description dashboard 출력에서 AKfyc로 시작하는 ID(영문·숫자·_·-)를 모아 겹친 것을 빼고 정확히 하나일 때만 성공입니다.
- deploy가 성공하면 public/config.js에서 apiBaseUrl 값을 https://script.google.com/macros/s/(배포 ID)/exec 로, timeoutMs 값을 15000으로 바꾸고 나머지 글자는 그대로 둔 뒤 "public/config.js에 웹 앱 주소와 timeoutMs 15000을 적었습니다. 이 파일에는 내 웹 앱 주소가 들어가니 커밋하거나 남에게 보내지 마세요."를 출력합니다. ID가 하나가 아니면 config.js를 바꾸지 않고 "clasp 출력에서 배포 ID를 찾지 못했습니다. 위 출력을 확인하고, " + 로그인 안내 글입니다.
- redeploy: 웹 앱 주소가 없으면 "public/config.js에 웹 앱 주소가 없습니다. 먼저 npm.cmd run gas:deploy(macOS: npm run gas:deploy)를 실행하세요."입니다. 있으면 clasp update-deployment (배포 ID) --description dashboard 를 실행하고, 출력에 "Redeployed (배포 ID) @"가 있으면 "같은 배포를 새 버전으로 갱신했습니다. 주소는 그대로입니다.", 없으면 deploy의 배포 ID 문장으로 실패합니다.
- open: 웹 앱 주소가 없으면 redeploy와 같은 문장으로 실패합니다. 있으면 "브라우저로 엽니다. JSON이 보이면 웹 앱이 동작합니다."와 주소 + "?path=/api/v1/snapshot"을 출력하고 그 주소를 기본 브라우저로 엽니다(Windows start "", macOS open, 그 밖 xdg-open).
- gas 폴더의 파일은 정확히 다섯 개입니다: appsscript.json, Exercises.gs, Core.gs, Code.gs, Setup.gs. .gs 파일은 Apps Script용 일반 JavaScript(import·export·require·TypeScript 형 표시 없음)이고 파일끼리 전역 이름을 함께 씁니다.
- appsscript.json은 2칸 들여쓰기로 {"timeZone": "Asia/Seoul", "runtimeVersion": "V8", "exceptionLogging": "STACKDRIVER", "oauthScopes": ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/script.external_request", "https://www.googleapis.com/auth/script.scriptapp"], "webapp": {"access": "ANYONE_ANONYMOUS", "executeAs": "USER_DEPLOYING"}}입니다.
- Exercises.gs는 교재와 함께 쓰는 작은 함수 다섯 개입니다(이름 그대로): readRecordRows_(sheet) 첫 행을 뺀 행 배열, sumQuantities_(records) quantity 합(빈 배열 0), groupHourly_(records) occurredAt을 UTC 정시 ISO로 내린 키별 quantity 합 객체, isDelayed_(latest, at, minutes) latest가 있고 at − latest.occurredAt이 minutes분보다 길면 true, alertMessage_(incident) title + " 담당자: " + owner + " / 할 일: " + action. 다른 파일은 같은 계산을 새로 만들지 않고 이 함수를 부릅니다.
- Core.gs는 Google 서비스를 쓰지 않는 계산을 var TumbleCore = (function () { … return { iso, day, view, parse, recordsAt, snapshot }; })(); 하나에 모읍니다.
- iso(value): Date면 toISOString(), 날짜T…(Z 또는 ±hh:mm) 꼴이고 Date.parse로 읽히는 글자면 Z로 끝나는 ISO, 아니면 "시간대를 포함한 시각을 입력해 주세요.". day(value): 한국 날짜 "YYYY-MM-DD". view(at, now): 기준 시각(at, 없으면 now)의 한국 날짜가 now와 다르거나 now보다 늦으면 "오늘의 현재 이전 시각을 선택해 주세요.".
- parse(rows, kind, now)는 시트 행 [기록 ID, 수량, 발생 시각, 접수 시각, 처리 시각, 처리 상태]를 { records, errors }로 바꿉니다. 모두 빈 행은 건너뛰고, 문제 행은 errors에 { row: 순번 + 2, message }를 넣고 다음 행으로 갑니다.
- parse 검사(차례로): ID는 null·undefined면 "", 아니면 String(값)(숫자 0도 "0")이고 /^[A-Za-z0-9_-]{1,100}$/에 맞지 않거나 앞에서 나온 ID면 "고유한 영문·숫자 기록 ID가 필요합니다."(new Set으로 확인), 수량이 숫자나 글자가 아니거나(TRUE·FALSE 포함) 빈칸이거나 1~10000 정수가 아니면 "수량은 1~10000의 정수입니다.", 시각은 iso(접수·처리는 있을 때만, 없으면 null), 발생 ≤ now, 발생 ≤ 접수 ≤ now, 처리가 있으면 접수가 있고 접수 ≤ 처리 ≤ now가 아니면 "발생·접수·처리 시각의 순서를 확인해 주세요.".
- recordsAt(records, kind, at, from, to): kind가 틀리면 "생산 또는 출고를 선택해 주세요.", 시작은 from 또는 at 날짜의 한국 0시(day(at) + "T00:00:00+09:00"), 끝은 to 또는 at입니다. 날짜가 at과 다르거나 시작 > 끝 또는 끝 > at이면 "조회 시간 구간을 확인해 주세요.". 결과는 4회차 records 결과와 같은 규칙(정렬, at 뒤 시각 null, status 세 가지)입니다.
- snapshot(records, settings, meta, alerts, at, now, errors): 기준 시각은 view(at, now)입니다. 현장마다 recordsAt의 마지막 기록(latest), 처리 시각이 있는 기록(completed), 처리 시각이 없는 기록이 있는지(pending), pending이면서 설정 factory_paused(창고 warehouse_paused)가 true인지(paused), isDelayed_(latest, 기준 시각, delay_minutes)(stale)를 구합니다.
- note는 차례로 latest 없음 "기록이 없습니다.", paused "기록 처리가 일시 정지됐습니다.", pending "처리를 기다리는 기록이 있습니다.", stale "새 기록이 늦게 들어오고 있습니다.", 그 밖 "기록이 반영되고 있습니다."입니다. processingState는 paused면 paused, pending이거나 latest가 없으면 waiting, 아니면 completed입니다. status는 latest 없음·pending·stale이면 warning, 아니면 normal입니다.
- sites 값: label "텀블공장"·"물류창고", target은 설정 factory_target·warehouse_target, completed는 completed의 sumQuantities_(없으면 null), 세 시각은 latest 값, history는 groupHourly_(completed)를 시각 순 { timestamp, quantity } 배열로, image는 { url: "./assets/approved/factory.png"(창고 warehouse.png), alt: "공장 생산 참고 사진"(창고 "창고 출고 참고 사진") }입니다. 사진 주소는 화면 서버 기준이라 public의 사진이 보입니다.
- incidents(차례로): warning 현장마다 { id FACTORY-FEED·WAREHOUSE-FEED, scope factory·warehouse, level "warning", title: label + ": " + note, owner "기록 담당자", action "시트의 기록과 처리 상태를 확인해 주세요." }, errors가 있으면 { id "INPUT-ERROR", scope "service", level "warning", title "입력값을 확인할 기록이 있습니다.", owner "기록 담당자", action: 오류마다 sheet + " " + row + "행: " + message를 " / "로 이은 글 }입니다.
- 이어서 alerts({ at, status, message } 목록) 가운데 기준 시각 이전 마지막 항목(last)이 failed면 { id "ALERT-DELIVERY", scope "service", level "error", title "알림 전송에 실패했습니다.", owner "서비스 담당자", action "알림 기록과 웹훅 설정을 확인해 주세요." }를 넣습니다.
- snapshot이 돌려주는 값: schemaVersion 1, scenarioId "normal", revision·changedAt(meta), serverTime iso(now), viewTime(기준 시각), mode(at이 있으면 "past", 아니면 "current"), sessionId(meta), trainingOnly true, sites, services { api: { status "normal", note "시트 조회가 가능합니다." }, alerts: { status: last.status 또는 "unknown", lastAttemptAt: last.at 또는 null, note: last.message 또는 "알림 발송 기록이 없습니다." } }, incidents.
- 실습 시트 탭은 "생산 기록", "출고 기록", "설정", "알림 기록"입니다(var TUMBLE_SHEETS = { production, shipment, settings, alerts }). 기록 탭 첫 행은 TUMBLE_HEADERS = ["기록 ID", "수량", "발생 시각", "접수 시각", "처리 시각", "처리 상태"], 알림 기록 탭 첫 행은 ["시각", "사건 ID", "내용", "발송 상태", "상세"]입니다.
- 설정 탭은 첫 행 ["설정 이름", "값"] 아래 factory_target 120, warehouse_target 100, delay_minutes 30, cooldown_minutes 10, factory_paused false, warehouse_paused false입니다. 설정 이름은 밑줄 이름 그대로 씁니다.
- 스크립트 속성: SPREADSHEET_ID(실습 시트 ID), TUMBLE_META(세션 정보(초기 자료)인 { sessionId, revision, changedAt }의 JSON 글자). 6회차에 DISCORD_WEBHOOK_URL과 ALERT_로 시작하는 속성이 더해집니다.
- 시트에 쓸 때 숫자·=·+·-·@로 시작하는 글자는 앞에 '를 붙여 글자 그대로 남깁니다(toCell_, 행은 toRow_). 읽을 때는 Date면 ISO로 바꾸고, toCell_이 붙인 '만 뗍니다(' 뒤가 숫자·=·+·-·@일 때, fromCell_). 시각 칸은 늘 Z로 끝나는 ISO 글자입니다.
- 기록 행의 A칸 메모는 접수한 원본(그 행 여섯 칸의 JSON 배열)입니다. 읽을 때 메모가 없는 행은 아직 접수 전이라 접수·처리 시각을 비우고, 메모가 있는 행은 원본을 씁니다. 앞 여섯 칸이 원본과 하나라도 다르면 errors에 "접수한 기록의 수정은 반영하지 않습니다. 새 실습 시트를 만들어 주세요."를 넣습니다(G열부터는 보지 않음).
- 설정은 설정 탭이 아니라 설정 탭 A1 메모의 설정 이력 [{ at, revision, settings }]에서 기준 시각 이전 마지막 항목을 씁니다. 없으면 "이 시점의 설정 자료가 없습니다.". meta의 revision·changedAt은 그 항목의 revision·at입니다.
- readData_(at, kinds)(kinds가 없으면 생산·출고 둘 다)는 { now, at, records, errors, settings, meta }를 돌려줍니다: now는 지금 ISO 시각, at은 기준 시각(view(at, now)), records·errors는 기록 탭을 parse한 결과(errors 항목은 { sheet, row, message }), settings·meta는 위 설정 이력 항목에서 고른 값(meta의 sessionId는 TUMBLE_META 값)입니다.
- alerts_()는 알림 기록 탭에서 첫 칸(시각)이 있는 행만 읽어 { at: 시각(iso), status: 발송 상태, message: 내용 } 목록으로 돌려줍니다.
- Code.gs의 공통 이름(다른 파일이 부름): TUMBLE_SHEETS, TUMBLE_HEADERS, properties_(), spreadsheet_()(SPREADSHEET_ID가 없으면 "먼저 createTrainingSpreadsheet를 실행해 주세요."), toCell_, toRow_, fromCell_, rows_(탭 이름), settings_(), meta_()(없으면 "초기 자료가 없습니다."), json_(값), readData_(at, kinds), alerts_().
- settings_()는 설정 탭의 행(설정 이름, 값)을 읽어 { 설정 이름: 값 } 객체로 만듭니다(A1 메모의 설정 이력이 아님). 검사를 통과한 값은 목표는 수(빈칸은 null), 분은 수, 처리 정지는 true·false로 바꿉니다. 검사 문장: 목표가 빈칸도 1 이상 정수도 아니면 "목표는 양의 정수 또는 빈칸입니다.", delay_minutes·cooldown_minutes가 1~1440 밖이면 "대기 기준은 1~1440분입니다.", 처리 정지가 true·false·"TRUE"·"FALSE" 밖이면 "처리 정지는 TRUE 또는 FALSE입니다.".
- 웹 앱 입구 doGet(e): path 매개변수의 앞뒤 /를 모두 떼고, "api/v1/snapshot"이면 snapshot(입력 오류는 at이 없을 때만 넘김), "api/v1/records"면 kind(아니면 "생산 또는 출고 기록을 선택해 주세요.")·at·from·to로 { sessionId, viewTime, records }를 돌려줍니다. 그 밖은 "웹 앱 주소 뒤에 ?path=/api/v1/snapshot 또는 ?path=/api/v1/records를 붙여 주세요.".
- 웹 앱 응답은 { ok, data } 같은 봉투 없이 JSON 그대로입니다(ContentService, MimeType.JSON). 웹 앱은 상태 코드를 정할 수 없으므로 모든 오류를 잡아 { error: 문장 }으로 답합니다.
- Setup.gs의 createTrainingSpreadsheet(편집기에서 실행): 실행할 때마다 새 시트 "텀블공장 개인 실습 " + 지금 ISO 시각을 만들고(이전 시트는 그대로), 시간대 Asia/Seoul, 네 탭, SPREADSHEET_ID 저장, 모든 탭 첫 행 고정과 열 폭 자동 맞춤(autoResizeColumns), 로그 "새 실습 시트: " + 시트 주소를 남기고 시트 주소를 돌려줍니다.
- 시드 기록은 탭마다 5행(i = 0~4)입니다: ID "P-seed-" + i(출고 "S-seed-" + i), 수량 20(출고 15), 발생은 오늘 한국 0시와 지금 사이를 다섯으로 나눈 (i+1)번째 시각, 접수는 발생 + gap, 처리는 발생 + gap × 2(지금보다 늦지 않게), gap = min(2초, (지금 − 발생) ÷ 2), 처리 상태 "완료", A칸 메모에 원본입니다.
- 설정 탭 A1 메모에는 [{ at: 오늘 한국 0시, revision: 1, settings: 여섯 값 }], TUMBLE_META에는 { sessionId: Utilities.getUuid(), revision: 1, changedAt: 지금 }을 저장합니다.
- Google 쪽 코드를 고치면 사용자가 gas:push 뒤 gas:redeploy를 합니다(웹 앱은 배포한 때의 코드로 답합니다). gas:deploy는 처음 한 번만 합니다.
```
