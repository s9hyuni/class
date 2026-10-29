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
// 배지 하나를 상태에 맞게 바꿉니다. 객체에 없는 값은 "확인 필요"로 씁니다.
function setBadge(node, value) {
  const tone = ["normal", "sent"].includes(value) ? "good" : ["error", "failed"].includes(value) ? "danger" : "warning";
  node.className = "badge " + tone;
  node.textContent = statusNames[value] || "확인 필요";
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
// 그래프 칸(.graph-scroll) 안쪽만 새로 그립니다.
function renderGraph(box, label, points) {
  const scroller = box.querySelector(".graph-scroll");
  const hasPoints = Array.isArray(points) && points.length > 0;
  box.querySelector(".loading-graph").hidden = true;
  box.querySelector(".graph-empty").hidden = hasPoints;
  box.querySelector(".graph-caption").hidden = !hasPoints;
  scroller.hidden = !hasPoints;
  scroller.replaceChildren(...(hasPoints ? [graphSvg(label, points)] : []));
}

// ── 기록 처리 상태 카드 안쪽 ──
function timelineContent(label, site, now) {
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
function renderSite(id, site, now) {
  const { noun, label } = siteNames[id];
  const quantity = $("#" + id + "-quantity").querySelectorAll("span");
  quantity[0].textContent = noun + " " + numberText(site.completed);
  quantity[1].textContent = "· 목표 " + numberText(site.target);
  $("#" + id + "-progress-text").textContent = "계획 대비 " + progressText(site.completed, site.target);
  const valid = integer(site.completed) && integer(site.target) && site.target !== 0;
  const bar = $("#" + id + "-progress");
  bar.hidden = !valid;
  if (valid) {
    bar.value = Math.min(100, site.completed / site.target * 100);
    bar.setAttribute("aria-label", label + " 목표 달성률 " + progressText(site.completed, site.target));
  }
  $("#" + id + "-exceeded").hidden = !(valid && site.completed > site.target);
  renderGraph($("#" + id + "-graph"), label, site.history);

  const age = freshness(site.lastEventAt, now);
  const status = age === "missing" ? "waiting" : age === "stale" ? "warning" : site.status;
  const card = $("#" + id + "-status");
  card.className = "card status-card" + (status === "error" ? " danger" : "");
  setBadge(card.querySelector(".badge"), status);
  card.querySelector(".card-description").textContent = site.note;
  card.querySelector(".meta").textContent = "기준 시각 대비: " + ageText(site.lastEventAt, now) + " · 발생 시각: " + dateText(site.lastEventAt);
  $("#" + id + "-flow").replaceChildren(...timelineContent(label, site, now));
}

// 자료(snapshot) 하나를 받아 화면 전체 값을 채웁니다.
function render(data) {
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

render(window.SAMPLE_SNAPSHOT);
