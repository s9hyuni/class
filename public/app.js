let lastData = null;
let draftFrom = "";
let draftTo = "";
let lastRenderedHash = window.location.hash;

function preserveScrollAndFocus(container, draw, sameScreen) {
  const scrollLeft = container.scrollLeft;
  const activeElement = container.contains(document.activeElement) ? document.activeElement : null;
  draw();
  if (!sameScreen) {
    container.scrollLeft = 0;
    return;
  }
  container.scrollLeft = scrollLeft;
  if (activeElement?.isConnected) activeElement.focus({ preventScroll: true });
}

function replaceWhenChanged(container, nextNode) {
  const current = container.firstElementChild;
  if (current && current.isEqualNode(nextNode)) return current;
  container.replaceChildren(nextNode);
  return nextNode;
}

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
});
const hourFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  hourCycle: "h23"
});

function formatQuantity(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value.toLocaleString("ko-KR") : "확인 불가";
}

function formatTime(value) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? timeFormatter.format(date) : "기록 없음";
}

function formatHour(value) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? `${hourFormatter.format(date).replace("시", "")}시` : "기록 없음";
}

function getFreshness(value, viewTime) {
  const eventTime = Date.parse(value);
  const currentTime = Date.parse(viewTime);
  if (typeof value !== "string" || !Number.isFinite(eventTime) || !Number.isFinite(currentTime) || eventTime > currentTime) {
    return { state: "missing", minutes: null };
  }
  const minutes = Math.floor((currentTime - eventTime) / 60_000);
  return { state: minutes > 30 ? "stale" : "fresh", minutes };
}

function getCompletion(site) {
  const completed = site?.completed;
  const target = site?.target;
  if (!Number.isSafeInteger(completed) || completed < 0 || !Number.isSafeInteger(target) || target < 0 || target === 0) {
    return { valid: false, completed, target };
  }
  const percentage = completed / target * 100;
  return { valid: true, completed, target, percentage, displayedPercentage: percentage.toFixed(1) };
}

function setBadge(element, status) {
  const badges = {
    normal: ["정상", "good"],
    warning: ["확인 필요", "warning"],
    error: ["오류", "danger"],
    sent: ["전송 성공", "good"],
    failed: ["실패", "danger"],
    unknown: ["확인 불가", "warning"],
    waiting: ["대기", "warning"]
  };
  const [label, color] = badges[status] || ["확인 필요", "warning"];
  element.textContent = label;
  element.className = `badge ${color}`;
}

function renderProductionCard(site, prefix, itemName) {
  const quantity = document.querySelector(`#${prefix}-quantity`);
  const progressText = document.querySelector(`#${prefix}-progress-text`);
  const progress = document.querySelector(`#${prefix}-progress`);
  const exceeded = document.querySelector(`#${prefix}-exceeded`);
  const completion = getCompletion(site);

  quantity.innerHTML = `<span>${itemName} ${formatQuantity(completion.completed)}개</span><span>· 목표 ${formatQuantity(completion.target)}개</span>`;
  if (!completion.valid) {
    progressText.textContent = "계획 대비 목표를 확인해 주세요";
    progress.hidden = true;
    exceeded.hidden = true;
    return;
  }

  progressText.textContent = `계획 대비 ${completion.displayedPercentage}%`;
  progress.value = Math.min(completion.percentage, 100);
  progress.setAttribute("aria-label", `${site.label} 목표 달성률 ${completion.displayedPercentage}%`);
  progress.hidden = false;
  exceeded.hidden = completion.completed <= completion.target;
}

function renderGraph(site, prefix) {
  const container = document.querySelector(`#${prefix}-graph`);
  const loading = container.querySelector(".loading-graph");
  const empty = container.querySelector("p[hidden]");
  const graph = container.querySelector(".graph-scroll");
  const previousScrollLeft = graph.scrollLeft;
  const caption = container.querySelector("p:last-child");
  const history = Array.isArray(site?.history) ? site.history : [];
  const validHistory = history.filter((entry) => typeof entry?.timestamp === "string" && Number.isFinite(Date.parse(entry.timestamp)) && Number.isSafeInteger(entry.quantity) && entry.quantity >= 0);

  loading.hidden = true;
  graph.hidden = false;
  caption.hidden = validHistory.length === 0;
  empty.hidden = validHistory.length !== 0;
  if (validHistory.length === 0) {
    graph.replaceChildren();
    graph.scrollLeft = 0;
    return;
  }

  const firstHour = Math.floor(Date.parse(validHistory[0].timestamp) / 3_600_000);
  const lastHour = Math.floor(Date.parse(validHistory[validHistory.length - 1].timestamp) / 3_600_000);
  const byHour = new Map(validHistory.map((entry) => [Math.floor(Date.parse(entry.timestamp) / 3_600_000), entry]));
  const slots = Array.from({ length: lastHour - firstHour + 1 }, (_, index) => ({ hour: firstHour + index, entry: byHour.get(firstHour + index) }));
  const width = Math.max(slots.length * 90, 90);
  const height = 190;
  const chartBottom = 150;
  const chartHeight = 126;
  const maxQuantity = Math.max(...validHistory.map((entry) => entry.quantity), 1);
  const accessibleRecords = validHistory.map((entry) => `${formatTime(entry.timestamp)} ${formatQuantity(entry.quantity)}개`).join(", ");
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${site.label} 시간별 완료 수량: ${accessibleRecords}">`,
    `<text x="8" y="16" fill="currentColor" font-size="12">개</text>`,
    `<line x1="0" y1="${chartBottom}" x2="${width}" y2="${chartBottom}" stroke="#d9dfda" />`
  ];

  for (const [index, slot] of slots.entries()) {
    const x = index * 90;
    const quantity = slot.entry?.quantity;
    const barHeight = quantity === undefined ? 0 : quantity / maxQuantity * chartHeight;
    const y = chartBottom - barHeight;
    if (slot.entry) {
      parts.push(`<text x="${x + 45}" y="${Math.max(y - 6, 22)}" text-anchor="middle" fill="#252a27" font-size="12">${formatQuantity(quantity)}</text>`);
      parts.push(`<rect x="${x + 20}" y="${y}" width="50" height="${barHeight}" rx="4" fill="#557a61" />`);
    }
    parts.push(`<text x="${x + 45}" y="${height - 8}" text-anchor="middle" fill="#66706a" font-size="12">${formatHour(new Date(slot.hour * 3_600_000).toISOString())}</text>`);
  }
  parts.push("</svg>");
  graph.innerHTML = parts.join("");
  graph.scrollLeft = previousScrollLeft;
}

function renderSiteStatus(site, prefix, viewTime) {
  const card = document.querySelector(`#${prefix}-status`);
  const badge = card.querySelector(".badge");
  const description = card.querySelector(".status-line + p");
  const meta = card.querySelector(".meta");
  const freshness = getFreshness(site?.lastEventAt, viewTime);
  const status = freshness.state === "missing" ? "waiting" : freshness.state === "stale" ? "warning" : site?.status;
  setBadge(badge, status);
  description.textContent = site?.note || "확인 불가";
  const ageText = freshness.minutes === null ? "시각 확인 필요" : `${freshness.minutes}분 전`;
  meta.textContent = `기준 시각 대비: ${ageText} · 발생 시각: ${formatTime(site?.lastEventAt)}`;
  card.classList.toggle("danger", status === "error");
}

function renderAlertStatus(alerts) {
  const card = document.querySelector("#alerts-status");
  const badge = card.querySelector(".badge");
  const description = card.querySelector(".status-line + p");
  const meta = card.querySelector(".meta");
  setBadge(badge, alerts?.status);
  description.textContent = alerts?.status === "sent" ? "알림 전송이 완료됐습니다." : alerts?.status === "failed" ? "담당자에게 알림을 전달하지 못했습니다." : "전송 기록을 확인할 수 없습니다.";
  meta.textContent = `마지막 전송 시도: ${formatTime(alerts?.lastAttemptAt)}`;
  card.classList.toggle("danger", alerts?.status === "failed");
}

function getVisibleIncidents(data) {
  const incidents = Array.isArray(data?.incidents) ? data.incidents : [];
  const seen = new Set();
  return incidents
    .filter((incident) => {
      if (!incident?.id || incident.id === "PREDICTION-JOB" || seen.has(incident.id)) return false;
      seen.add(incident.id);
      return true;
    })
    .sort((a, b) => Number(b.level === "error") - Number(a.level === "error"));
}

function renderNotifications(data) {
  const button = document.querySelector("#header-alerts-link");
  const text = button.querySelector(".alerts-text");
  const list = document.querySelector("#notification-dropdown");
  const incidents = getVisibleIncidents(data);
  const isOpen = !list.hidden;
  const countText = `알림 ${incidents.length}건`;
  text.textContent = countText;
  button.setAttribute("aria-label", countText);
  const hasError = incidents.some((incident) => incident.level === "error");
  button.className = `alerts-link ${hasError ? "danger" : incidents.length ? "warning" : "good"}`;
  button.setAttribute("aria-expanded", String(isOpen));
  list.replaceChildren();

  const heading = document.createElement("h2");
  heading.textContent = "알림";
  list.append(heading);
  if (incidents.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "확인할 알림이 없습니다.";
    list.append(empty);
  } else {
    for (const incident of incidents) {
      const item = document.createElement("article");
      item.className = "notification-item";
      const title = document.createElement("h3");
      title.textContent = incident.title || "확인할 알림";
      const owner = document.createElement("p");
      owner.textContent = `담당자: ${incident.owner || "확인 불가"}`;
      const action = document.createElement("p");
      action.textContent = `할 일: ${incident.action || "확인 불가"}`;
      item.append(title, owner, action);
      list.append(item);
    }
  }
}

function renderHero(data) {
  const hero = document.querySelector(".hero");
  const owner = document.querySelector("#hero-owner");
  const title = document.querySelector("#hero-title");
  const emptyMessage = document.querySelector("#hero-empty");
  const ownerAction = document.querySelector("#hero-action");
  const incidents = getVisibleIncidents(data);
  const first = incidents[0];

  if (!first) {
    hero.classList.remove("danger");
    hero.classList.add("neutral");
    title.textContent = "우선 확인할 문제가 없습니다.";
    owner.hidden = true;
    owner.textContent = "";
    emptyMessage.hidden = false;
    emptyMessage.textContent = "우선 확인할 문제가 없습니다.";
    ownerAction.hidden = false;
    ownerAction.textContent = "운영 담당자 · 기록 갱신 상태를 계속 확인해 주세요.";
    return;
  }

  hero.classList.remove("neutral");
  hero.classList.add("danger");
  title.textContent = first.title || "확인할 알림";
  owner.textContent = first.owner ? `담당자: ${first.owner}` : "담당자: 확인 불가";
  owner.hidden = false;
  ownerAction.textContent = first.action || "할 일: 확인 불가";
  ownerAction.hidden = false;
  emptyMessage.hidden = true;
}

function renderFlow(site, prefix, viewTime) {
  const card = document.querySelector(`#${prefix}-flow`);
  const badge = card.querySelector(".badge");
  const note = card.querySelector(".flow-note");
  const list = card.querySelector(".time-list");
  const freshness = getFreshness(site?.lastEventAt, viewTime);
  const status = freshness.state === "missing" ? "waiting" : freshness.state === "stale" ? "warning" : site?.status;
  setBadge(badge, status);
  note.textContent = site?.note || "확인 불가";

  if (freshness.state === "missing" && !card.querySelector(".notice")) {
    const waiting = document.createElement("p");
    waiting.className = "notice";
    waiting.textContent = "현장 기록을 기다리고 있습니다.";
    card.insertBefore(waiting, list);
  }

  const rows = [["lastEventAt", "기록 발생"], ["receivedAt", "서버 접수"], ["processedAt", "서버 처리"]];
  list.replaceChildren(...rows.map(([key, label]) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const value = document.createElement("dd");
    term.textContent = label;
    value.textContent = key === "processedAt" && site?.processingState === "paused" ? "처리 중단" : formatTime(site?.[key]) === "기록 없음" ? "기록 대기" : formatTime(site[key]);
    row.append(term, value);
    return row;
  }));
}

function formatLocalDateTime(value) {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`;
}

function recordStatusLabel(status) {
  if (status === "completed") return "완료";
  if (status === "receipt-wait") return "접수 대기";
  return "처리 대기";
}

function renderRecords(data, siteId, selectedFrom = "", selectedTo = "", sameScreen = false) {
  const viewTime = data?.viewTime || data?.serverTime;
  const now = typeof viewTime === "string" && Number.isFinite(Date.parse(viewTime)) ? new Date(viewTime) : new Date(0);
  const dayStart = new Date(now);
  dayStart.setUTCHours(0, 0, 0, 0);
  const fromInput = document.querySelector("#record-from");
  const toInput = document.querySelector("#record-to");
  const result = document.querySelector("#records-result");
  fromInput.value = selectedFrom || draftFrom || formatLocalDateTime(dayStart.toISOString());
  toInput.value = selectedTo || draftTo || formatLocalDateTime(now.toISOString());
  draftFrom = fromInput.value;
  draftTo = toInput.value;
  fromInput.min = fromInput.value.slice(0, 10) + "T00:00:00";
  fromInput.max = toInput.value;
  toInput.min = fromInput.min;
  toInput.max = toInput.value;

  const records = siteId === "factory" ? window.SAMPLE_RECORDS?.production : window.SAMPLE_RECORDS?.shipment;
  const from = Date.parse(fromInput.value + "+09:00");
  const to = Date.parse(toInput.value + "+09:00");
  const rows = (Number.isFinite(from) && Number.isFinite(to) && from <= to ? (Array.isArray(records) ? records : []) : [])
    .filter((record) => {
      const occurredAt = Date.parse(record.occurredAt);
      return Number.isFinite(occurredAt) && from <= occurredAt && occurredAt <= to;
    })
    .sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt));

  if (rows.length === 0) {
    const empty = document.createElement("p");
    empty.className = "notice";
    empty.textContent = "선택한 시간대에 기록이 없습니다.";
    preserveScrollAndFocus(result.closest(".table-scroll"), () => replaceWhenChanged(result, empty), sameScreen);
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const label of ["발생 시각", "수량", "서버 접수", "서버 처리", "상태"]) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    headerRow.append(th);
  }
  thead.append(headerRow);
  table.append(thead);
  const tbody = document.createElement("tbody");
  for (const record of rows) {
    const tr = document.createElement("tr");
    const values = [
      formatTime(record.occurredAt),
      `${formatQuantity(record.quantity)}개`,
      record.receivedAt ? formatTime(record.receivedAt) : "접수 대기",
      record.processedAt ? formatTime(record.processedAt) : "처리 대기",
      recordStatusLabel(record.status)
    ];
    for (const text of values) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
  preserveScrollAndFocus(result.closest(".table-scroll"), () => replaceWhenChanged(result, table), sameScreen);
}

function resolveRoute(hash) {
  const routes = {
    "#/today": { page: "today" },
    "#/records/factory": { page: "records", site: "factory", title: "오늘 생산 기록" },
    "#/records/warehouse": { page: "records", site: "warehouse", title: "오늘 출고 기록" },
    "#/queries/factory": { page: "queries", site: "factory", title: "생산 데이터 조회 기록" },
    "#/queries/warehouse": { page: "queries", site: "warehouse", title: "출고 데이터 조회 기록" }
  };
  if (!hash || hash === "#" || hash === "#/") return { ...routes["#/today"], unknown: false };
  return routes[hash] ? { ...routes[hash], unknown: false } : { ...routes["#/today"], unknown: true };
}

function render(data = lastData || window.SAMPLE_SNAPSHOT) {
  if (data) lastData = data;
  const currentHash = window.location.hash;
  const sameScreen = currentHash === lastRenderedHash;
  const route = resolveRoute(currentHash);
  const viewTime = lastData?.viewTime || lastData?.serverTime;
  const today = document.querySelector("#today-view");
  const result = document.querySelector("#records-result");
  const records = document.querySelector("#records-view");
  const queries = document.querySelector("#queries-view");
  const queriesScroll = document.querySelector("#queries-scroll");
  const queriesEmpty = document.querySelector("#queries-empty");
  const notice = document.querySelector("#route-notice");
  const back = document.querySelector("#back-link");
  const title = document.querySelector("#page-title");
  const description = document.querySelector("#page-description");

  today.hidden = route.page !== "today";
  records.hidden = route.page !== "records";
  queries.hidden = route.page !== "queries";
  notice.hidden = !route.unknown;
  back.hidden = route.page === "today";
  title.textContent = route.title || "오늘 운영";
  description.textContent = route.page === "records"
    ? "선택한 기준 시각까지의 기록입니다. 수량은 수정하지 않습니다."
    : route.page === "queries"
      ? "이 브라우저 탭의 최근 200건입니다. 실제 요청 시각과 조회 대상 시각을 구분합니다."
      : "생산·출고 실적과 운영 상태를 살펴봅니다.";

  if (route.unknown) {
    today.hidden = false;
  }
  if (route.page === "records") {
    const from = document.querySelector("#record-from").value;
    const to = document.querySelector("#record-to").value;
    renderRecords(lastData, route.site, from, to, sameScreen);
    lastRenderedHash = currentHash;
    return;
  }
  if (route.page === "queries") {
    preserveScrollAndFocus(queriesScroll, () => replaceWhenChanged(queriesScroll, queriesEmpty), sameScreen);
    lastRenderedHash = currentHash;
    return;
  }
  if (route.page !== "today" && !route.unknown) {
    lastRenderedHash = currentHash;
    return;
  }

  renderProductionCard(lastData?.sites?.factory, "factory", "생산");
  renderProductionCard(lastData?.sites?.warehouse, "warehouse", "출고");
  renderGraph(lastData?.sites?.factory, "factory");
  renderGraph(lastData?.sites?.warehouse, "warehouse");
  renderSiteStatus(lastData?.sites?.factory, "factory", viewTime);
  renderSiteStatus(lastData?.sites?.warehouse, "warehouse", viewTime);
  renderAlertStatus(lastData?.services?.alerts);
  renderNotifications(lastData);
  if (route.page === "today" || route.unknown) renderHero(lastData);
  renderFlow(lastData?.sites?.factory, "factory", viewTime);
  renderFlow(lastData?.sites?.warehouse, "warehouse", viewTime);
  lastRenderedHash = currentHash;
}

document.querySelector("#record-filter").addEventListener("submit", (event) => {
  event.preventDefault();
  const route = resolveRoute(window.location.hash);
  if (route.page !== "records") return;
  const from = document.querySelector("#record-from").value;
  const to = document.querySelector("#record-to").value;
  if (Date.parse(from + "+09:00") > Date.parse(to + "+09:00")) {
    document.querySelector("#record-to").setCustomValidity("끝 시각은 시작 시각과 같거나 늦어야 합니다.");
    document.querySelector("#record-to").reportValidity();
    return;
  }
  draftFrom = from;
  draftTo = to;
  document.querySelector("#record-to").setCustomValidity("");
  render(lastData);
});

document.querySelector("#record-from").addEventListener("input", () => {
  const from = document.querySelector("#record-from");
  const to = document.querySelector("#record-to");
  draftFrom = from.value;
  if (from.value) to.min = from.value;
  document.querySelector("#record-to").setCustomValidity("");
});
document.querySelector("#record-to").addEventListener("input", () => {
  const from = document.querySelector("#record-from");
  const to = document.querySelector("#record-to");
  draftTo = to.value;
  if (to.value) from.max = to.value;
  document.querySelector("#record-to").setCustomValidity("");
});

const alertButton = document.querySelector("#header-alerts-link");
const notificationDropdown = document.querySelector("#notification-dropdown");

document.querySelector(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  const main = document.querySelector("#main");
  main.focus();
  main.scrollIntoView({ block: "start" });
});

function setHelpOpen(button, open) {
  const popover = document.querySelector(`#${button.getAttribute("aria-controls")}`);
  button.setAttribute("aria-expanded", String(open));
  popover.hidden = !open;
  button.dataset.pinned = String(open && button.dataset.pinned === "true");
  if (open) positionHelpPopover(button);
}

function closeHelp(button) {
  button.dataset.pinned = "false";
  setHelpOpen(button, false);
}

function openHelp(button) {
  for (const other of document.querySelectorAll(".help-btn")) {
    if (other !== button) closeHelp(other);
  }
  setNotificationsOpen(false);
  button.dataset.pinned = "false";
  setHelpOpen(button, true);
}

function positionHelpPopover(button) {
  const popover = document.querySelector(`#${button.getAttribute("aria-controls")}`);
  if (popover.hidden) return;
  const wrap = button.closest(".help-wrap");
  const card = wrap.closest(".card, .hero");
  const bounds = (card || document.documentElement).getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const gap = 16;
  const width = Math.min(320, Math.max(Math.min(bounds.width, viewportWidth) - gap * 2, 0));
  const buttonBounds = button.getBoundingClientRect();
  const leftInScope = card ? buttonBounds.left - bounds.left : buttonBounds.left;
  const left = Math.min(Math.max(leftInScope, gap), Math.max(Math.min(bounds.width, viewportWidth) - width - gap, gap));
  popover.style.width = `${width}px`;
  popover.style.left = `${left}px`;
  popover.style.top = `${buttonBounds.bottom - bounds.top + 8}px`;
}

function closeAllHelps() {
  for (const button of document.querySelectorAll(".help-btn")) closeHelp(button);
}

for (const button of document.querySelectorAll(".help-btn")) {
  const wrap = button.closest(".help-wrap");
  button.addEventListener("click", () => {
    const pinned = button.dataset.pinned === "true";
    if (pinned) closeHelp(button);
    else {
      openHelp(button);
      button.dataset.pinned = "true";
    }
  });
  wrap.addEventListener("mouseenter", () => {
    if (button.getAttribute("aria-expanded") !== "true") openHelp(button);
  });
  wrap.addEventListener("mouseleave", () => {
    if (button.dataset.pinned !== "true" && !wrap.contains(document.activeElement)) closeHelp(button);
  });
  wrap.addEventListener("focusin", () => {
    if (button.getAttribute("aria-expanded") !== "true") openHelp(button);
  });
  wrap.addEventListener("focusout", () => {
    queueMicrotask(() => {
      if (button.dataset.pinned !== "true" && !wrap.contains(document.activeElement)) closeHelp(button);
    });
  });
}

for (const graph of document.querySelectorAll(".graph-scroll")) {
  graph.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") graph.scrollLeft = Math.max(0, graph.scrollLeft - 90);
    else if (event.key === "ArrowRight") graph.scrollLeft = Math.min(graph.scrollWidth - graph.clientWidth, graph.scrollLeft + 90);
    else if (event.key === "Home") graph.scrollLeft = 0;
    else graph.scrollLeft = graph.scrollWidth - graph.clientWidth;
  });
}

function setNotificationsOpen(open) {
  notificationDropdown.hidden = !open;
  alertButton.setAttribute("aria-expanded", String(open));
}

alertButton.addEventListener("click", () => {
  closeAllHelps();
  setNotificationsOpen(notificationDropdown.hidden);
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".notification-wrap")) setNotificationsOpen(false);
  if (!event.target.closest(".help-wrap")) closeAllHelps();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !notificationDropdown.hidden) {
    setNotificationsOpen(false);
    alertButton.focus();
  }
});

window.addEventListener("resize", () => {
  for (const button of document.querySelectorAll('.help-btn[aria-expanded="true"]')) positionHelpPopover(button);
});

window.addEventListener("hashchange", () => {
  render();
  window.scrollTo(0, 0);
});

render();