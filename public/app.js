// 대시보드 화면 값을 채웁니다. 화면 틀(카드, 제목, 칸)은 index.html에 있고, 여기서는 글자·숨김·클래스만 바꿉니다.

// ── 값을 받아 결과를 돌려주는 작은 함수 ──
const integer = (value) => Number.isSafeInteger(value) && value >= 0;
const time = (value) => typeof value === "string" && Number.isFinite(Date.parse(value));
// hour12를 함께 쓰면 hourCycle이 무시되어 자정이 "24시"로 나올 수 있어 쓰지 않습니다.
const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
});
const hourFormat = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", hour: "2-digit", hourCycle: "h23" });
// 시각 → "2026. 10. 26. 09:00:00". 시각이 아니면 "기록 없음".
const dateText = (value) => time(value) ? dateFormat.format(new Date(value)) : "기록 없음";
// 시각 → "09시".
const hourText = (value) => time(value) ? hourFormat.format(new Date(value)) : "기록 없음";
// 수량 → "1,000개". 0 이상의 정수가 아니면 "확인 불가"(0으로 바꾸지 않습니다).
const numberText = (value) => integer(value) ? value.toLocaleString("ko-KR") + "개" : "확인 불가";
// 실적·목표 → "83.3%". 둘 중 하나가 정수가 아니거나 목표가 0이면 "목표를 확인해 주세요".
function progressText(completed, target) {
  if (!integer(completed) || !integer(target) || target === 0) return "목표를 확인해 주세요";
  return (completed / target * 100).toFixed(1) + "%";
}
// 시각과 지금 → "15분 전". 시각이 없거나 지금보다 늦으면 "시각 확인 필요".
function ageText(value, now) {
  if (!time(value) || Date.parse(value) > now) return "시각 확인 필요";
  return Math.floor((now - Date.parse(value)) / 60000) + "분 전";
}
// 마지막 기록 시각과 지금 → "fresh"(30분 이내), "stale"(30분 넘음), "missing"(시각 없음).
function freshness(value, now) {
  if (!time(value) || Date.parse(value) > now) return "missing";
  return now - Date.parse(value) > 30 * 60000 ? "stale" : "fresh";
}

// ── 화면 요소 도우미 ──
const $ = (selector) => document.querySelector(selector);
const el = (tag, className = "", value) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
};
const statusNames = { normal: "정상", warning: "확인 필요", error: "오류", sent: "전송 성공", failed: "실패", unknown: "확인 불가", waiting: "대기" };
// 배지 하나를 상태에 맞게 바꿉니다. 객체에 없는 값은 "확인 필요", "loading"은 응답 전의 "조회 중"입니다.
function setBadge(node, value) {
  const tone = value === "loading" ? "neutral" : ["normal", "sent"].includes(value) ? "good" : ["error", "failed"].includes(value) ? "danger" : "warning";
  node.className = "badge " + tone;
  node.textContent = value === "loading" ? "조회 중" : statusNames[value] || "확인 필요";
}
const siteNames = { factory: { noun: "생산", label: "텀블공장" }, warehouse: { noun: "출고", label: "물류창고" } };

// ── 그래프 ──
const SVG = "http://www.w3.org/2000/svg";
const HOUR = 3600000;
// 막대 하나가 한 시간입니다. 기록이 없는 시간은 빈자리로 두고 0 막대를 만들지 않습니다.
function graphSvg(label, points) {
  const max = Math.max(1, ...points.map(p => p.quantity));
  const first = Date.parse(points[0].timestamp);
  const slots = Math.round((Date.parse(points[points.length - 1].timestamp) - first) / HOUR) + 1;
  const width = 80 + slots * 90;
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("viewBox", "0 0 " + width + " 190");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", "190");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", label + " 시간별 완료 수량: " + points.map(p => dateText(p.timestamp) + " " + p.quantity + "개").join(", "));
  const draw = (tag, attrs, text) => {
    const node = document.createElementNS(SVG, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    if (text !== undefined) node.textContent = text;
    svg.append(node);
  };
  draw("text", { x: 0, y: 20, "font-size": 16, fill: "#545b57" }, "개");
  draw("line", { x1: 35, y1: 150, x2: width - 15, y2: 150, stroke: "#bfc7c1" });
  for (const p of points) {
    const x = 40 + Math.round((Date.parse(p.timestamp) - first) / HOUR) * 90;
    const height = p.quantity / max * 95;
    draw("rect", { x, y: 150 - height, width: 38, height, rx: 3, fill: "#47594d" });
    draw("text", { x, y: 145 - height, "font-size": 16, fill: "#222724" }, String(p.quantity));
    draw("text", { x, y: 177, "font-size": 16, fill: "#545b57" }, hourText(p.timestamp));
  }
  return svg;
}
// 그래프 칸(.graph-scroll) 안의 SVG만 바꿉니다. 바꾸기 전 가로 스크롤 위치를 기억했다가 되돌립니다.
// 응답 전(loading)에는 "시간별 기록 조회 중"만 보입니다.
function renderGraph(box, label, points, loading) {
  const scroller = box.querySelector(".graph-scroll");
  const hasPoints = !loading && Array.isArray(points) && points.length > 0;
  box.querySelector(".loading-graph").hidden = !loading;
  box.querySelector(".graph-empty").hidden = loading || hasPoints;
  box.querySelector(".graph-caption").hidden = !hasPoints;
  scroller.hidden = !hasPoints;
  const left = scroller.scrollLeft;
  scroller.replaceChildren(...(hasPoints ? [graphSvg(label, points)] : []));
  scroller.scrollLeft = left;
}

// ── 현장 사진 ──
// image.url은 고치지 않고 그대로 씁니다. 상대 주소는 이 화면 주소를 기준으로 열립니다.
// 사진 주소와 alt가 지난번과 같으면 다시 만들지 않아 조회할 때마다 깜박이지 않습니다.
function renderPhoto(slot, caption, site) {
  const image = site.image, key = site.loading ? "loading" : image ? image.url + "\n" + image.alt : "none";
  if (slot.dataset.photo === key) return;
  slot.dataset.photo = key;
  if (site.loading) { slot.replaceChildren(el("div", "photo-placeholder", "현장 사진 확인 중")); return; }
  if (!image) { slot.replaceChildren(el("div", "photo-placeholder", "현장 사진 없음"), el("figcaption", "", caption)); return; }
  const img = el("img");
  img.src = image.url;
  img.alt = image.alt.trim() || caption;
  img.loading = "lazy";
  img.onerror = () => {
    img.remove();
    slot.prepend(el("div", "photo-placeholder", "현장 사진을 불러오지 못했습니다."));
  };
  slot.replaceChildren(img, el("figcaption", "", caption));
}

// ── 기록 처리 상태 카드 안쪽 ──
function timelineContent(label, site, now) {
  if (site.loading) return [el("h3", "", label), el("p", "meta", "기록 처리 정보 조회 중")];
  const age = freshness(site.lastEventAt, now);
  const top = el("div", "status-line");
  const badge = el("span");
  setBadge(badge, age === "missing" ? "waiting" : age === "stale" ? "warning" : site.status);
  top.append(el("h3", "", label), badge);
  const items = [top, el("p", "card-description", site.note)];
  if (age === "stale") items.push(el("p", "notice", "기록이 30분 넘게 들어오지 않았습니다."));
  if (age === "missing") items.push(el("p", "notice", "현장 기록을 기다리고 있습니다."));
  const list = el("dl", "time-list");
  for (const [key, name] of [["lastEventAt", "기록 발생"], ["receivedAt", "서버 접수"], ["processedAt", "서버 처리"]]) {
    const row = el("div");
    const value = time(site[key]) ? dateText(site[key]) : key === "processedAt" && site.processingState === "paused" ? "처리 중단" : "기록 대기";
    row.append(el("dt", "", name), el("dd", "", value));
    list.append(row);
  }
  items.push(list);
  return items;
}

// 현장 하나(공장 또는 창고)의 생산·출고 카드, 운영 상태 카드, 기록 처리 상태 카드를 채웁니다.
// site.loading이면 응답 전이라 index.html의 "조회 중" 글자를 그대로 다시 씁니다.
function renderSite(id, site, now) {
  const { noun, label } = siteNames[id];
  const quantity = $("#" + id + "-quantity").querySelectorAll("span");
  quantity[0].textContent = site.loading ? "조회 중" : noun + " " + numberText(site.completed);
  quantity[1].textContent = site.loading ? "" : "· 목표 " + numberText(site.target);
  $("#" + id + "-progress-text").textContent = site.loading ? noun + " 실적과 목표를 가져오고 있습니다." : "계획 대비 " + progressText(site.completed, site.target);
  const valid = !site.loading && integer(site.completed) && integer(site.target) && site.target !== 0;
  const bar = $("#" + id + "-progress");
  bar.hidden = !valid;
  if (valid) {
    bar.value = Math.min(100, site.completed / site.target * 100);
    bar.setAttribute("aria-label", label + " 목표 달성률 " + progressText(site.completed, site.target));
  }
  $("#" + id + "-exceeded").hidden = !(valid && site.completed > site.target);
  renderPhoto($("#" + id + "-photo"), id === "factory" ? "공장 생산 참고 사진" : "창고 출고 참고 사진", site);
  renderGraph($("#" + id + "-graph"), label, site.history, site.loading);

  const age = freshness(site.lastEventAt, now);
  const status = site.loading ? "loading" : age === "missing" ? "waiting" : age === "stale" ? "warning" : site.status;
  const card = $("#" + id + "-status");
  card.className = "card status-card" + (status === "error" ? " danger" : "");
  setBadge(card.querySelector(".badge"), status);
  card.querySelector(".card-description").textContent = site.loading ? noun + " 기록 정보를 가져오고 있습니다." : site.note;
  card.querySelector(".meta").textContent = site.loading ? "기록 시각 조회 중" : "기준 시각 대비: " + ageText(site.lastEventAt, now) + " · 발생 시각: " + dateText(site.lastEventAt);
  $("#" + id + "-flow").replaceChildren(...timelineContent(label, site, now));
}

// 주소 끝의 # 부분 → 어느 화면인지. 다섯 주소 밖은 오늘 운영과 안내(isUnknown)입니다.
function resolveRoute(hash) {
  const raw = (hash || "").replace(/^#\/?/, "");
  if (!raw || raw === "today") return { route: "today", id: null, isUnknown: false };
  const detail = /^(records|queries)\/(factory|warehouse)$/.exec(raw);
  if (detail) return { route: detail[1], id: detail[2], isUnknown: false };
  return { route: "today", id: null, isUnknown: true };
}

// ── 기록 화면 ──
// 시각 → 한국 시간 날짜 "2026-10-26", 한국 시간 "2026-10-26T13:10:00"(datetime-local 칸의 값 모양).
const day = (value) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
const localTime = (value) => time(value) ? new Date(Date.parse(value) + 9 * HOUR).toISOString().slice(0, 19) : "";
// 칸의 값은 한국 시간으로 읽습니다.
const fromLocal = (value) => Date.parse(value + "+09:00");
function table(headers, rows) {
  const wrap = el("div", "table-scroll"), result = el("table"), head = el("thead"), header = el("tr"), body = el("tbody");
  for (const text of headers) { const th = el("th", "", text); th.setAttribute("scope", "col"); header.append(th); }
  head.append(header);
  for (const row of rows) { const tr = el("tr"); for (const cell of row) tr.append(el("td", "", cell)); body.append(tr); }
  result.append(head, body);
  wrap.append(result);
  wrap.tabIndex = 0;
  wrap.setAttribute("aria-label", "기록 표. 좌우로 이동할 수 있습니다.");
  return wrap;
}
const recordStatus = (value) => value === "completed" ? "완료" : value === "receipt-wait" ? "접수 대기" : "처리 대기";
// 같은 화면(sameScreen)이면 다시 그리기 전에 .table-scroll과 .history-strip의 가로 스크롤 위치와 초점을 읽어 두었다가
// 새로 생긴 같은 이름의 요소에 되돌립니다. 떼어 낸 요소의 scrollLeft는 0이 되므로 반드시 그리기 전에 읽습니다.
function keepScroll(box, draw, sameScreen) {
  const before = !sameScreen ? [] : [".table-scroll", ".history-strip"].map(selector => {
    const old = box.querySelector(selector);
    return old && [selector, old.scrollLeft, old === document.activeElement];
  }).filter(Boolean);
  draw();
  for (const [selector, left, focused] of before) {
    const next = box.querySelector(selector);
    if (!next) continue;
    next.scrollLeft = left;
    if (focused) next.focus({ preventScroll: true });
  }
}
// 받은 기록과 기록 오류, "시간대 조회"로 기억한 시작·종료 값(recordFrom·recordTo), 수강생이 칸에 고친 값(draftFrom·draftTo)입니다.
// 기록 요청에는 기억한 값만 쓰고, 고치기만 한 값은 칸에만 남깁니다.
let recordsData = null, recordsError = "";
let recordFrom = "", recordTo = "", draftFrom = "", draftTo = "";
// 기록 요청 번호와 진행 중 표시입니다. 번호가 바뀐 뒤 도착한 응답은 버립니다.
let recordsLoading = false, recordsRequestId = 0;
// 지난번에 그린 기록 표 내용입니다. 같으면 다시 만들지 않아 같은 표 요소가 그대로 남습니다.
let recordsView = "";
function renderRecords(data, id, sameScreen) {
  // 첫 응답 전이면 브라우저 시계의 지금 시각으로 기본값과 min·max를 정합니다.
  const view = data?.viewTime || new Date().toISOString();
  // 칸의 값은 고친 값, 없으면 기억한 값, 그것도 없으면 기본값입니다. 초점이 있는 칸은 덮어쓰지 않습니다.
  for (const [input, value] of [[$("#record-from"), draftFrom || recordFrom || day(view) + "T00:00:00"], [$("#record-to"), draftTo || recordTo || localTime(view)]]) {
    input.min = day(view) + "T00:00:00";
    input.max = localTime(view);
    if (document.activeElement !== input) input.value = value;
  }
  const rows = recordsData?.records?.map(r => [dateText(r.occurredAt), r.quantity + "개", r.receivedAt ? dateText(r.receivedAt) : "접수 대기", r.processedAt ? dateText(r.processedAt) : "처리 대기", recordStatus(r.status)]);
  // snapshot 조회가 실패해 기록 요청을 보내지 못했으면 그렇다고 알립니다.
  const missed = errorText && !recordsLoading;
  const waiting = missed ? "현재 자료를 받지 못해 기록을 불러오지 못했습니다. 다시 조회하면 불러옵니다." : "기록을 확인하고 있습니다.";
  const result = $("#records-result"), key = JSON.stringify([recordsError, rows ?? waiting]);
  if (recordsView === key) return;
  recordsView = key;
  keepScroll(result, () => result.replaceChildren(
    recordsError ? el("p", "notice warning", recordsError) :
    !rows ? el("p", missed ? "notice warning" : "notice", waiting) :
    rows.length ? table(["발생 시각", "수량", "서버 접수", "서버 처리", "상태"], rows) :
    el("p", "notice", "선택한 시간대에 기록이 없습니다.")), sameScreen);
}

// ── 알림 목록과 먼저 확인할 일 ──
// 서버가 알린 사건과 화면이 겪은 조회 실패(failure)를 한 목록으로 만듭니다.
// PREDICTION-JOB은 빼고, 같은 id는 한 번만 넣고, 순서는 API-QUERY, level error, 나머지입니다.
function currentIssues(data, failure = "") {
  const issues = new Map((data?.incidents || []).filter(item => item.id !== "PREDICTION-JOB").map(item => [item.id, item]));
  if (failure) issues.set("API-QUERY", { id: "API-QUERY", scope: "service", level: "error",
    title: "최신 자료를 가져오지 못했습니다.", owner: "서비스 운영 담당자", action: "조회 연결과 서버 상태를 확인해 주세요." });
  const rank = (item) => item.id === "API-QUERY" ? 0 : item.level === "error" ? 1 : 2;
  return [...issues.values()].sort((a, b) => rank(a) - rank(b));
}
function toggleNotifications(force) {
  const panel = $("#notification-dropdown"), button = $("#header-alerts-link");
  const open = typeof force === "boolean" ? force : panel.hidden;
  panel.hidden = !open;
  button.setAttribute("aria-expanded", String(open));
}
// 자료가 아직 없으면 "알림 확인 중"(neutral)이고, 자료 없이 실패만 했으면 조회 실패 한 건입니다.
function renderNotifications(issues) {
  const waiting = !lastData && !errorText;
  const panel = $("#notification-dropdown");
  panel.replaceChildren(el("h2", "", "알림"));
  if (!issues.length) panel.append(el("p", "", waiting ? "자료를 확인하고 있습니다." : "확인할 알림이 없습니다."));
  for (const item of issues) {
    const entry = el("article", "notification-item");
    entry.append(el("h3", "", item.title), el("p", "", "담당자: " + item.owner), el("p", "", "할 일: " + item.action));
    panel.append(entry);
  }
  const countText = waiting ? "알림 확인 중" : "알림 " + issues.length + "건";
  $("#header-alerts-text").textContent = countText;
  const button = $("#header-alerts-link");
  button.setAttribute("aria-label", countText);
  button.className = "alerts-link " + (waiting ? "neutral" : issues.some(item => item.level === "error") ? "danger" : issues.length ? "warning" : "good");
}
function renderHero(issues) {
  const first = issues[0];
  $("#hero").className = "hero" + (first ? "" : " neutral");
  $("#hero-owner").hidden = !first;
  if (!first) {
    $("#hero-title").textContent = "우선 확인할 문제가 없습니다.";
    $("#hero-action").textContent = "운영 담당자 · 기록 갱신 상태를 계속 확인해 주세요.";
    return;
  }
  const where = first.scope === "factory" || first.id === "FACTORY-FEED" ? "생산 기록 보기에서 마지막 기록을 확인하세요. " :
    first.scope === "warehouse" || first.id === "WAREHOUSE-FEED" ? "출고 기록 보기에서 마지막 기록을 확인하세요. " :
    first.id === "API-QUERY" ? "새로고침 후에도 실패하면 담당자에게 문의하세요. " :
    first.id === "ALERT-DELIVERY" ? "아래 알림 전송 기록에서 마지막 시도와 실패 여부를 확인하세요. " : "";
  $("#hero-title").textContent = first.title;
  $("#hero-owner").textContent = "담당자: " + first.owner;
  $("#hero-action").textContent = "확인할 일: " + where + first.action;
}

// ── 도움말 ──
// 열린 설명이 가장 가까운 카드(.card, .hero) 안에 들어가면 그 카드 안쪽에, 아니면 화면 좌우 16px 안쪽에 오도록 옮깁니다.
function positionHelpPopover(pop) {
  if (pop.hidden) return;
  pop.style.translate = "none";
  const bounds = pop.getBoundingClientRect();
  const width = document.documentElement.clientWidth;
  let min = 16, max = width - 16;
  const card = pop.closest(".card, .hero")?.getBoundingClientRect();
  if (card && Math.min(max, card.right) - Math.max(min, card.left) >= bounds.width) {
    min = Math.max(min, card.left);
    max = Math.min(max, card.right);
  }
  const left = Math.max(min, Math.min(bounds.left, max - bounds.width));
  pop.style.translate = (left - bounds.left) + "px 0";
}
// 어떤 방법으로 닫든 고정 표시(data-pinned)는 "false"로 돌립니다.
function closeHelp(pop) {
  const btn = pop.closest(".help-wrap").querySelector(".help-btn");
  pop.hidden = true;
  btn.setAttribute("aria-expanded", "false");
  btn.dataset.pinned = "false";
}
const openHelps = () => document.querySelectorAll(".help-popover:not([hidden])");
function setupHelp(btn) {
  const wrap = btn.closest(".help-wrap"), pop = wrap.querySelector(".help-popover");
  // 하나를 열면 열려 있던 다른 도움말과 알림 목록을 닫습니다.
  function open() {
    for (const other of openHelps()) if (other !== pop) closeHelp(other);
    toggleNotifications(false);
    pop.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    positionHelpPopover(pop);
  }
  btn.addEventListener("mouseenter", open);
  wrap.addEventListener("mouseleave", () => {
    if (document.activeElement !== btn && btn.dataset.pinned !== "true") closeHelp(pop);
  });
  btn.addEventListener("focus", open);
  btn.addEventListener("blur", () => {
    if (btn.dataset.pinned !== "true") closeHelp(pop);
  });
  btn.addEventListener("click", () => {
    if (btn.dataset.pinned !== "true") { btn.dataset.pinned = "true"; open(); }
    else closeHelp(pop);
  });
}

// ── 강사 API 연결 ──
const config = window.DASHBOARD_CONFIG || {};
// 요청 주소를 만듭니다. GAS 웹 앱(…/exec)은 경로를 ?path=로 받고, 그 밖의 서버는 주소 뒤에 경로를 붙입니다.
function apiUrl(base, path, params = "") {
  const address = base.replace(/\/$/, ""), query = String(params);
  if (address.endsWith("/exec")) return address + "?path=" + path + (query ? "&" + query : "");
  return address + path + (query ? "?" + query : "");
}
// 실패는 시간 초과·연결 실패·HTTP 오류·JSON 아님 네 갈래로 나눠 알립니다.
const RETRY_HINT = "잠시 후 다시 조회하고, 계속되면 서버를 실행한 창의 기록(로그)을 확인하거나 강사에게 알려 주세요.";
const CONNECTION_MESSAGE = "API 서버에 연결하지 못했습니다. 연결 주소가 맞는지, 직접 띄운 서버라면 켜져 있는지 확인해 주세요. GAS 웹 앱이라면 편집기에서 함수를 한 번 실행해 권한을 승인했는지도 확인해 주세요.";
const NOT_JSON_MESSAGE = "서버 응답이 JSON 형식이 아닙니다. 연결 주소가 API 서버 주소인지 확인해 주세요.";
// 5000이면 5, 100이면 0.1, 15000이면 15초입니다(소수 첫째 자리까지 반올림).
const timeoutMessage = (ms) => "서버가 " + Math.round(ms / 100) / 10 + "초 안에 응답하지 않았습니다. " + RETRY_HINT;
function httpErrorMessage(status) {
  if (status === 400) return "서버가 요청 조건을 받아들이지 않았습니다(HTTP 400).";
  if (status === 404) return "서버에 요청한 주소가 없습니다(HTTP 404). 연결 주소를 확인해 주세요.";
  if (status >= 500) return "서버가 요청을 처리하지 못했습니다(HTTP " + status + "). " + RETRY_HINT;
  return "서버가 요청을 거절했습니다(HTTP " + status + ").";
}
// GET으로 JSON을 받습니다. snapshot과 records가 이 함수를 함께 씁니다.
async function requestJson(url) {
  const limit = typeof config.timeoutMs === "number" ? config.timeoutMs : 5000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), limit);
  try {
    let response;
    try {
      response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" }, signal: controller.signal });
    } catch (error) {
      throw new Error(controller.signal.aborted ? timeoutMessage(limit) : CONNECTION_MESSAGE, { cause: error });
    }
    // HTTP 오류는 응답 본문을 읽지 않습니다.
    if (!response.ok) throw new Error(httpErrorMessage(response.status));
    let value;
    try {
      value = await response.json();
    } catch (error) {
      throw new Error(controller.signal.aborted ? timeoutMessage(limit) : NOT_JSON_MESSAGE, { cause: error });
    }
    // GAS 웹 앱처럼 200으로 실패를 알리는 서버는 {error: 이유}를 보냅니다.
    if (typeof value?.error === "string") throw new Error("서버가 요청을 처리하지 못했습니다. 서버가 알린 이유: " + value.error);
    return value;
  } finally {
    clearTimeout(timer);
  }
}
// 받은 JSON의 모양을 API_CONTRACT.md 4절의 표 순서대로 검사하고, 처음 틀린 칸 하나를 알려 줍니다. 맞으면 null입니다.
const TIME_TEXT = "시각 문자열(예: 2026-10-15T09:00:00+09:00)";
const fieldError = (lead, path, expected) => lead + " 틀린 항목: " + path + " (기대: " + expected + ")";
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
function validateSnapshot(data) {
  const base = (path, expected) => fieldError("서버 자료의 기본 형식을 확인해 주세요.", path, expected);
  if (!isObject(data)) return base("(응답 전체)", "JSON 객체");
  if (data.schemaVersion !== 1) return base("schemaVersion", "숫자 1");
  if (!integer(data.revision) || data.revision < 1) return base("revision", "1 이상의 정수");
  if (typeof data.scenarioId !== "string") return base("scenarioId", "문자열");
  if (!time(data.changedAt)) return base("changedAt", TIME_TEXT);
  if (!time(data.serverTime)) return base("serverTime", TIME_TEXT);
  if (data.trainingOnly !== true) return base("trainingOnly", "true");
  if (!isObject(data.sites)) return base("sites", "객체");
  if (!isObject(data.services)) return base("services", "객체");
  if (!Array.isArray(data.incidents)) return base("incidents", "배열");
  const shape = (path, expected) => fieldError("서비스 상태의 형식을 확인해 주세요.", path, expected);
  for (const [index, item] of data.incidents.entries()) {
    const path = "incidents[" + index + "]";
    if (!isObject(item)) return shape(path, "객체");
    if (typeof item.id !== "string") return shape(path + ".id", "문자열");
    if (!["warning", "error"].includes(item.level)) return shape(path + ".level", "\"warning\" 또는 \"error\"");
    const key = ["title", "owner", "action"].find(name => typeof item[name] !== "string");
    if (key) return shape(path + "." + key, "문자열");
  }
  if (data.viewTime !== undefined && (!time(data.viewTime) || Date.parse(data.viewTime) > Date.parse(data.serverTime))) {
    return fieldError("조회 기준 시각을 확인해 주세요.", "viewTime", "serverTime 이전이거나 같은 " + TIME_TEXT);
  }
  return null;
}
// records의 기준 시각은 요청에 보낸 at입니다.
function validateRecords(data, at) {
  const lead = "기록 응답 형식이 올바르지 않습니다.";
  if (!isObject(data)) return fieldError(lead, "(응답 전체)", "JSON 객체");
  if (!Array.isArray(data.records)) return fieldError(lead, "records", "배열");
  const limit = Date.parse(at), before = "기준 시각 이전이거나 같은 " + TIME_TEXT;
  for (const [index, r] of data.records.entries()) {
    const path = "records[" + index + "]";
    if (!isObject(r)) return fieldError(lead, path, "객체");
    if (!integer(r.quantity)) return fieldError(lead, path + ".quantity", "0 이상의 정수");
    if (!time(r.occurredAt) || Date.parse(r.occurredAt) > limit) return fieldError(lead, path + ".occurredAt", before);
    const key = ["receivedAt", "processedAt"].find(name => r[name] !== null && (!time(r[name]) || Date.parse(r[name]) > limit));
    if (key) return fieldError(lead, path + "." + key, "null 또는 " + before);
  }
  return null;
}

// 서버 자료를 화면에 쓰기 전에 다듬습니다. 틀린 칸만 비우고 나머지는 그대로 씁니다.
function normalizeSnapshot(data) {
  const normalized = { ...data, viewTime: data.viewTime || data.serverTime, sites: {}, services: {} };
  for (const id of ["factory", "warehouse"]) {
    const value = data.sites?.[id] || {};
    const site = {
      target: integer(value.target) ? value.target : null,
      completed: integer(value.completed) ? value.completed : null,
      status: ["normal", "warning", "error"].includes(value.status) ? value.status : "unknown",
      note: typeof value.note === "string" ? value.note : "기록 대기",
      processingState: ["completed", "paused", "waiting"].includes(value.processingState) ? value.processingState : time(value.processedAt) ? "completed" : "waiting"
    };
    for (const key of ["lastEventAt", "receivedAt", "processedAt"]) {
      site[key] = time(value[key]) && Date.parse(value[key]) <= Date.parse(normalized.viewTime) ? value[key] : null;
    }
    const history = value.history;
    site.history = Array.isArray(history) && history.length <= 24 &&
      history.every(point => point && time(point.timestamp) && Date.parse(point.timestamp) <= Date.parse(data.serverTime) && integer(point.quantity)) ?
      [...history].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)) : [];
    site.image = value.image && typeof value.image.url === "string" && typeof value.image.alt === "string" ? value.image : null;
    normalized.sites[id] = site;
  }
  const alerts = data.services?.alerts || {};
  normalized.services.alerts = {
    status: ["sent", "failed"].includes(alerts.status) ? alerts.status : "unknown",
    lastAttemptAt: time(alerts.lastAttemptAt) ? alerts.lastAttemptAt : null
  };
  return normalized;
}
// at이 있으면 그 기준 시각(과거)의 자료를 요청합니다.
async function readSnapshot(at = "") {
  if (typeof config.apiBaseUrl !== "string" || !/^https?:\/\//.test(config.apiBaseUrl)) throw new Error("API 연결 주소가 설정되지 않았습니다.");
  const data = await requestJson(apiUrl(config.apiBaseUrl, "/api/v1/snapshot", at ? new URLSearchParams({ at }) : ""));
  // 모양이 틀리면 실패로 처리해 마지막 성공 자료를 덮어쓰지 않습니다.
  const problem = validateSnapshot(data);
  if (problem) throw new Error(problem);
  if (at && (!time(data.viewTime) || Date.parse(data.viewTime) !== Date.parse(at))) throw new Error("요청한 기준 시각과 서버 자료의 시각이 다릅니다.");
  return normalizeSnapshot(data);
}

// 조회 상태는 마지막 성공 자료(lastData), 마지막 성공 시각(lastSuccessAt), 지금 오류 문구(errorText) 셋으로 나눠 둡니다.
// 실패해도 lastData를 지우지 않아 이전 값이 화면에 남습니다.
let lastData = null;
let lastSuccessAt = null;
let errorText = "";
let polling = false;
// 다음 조회 예약입니다. 예약 시각(nextPollAt)과 타이머를 함께 지웁니다.
const POLL_INTERVAL_MS = 10000;
let nextPollAt = null;
let pollTimer = null;
const refreshBtn = $("#refresh-btn");
const countdownText = $("#countdown-text");
// 고른 과거 기준 시각(현재면 "")과, 기준 시각이나 화면 주소가 바뀔 때마다 오르는 번호입니다.
// poll은 시작할 때의 번호를 기억했다가, 응답이 왔을 때 번호가 바뀌었으면 그 응답을 버립니다.
let selectedAt = "";
let viewGeneration = 0;
// 지난 render의 주소(# 부분)입니다. 같으면 "같은 화면", 다르면 "주소가 바뀐 뒤 처음 그림"으로 봅니다.
let renderedHash = null;

// 자료(snapshot) 하나를 받아 화면 전체 값을 채웁니다. 주소에 맞는 화면 하나만 보입니다.
function render(data = lastData) {
  // 받은 자료도 오류도 없으면 응답을 기다리는 중입니다.
  $("#page-content").setAttribute("aria-busy", !data && !errorText ? "true" : "false");
  const freshnessBadge = $("#freshness");
  freshnessBadge.textContent = errorText ? "조회 실패" : data ? "조회 정상" : "확인 중";
  freshnessBadge.className = "connection-status " + (errorText ? "danger" : data ? "good" : "neutral");
  $("#updated-at").textContent = lastSuccessAt ? "마지막 조회 성공: " + dateText(lastSuccessAt) : "조회 성공 기록이 없습니다.";
  updateViewControl();
  const notice = $("#data-errors");
  notice.hidden = !errorText;
  notice.textContent = errorText ? "현재 자료를 가져오지 못했습니다. " + errorText +
    (data ? " 아래 내용은 이전 조회 자료입니다." : " 조회할 자료가 없습니다.") : "";
  const { route, id, isUnknown } = resolveRoute(location.hash);
  const name = id === "factory" ? "생산" : "출고";
  $("#route-notice").hidden = !isUnknown;
  $("#back-link").hidden = route === "today";
  $("#today-view").hidden = route !== "today";
  $("#records-view").hidden = route !== "records";
  $("#queries-view").hidden = route !== "queries";
  $("#page-title").textContent = route === "records" ? "오늘 " + name + " 기록" : route === "queries" ? name + " 데이터 조회 기록" : "오늘 운영";
  $("#page-description").textContent = route === "records" ? "선택한 기준 시각까지의 기록입니다. 수량은 수정하지 않습니다." :
    route === "queries" ? "이 브라우저 탭의 최근 200건입니다. 실제 요청 시각과 조회 대상 시각을 구분합니다." : "생산·출고 실적과 운영 상태를 살펴봅니다.";
  const sameScreen = location.hash === renderedHash;
  renderedHash = location.hash;
  const queries = $("#queries-view");
  keepScroll(queries, () => queries.replaceChildren(...(route === "queries" ? [el("p", "notice", "조회 기록이 없습니다.")] : [])), sameScreen);
  if (route === "records") renderRecords(data, id, sameScreen);
  // 사건과 조회 실패를 합친 목록 하나로 알림 버튼·목록과 먼저 확인할 일을 함께 채웁니다.
  const issues = currentIssues(data, errorText);
  renderNotifications(issues);
  if (!data && !errorText) {
    // 첫 응답 전(조회 중이고 오류도 없음): 화면이 처음 열릴 때와 같은 "조회 중" 글자를 다시 씁니다.
    $("#hero").className = "hero neutral";
    $("#hero-owner").hidden = true;
    $("#hero-title").textContent = "자료 확인 중";
    $("#hero-action").textContent = "운영 담당자 · 서버 연결 후 기록을 확인할 수 있습니다.";
    renderSite("factory", { loading: true }, NaN);
    renderSite("warehouse", { loading: true }, NaN);
    const card = $("#alerts-status");
    card.className = "card status-card";
    setBadge(card.querySelector(".badge"), "loading");
    card.querySelector(".card-description").textContent = "알림 전송 정보를 가져오고 있습니다.";
    card.querySelector(".meta").textContent = "전송 시각 조회 중";
    return;
  }
  // 첫 조회부터 실패해 자료가 없으면 빈 자료로 그립니다. "조회 중"은 남지 않고 값 없음 표시가 됩니다.
  if (!data) data = normalizeSnapshot({ serverTime: new Date().toISOString(), sites: {}, services: {}, incidents: [] });
  renderHero(issues);

  const now = Date.parse(data.viewTime);
  renderSite("factory", data.sites.factory, now);
  renderSite("warehouse", data.sites.warehouse, now);

  const alerts = data.services.alerts;
  const card = $("#alerts-status");
  card.className = "card status-card" + (alerts.status === "failed" ? " danger" : "");
  setBadge(card.querySelector(".badge"), alerts.status);
  card.querySelector(".card-description").textContent = alerts.status === "sent" ? "알림 전송이 완료됐습니다." :
    alerts.status === "failed" ? "담당자에게 알림을 전달하지 못했습니다." : "전송 기록을 확인할 수 없습니다.";
  card.querySelector(".meta").textContent = "마지막 전송 시도: " + dateText(alerts.lastAttemptAt);
}

for (const [key, input] of [["from", $("#record-from")], ["to", $("#record-to")]]) {
  input.addEventListener("input", () => { if (key === "from") draftFrom = input.value; else draftTo = input.value; });
}
// "시간대 조회"는 표를 직접 그리지 않고 poll()에 맡깁니다. 조회 중이면 새 시간대만 기억해 두었다가 그 조회가 끝난 뒤 받습니다.
$("#record-filter").addEventListener("submit", (event) => {
  event.preventDefault();
  recordFrom = $("#record-from").value;
  recordTo = $("#record-to").value;
  recordsRequestId++;
  recordsLoading = false;
  recordsData = null;
  poll();
});
// 아래 이벤트는 페이지를 열 때 한 번만 붙입니다. render 때마다 다시 붙이지 않습니다.
for (const scroller of document.querySelectorAll(".graph-scroll")) {
  scroller.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    scroller.scrollLeft = event.key === "Home" ? 0 : event.key === "End" ? scroller.scrollWidth :
      scroller.scrollLeft + (event.key === "ArrowRight" ? 90 : -90);
  });
}
// "본문으로 이동"은 주소를 #main으로 바꾸지 않고 초점만 옮깁니다(없는 주소 안내가 뜨지 않게).
$(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  $("#main").focus({ preventScroll: true });
  $("#main").scrollIntoView({ block: "start" });
});
$("#header-alerts-link").addEventListener("click", () => toggleNotifications());
for (const btn of document.querySelectorAll(".help-btn")) setupHelp(btn);
document.addEventListener("click", (event) => {
  // "현재로 돌아가기"는 누르는 순간 다시 그려져 문서에서 떨어지지만, closest는 떨어진 버튼 자신도 찾습니다.
  if (!event.target.closest(".notification-wrap") && !event.target.closest(".inline-button")) toggleNotifications(false);
  if (!event.target.closest(".help-wrap")) for (const pop of openHelps()) closeHelp(pop);
});
// Escape는 이 처리기 하나에서 받아 열린 알림 목록과 도움말을 함께 닫습니다.
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!$("#notification-dropdown").hidden) {
    toggleNotifications(false);
    $("#header-alerts-link").focus();
  }
  for (const pop of openHelps()) {
    // 초점을 먼저 옮긴 뒤 닫습니다. 닫은 뒤에 옮기면 버튼의 focus 처리기가 다시 엽니다.
    pop.closest(".help-wrap").querySelector(".help-btn").focus();
    closeHelp(pop);
  }
});
window.addEventListener("resize", () => {
  for (const pop of openHelps()) positionHelpPopover(pop);
});
// 다른 화면으로 옮기면 기억한 시간대·고친 칸 값·받아 둔 기록을 비웁니다. 기록 화면으로 들어오면 바로 조회합니다.
window.addEventListener("hashchange", () => {
  viewGeneration++;
  recordsRequestId++;
  recordsLoading = false;
  recordsData = null; recordsError = ""; recordFrom = ""; recordTo = ""; draftFrom = ""; draftTo = "";
  window.scrollTo(0, 0);
  render();
  if (resolveRoute(location.hash).route === "records" && !polling) poll();
});
// ── 기준 시각 고르기 ──
// 선택지는 "현재"와 한국 시간 오늘 00:00부터 지금까지의 정시, 그리고 정시가 아닌 최근 조회 시각과 고른 시각입니다.
// 초점이 있는 동안에는 다시 만들지 않아 목록을 고르는 중에 10초 조회가 와도 위치가 풀리지 않습니다.
// 기준 시각을 바꾼 때(rebuild)는 초점이 있어도 한 번 다시 만듭니다. Chrome은 마우스로 고른 뒤에도 초점을 남기기 때문입니다.
function updateViewControl(rebuild = false) {
  const select = $("#view-time");
  if (rebuild || document.activeElement !== select) {
    const now = lastData?.serverTime || new Date().toISOString(), date = day(now);
    const current = el("option", "", "현재");
    current.value = "";
    const options = [current];
    for (let hour = 0; hour < 24; hour++) {
      const value = new Date(date + "T" + String(hour).padStart(2, "0") + ":00:00+09:00").toISOString();
      if (Date.parse(value) > Date.parse(now)) break;
      const option = el("option", "", String(hour).padStart(2, "0") + ":00");
      option.value = value;
      options.push(option);
    }
    const successTime = lastData?.serverTime;
    for (const value of [successTime, selectedAt].filter(Boolean)) {
      if (options.some(o => o.value === value) || day(value) !== date || Date.parse(value) > Date.parse(now)) continue;
      const option = el("option", "", localTime(value).slice(11) + (value === successTime ? " (최근 조회)" : ""));
      option.value = value;
      options.push(option);
    }
    select.replaceChildren(...options);
    select.value = selectedAt;
  }
  const context = $("#view-context");
  context.replaceChildren(el("span", "", selectedAt ? dateText(selectedAt) + " 기준 · 과거 자료" : "현재 시각 기준"));
  if (selectedAt) {
    const back = el("button", "inline-button", "현재로 돌아가기");
    back.type = "button";
    back.addEventListener("click", () => changeView(""));
    context.append(back);
  }
}
// 기준 시각을 바꿉니다. 예약한 조회와 이전 자료·오류·기록·기억한 시간대를 비우고 새 시각으로 다시 조회합니다.
function changeView(at) {
  clearSchedule();
  recordsRequestId++;
  recordsLoading = false;
  selectedAt = at;
  viewGeneration++;
  lastData = null; lastSuccessAt = null; errorText = "";
  recordsData = null; recordsError = ""; recordFrom = ""; recordTo = ""; draftFrom = ""; draftTo = "";
  updateCountdown();
  updateViewControl(true);
  render();
  // 조회 중이면 새 요청을 보내지 않습니다. 앞 조회가 끝나면 번호가 바뀐 것을 보고 바로 다시 조회합니다.
  if (!polling) poll();
}

// 조회는 이 함수 하나로 합니다. 조회 중이면 아무것도 하지 않아 요청이 겹치지 않습니다.
async function poll() {
  if (polling) return;
  clearSchedule();
  polling = true;
  const generation = viewGeneration, at = selectedAt;
  updateRefreshButton();
  try {
    const incoming = await readSnapshot(at);
    // 기준 시각이나 화면 주소가 바뀐 뒤 온 응답은 화면에 쓰지 않고 버립니다.
    if (generation !== viewGeneration) return;
    lastData = incoming;
    lastSuccessAt = new Date().toISOString();
    errorText = "";
    // 기록은 따로 받아 snapshot 화면 갱신을 기다리게 하지 않습니다.
    void loadRecords(incoming.viewTime, generation);
  } catch (error) {
    if (generation === viewGeneration) errorText = String(error?.message || error);
  } finally {
    polling = false;
    updateRefreshButton();
    render();
    // 번호가 바뀌었으면 10초를 기다리지 않고 바로 다시 조회하고, 같으면 10초 뒤를 예약합니다(응답이 온 뒤에 예약).
    if (generation !== viewGeneration) poll();
    else scheduleNextPoll();
  }
}
// 기록 화면에 있을 때 /api/v1/records로 기록을 받습니다.
async function loadRecords(at, generation) {
  const { route, id } = resolveRoute(location.hash);
  // 같은 화면의 기록 요청이 아직 진행 중이면 새로 보내지 않고 그 응답을 기다립니다.
  if (route !== "records" || recordsLoading) return;
  const requestId = ++recordsRequestId;
  recordsLoading = true;
  const params = new URLSearchParams({ kind: id === "factory" ? "production" : "shipment", at });
  if (recordFrom) params.set("from", new Date(recordFrom + "+09:00").toISOString());
  if (recordTo) params.set("to", new Date(recordTo + "+09:00").toISOString());
  try {
    const data = await requestJson(apiUrl(config.apiBaseUrl, "/api/v1/records", params));
    const problem = validateRecords(data, at);
    if (problem) throw new Error(problem);
    if (generation === viewGeneration && requestId === recordsRequestId) { recordsData = data; recordsError = ""; }
  } catch (error) {
    if (generation === viewGeneration && requestId === recordsRequestId) { recordsData = null; recordsError = String(error?.message || error); }
  } finally {
    if (requestId === recordsRequestId) recordsLoading = false;
    if (generation === viewGeneration && requestId === recordsRequestId) render();
  }
}
function clearSchedule() {
  clearTimeout(pollTimer);
  pollTimer = null;
  nextPollAt = null;
}
// 새로 예약하기 전에 늘 이전 예약을 지워 타이머가 두 개 이상 생기지 않게 합니다. 과거 시각에서는 자동 조회를 멈춥니다.
function scheduleNextPoll() {
  clearSchedule();
  if (selectedAt) { updateCountdown(); return; }
  nextPollAt = Date.now() + POLL_INTERVAL_MS;
  pollTimer = setTimeout(() => { clearSchedule(); poll(); }, POLL_INTERVAL_MS);
  updateCountdown();
}
// 0.25초마다 남은 초만 고칩니다. 숨긴 탭에서 타이머가 늦어 예약 시각이 지났으면 바로 조회합니다.
function updateCountdown() {
  // 과거 시각에서는 카운트다운을 숨깁니다.
  countdownText.hidden = !!selectedAt;
  if (selectedAt) return;
  if (polling || !nextPollAt) { countdownText.textContent = "조회 중…"; return; }
  const left = nextPollAt - Date.now();
  if (left <= 0) { clearSchedule(); poll(); return; }
  countdownText.textContent = "다음 조회 " + Math.max(1, Math.ceil(left / 1000)) + "초";
}
// 조회 중에는 disabled 대신 aria-disabled·aria-busy를 둡니다. 키보드 초점이 버튼에 남습니다.
function updateRefreshButton() {
  updateCountdown();
  refreshBtn.setAttribute("aria-disabled", String(polling));
  refreshBtn.setAttribute("aria-busy", String(polling));
  refreshBtn.classList.toggle("loading", polling);
}
$("#view-time").addEventListener("change", (event) => changeView(event.target.value));
refreshBtn.addEventListener("click", () => {
  if (polling) return;
  clearSchedule();
  poll();
});
// Enter를 누르고 있으면 응답마다 새 요청이 나가므로, 되풀이되는 Enter만 막습니다.
refreshBtn.addEventListener("keydown", (event) => {
  if (event.repeat && event.key === "Enter") event.preventDefault();
});
// 탭이 다시 보이면, 조회 중이 아니고 예약 시각이 지났을 때 바로 조회합니다.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;
  if (!polling && nextPollAt && Date.now() >= nextPollAt) { clearSchedule(); poll(); }
  else updateCountdown();
});
render();
poll();
setInterval(updateCountdown, 250);
