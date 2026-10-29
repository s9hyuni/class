// 예시 자료(sample-data.js)의 값으로 화면 글자를 채웁니다.
const snapshot = window.SAMPLE_SNAPSHOT;
const sites = [
  { id: "factory", noun: "생산", label: "텀블공장" },
  { id: "warehouse", noun: "출고", label: "물류창고" }
];
// 0 이상의 안전한 정수만 수량으로 씁니다. 틀린 값을 0으로 바꾸지 않습니다.
const integer = (value) => Number.isSafeInteger(value) && value >= 0;
const numberText = (value) => integer(value) ? value.toLocaleString("ko-KR") + "개" : "확인 불가";

for (const { id, noun, label } of sites) {
  const completed = snapshot.sites[id].completed;
  const target = snapshot.sites[id].target;
  const quantity = document.querySelectorAll("#" + id + "-quantity span");
  quantity[0].textContent = noun + " " + numberText(completed);
  quantity[1].textContent = "· 목표 " + numberText(target);

  const progressText = document.querySelector("#" + id + "-progress-text");
  const bar = document.querySelector("#" + id + "-progress");
  const exceeded = document.querySelector("#" + id + "-exceeded");
  if (!integer(completed) || !integer(target) || target === 0) {
    progressText.textContent = "계획 대비 목표를 확인해 주세요";
    bar.hidden = true;
    exceeded.hidden = true;
    continue;
  }
  // 달성률 = 실적 ÷ 목표 × 100. 글자는 소수점 한 자리, 막대는 계산값 그대로(100을 넘지 않게) 씁니다.
  const rate = completed / target * 100;
  const rateText = rate.toFixed(1) + "%";
  progressText.textContent = "계획 대비 " + rateText;
  bar.hidden = false;
  bar.value = Math.min(100, rate);
  bar.setAttribute("aria-label", label + " 목표 달성률 " + rateText);
  exceeded.hidden = !(completed > target);
}

// 시각을 한국 시간 "2026. 10. 26. 09:00:00" 꼴로 바꿉니다. hour12를 함께 쓰면 hourCycle이 무시되어 자정이 "24시"로 나올 수 있어 쓰지 않습니다.
const time = (value) => typeof value === "string" && Number.isFinite(Date.parse(value));
const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
});
const hourFormat = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", hour: "2-digit", hourCycle: "h23" });
const dateText = (value) => time(value) ? dateFormat.format(new Date(value)) : "기록 없음";
const hourText = (value) => time(value) ? hourFormat.format(new Date(value)) : "기록 없음";

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

for (const { id, label } of sites) {
  const box = document.querySelector("#" + id + "-graph");
  const points = snapshot.sites[id].history;
  const scroller = box.querySelector(".graph-scroll");
  const hasPoints = points.length > 0;
  box.querySelector(".loading-graph").hidden = true;
  box.querySelector(".graph-empty").hidden = hasPoints;
  box.querySelector(".graph-caption").hidden = !hasPoints;
  scroller.hidden = !hasPoints;
  scroller.replaceChildren(...(hasPoints ? [graphSvg(label, points)] : []));
}

// 상태 값과 화면 글자를 짝지은 객체입니다.
const statusNames = { normal: "정상", warning: "확인 필요", error: "오류", sent: "전송 성공", failed: "실패", unknown: "확인 불가", waiting: "대기" };
// 배지 하나를 상태에 맞게 바꿉니다. 객체에 없는 값은 "확인 필요"로 씁니다.
function setBadge(node, value) {
  const tone = ["normal", "sent"].includes(value) ? "good" : ["error", "failed"].includes(value) ? "danger" : "warning";
  node.className = "badge " + tone;
  node.textContent = statusNames[value] || "확인 필요";
}

// "지금"은 자료의 viewTime입니다. 마지막 기록이 몇 분 전인지와 30분을 넘었는지를 봅니다.
const now = Date.parse(snapshot.viewTime);
function ageText(value, current) {
  if (!time(value) || Date.parse(value) > current) return "시각 확인 필요";
  return Math.floor((current - Date.parse(value)) / 60000) + "분 전";
}
function siteStatus(site, current) {
  if (!time(site.lastEventAt) || Date.parse(site.lastEventAt) > current) return "waiting";
  if (current - Date.parse(site.lastEventAt) > 30 * 60000) return "warning";
  return site.status;
}

for (const { id } of sites) {
  const site = snapshot.sites[id];
  const card = document.querySelector("#" + id + "-status");
  const status = siteStatus(site, now);
  card.className = "card status-card" + (status === "error" ? " danger" : "");
  setBadge(card.querySelector(".badge"), status);
  card.querySelector(".card-description").textContent = site.note;
  card.querySelector(".meta").textContent = "기준 시각 대비: " + ageText(site.lastEventAt, now) + " · 발생 시각: " + dateText(site.lastEventAt);
}

const alerts = snapshot.services.alerts;
const alertsCard = document.querySelector("#alerts-status");
alertsCard.className = "card status-card" + (alerts.status === "failed" ? " danger" : "");
setBadge(alertsCard.querySelector(".badge"), alerts.status);
alertsCard.querySelector(".card-description").textContent = alerts.status === "sent" ? "알림 전송이 완료됐습니다." :
  alerts.status === "failed" ? "담당자에게 알림을 전달하지 못했습니다." : "전송 기록을 확인할 수 없습니다.";
alertsCard.querySelector(".meta").textContent = "마지막 전송 시도: " + dateText(alerts.lastAttemptAt);
