let lastData = null;
let lastSuccessfulData = null;
let lastSuccessAt = null;
let currentError = "";
let recordsRequestId = 0;
let recordsViewGeneration = 0;
let recordsRequest = null;
let recordsData = null;
let recordsError = "";
let submittedFrom = "";
let submittedTo = "";
let pendingRecordRange = null;
let renderedRecordsKey = "";
let selectedAt = "";
let viewGeneration = 0;
let pendingSnapshotAt = null;
let snapshotRequest = null;
let draftFrom = "";
let draftTo = "";
let lastRenderedHash = window.location.hash;
const dashboardConfig = window.DASHBOARD_CONFIG || {};
const timeoutMs = Number.isFinite(dashboardConfig.timeoutMs) ? dashboardConfig.timeoutMs : 5000;
const pollIntervalMs = 10000;
const refreshButton = document.querySelector("#refresh-btn");
const countdownText = document.querySelector("#countdown-text");
let polling = false;
let pollTimer = null;
let countdownTimer = null;
let nextPollAt = null;
const queryLogStorageKey = "tumble-query-log";
const queryLogLimit = 200;
let queryLog = loadQueryLog();
let pageIsLeaving = false;
let selectedQueryAt = "";

function apiUrl(baseUrl, path, params = "") {
  const base = baseUrl.replace(/\/$/, "");
  const query = String(params);
  if (base.endsWith("/exec")) {
    return `${base}?path=${encodeURIComponent(path)}${query ? `&${query}` : ""}`;
  }
  return `${base}${path}${query ? `?${query}` : ""}`;
}

function isQueryLogEntry(entry) {
  return Boolean(
    entry &&
    typeof entry === "object" &&
    typeof entry.requestedAt === "string" && Number.isFinite(Date.parse(entry.requestedAt)) &&
    typeof entry.at === "string" &&
    typeof entry.ok === "boolean" &&
    Number.isSafeInteger(entry.durationMs) && entry.durationMs >= 0 &&
    entry.available && typeof entry.available === "object" &&
    (entry.available.factory === null || typeof entry.available.factory === "boolean") &&
    (entry.available.warehouse === null || typeof entry.available.warehouse === "boolean") &&
    typeof entry.error === "string"
  );
}

function loadQueryLog() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(queryLogStorageKey) || "[]");
    return Array.isArray(saved) ? saved.filter(isQueryLogEntry).slice(-queryLogLimit) : [];
  } catch {
    return [];
  }
}

function saveQueryLog() {
  try {
    sessionStorage.setItem(queryLogStorageKey, JSON.stringify(queryLog));
  } catch {
    // The in-memory log remains available if session storage is unavailable.
  }
}

function queryAvailability(site) {
  return Number.isSafeInteger(site?.completed) && site.completed >= 0 &&
    Number.isSafeInteger(site?.target) && site.target >= 0;
}

function queryErrorSummary(message) {
  const firstSentence = String(message || "").split(/(?<=\.)\s/, 1)[0];
  return firstSentence.length > 60 ? `${firstSentence.slice(0, 60)}…` : firstSentence;
}

function recordQueryResult({ requestedAt, at, startedAt, ok, snapshot = null, error = "" }) {
  const entry = {
    requestedAt,
    at: at || "",
    ok,
    durationMs: Math.max(0, Math.round(performance.now() - startedAt)),
    available: {
      factory: queryAvailability(snapshot?.sites?.factory),
      warehouse: queryAvailability(snapshot?.sites?.warehouse)
    },
    error: ok ? "" : queryErrorSummary(error)
  };
  queryLog.push(entry);
  if (queryLog.length > queryLogLimit) queryLog = queryLog.slice(-queryLogLimit);
  saveQueryLog();
  renderQueryCards();
  const route = resolveRoute(window.location.hash);
  if (route.page === "queries") render(route);
}

function renderQueryCards() {
  const latest = queryLog.at(-1);
  for (const site of ["factory", "warehouse"]) {
    const query = document.querySelector(`#${site}-query`);
    const meta = document.querySelector(`#${site}-query-meta`);
    if (!latest) {
      query.textContent = "조회 기록 없음";
      meta.textContent = "";
      meta.hidden = true;
      continue;
    }

    query.textContent = `${formatTime(latest.requestedAt)} · ${latest.ok ? "조회 성공" : "조회 실패"}`;
    meta.hidden = false;
    meta.textContent = latest.ok
      ? `응답시간: ${latest.durationMs}ms · ${latest.available[site] ? "현장 값 제공" : "현장 값 누락"}`
      : "자료를 받지 못했습니다.";
  }
}

function queryResultForSite(entry, site) {
  if (!entry.ok) return { label: "조회 실패", status: "danger" };
  return entry.available[site]
    ? { label: "자료 제공", status: "good" }
    : { label: "현장 값 누락", status: "warning" };
}

function queryHistoryLabel(entry, site) {
  const result = queryResultForSite(entry, site);
  const requestedAt = formatTime(entry.requestedAt);
  const viewAt = entry.at ? formatTime(entry.at) : "현재";
  return `${requestedAt} · ${result.label} · ${entry.durationMs}ms · 기준 시각: ${viewAt}`;
}

function renderQueries(route) {
  const summary = document.querySelector("#queries-summary");
  const history = document.querySelector("#queries-history");
  const empty = document.querySelector("#queries-empty");
  const detail = document.querySelector("#queries-detail");
  const range = document.querySelector("#queries-range");
  const legend = document.querySelector("#queries-legend");
  const tableScroll = document.querySelector("#queries-scroll");
  const emptyTable = document.querySelector("#queries-empty-table");
  const entries = queryLog.slice(-queryLogLimit);
  const ordered = [...entries].sort((a, b) => Date.parse(a.requestedAt) - Date.parse(b.requestedAt));
  const sameScreen = window.location.hash === lastRenderedHash;
  if (!sameScreen) selectedQueryAt = "";
  const selectedAt = sameScreen ? selectedQueryAt : "";
  const historyScrollLeft = sameScreen ? history.scrollLeft : 0;
  const tableScrollLeft = sameScreen ? tableScroll.scrollLeft : 0;
  const hadHistoryFocus = sameScreen && history.contains(document.activeElement);
  const focusedAt = hadHistoryFocus ? document.activeElement.getAttribute("data-at") : "";

  summary.replaceChildren();
  history.replaceChildren();
  empty.hidden = ordered.length > 0;
  history.hidden = ordered.length === 0;
  detail.textContent = "막대 하나가 조회 한 번입니다. 막대를 선택하면 시각과 결과를 확인할 수 있습니다.";
  range.replaceChildren();
  range.hidden = true;
  legend.hidden = ordered.length === 0;
  tableScroll.replaceChildren();
  tableScroll.hidden = ordered.length === 0;
  emptyTable.hidden = ordered.length > 0;

  const siteName = route.site === "warehouse" ? "출고" : "생산";
  const card = document.createElement("article");
  card.className = "card query-summary-card";
  const heading = document.createElement("h2");
  heading.textContent = `${siteName} 데이터 조회`;
  const resultText = document.createElement("p");
  resultText.className = "badge neutral";
  resultText.setAttribute("aria-label", "조회 상태 이력");
  const latest = ordered.at(-1);
  if (latest) {
    const result = queryResultForSite(latest, route.site);
    resultText.textContent = result.label;
    resultText.className = `badge ${result.status}`;
    resultText.title = queryHistoryLabel(latest, route.site);
  } else {
    resultText.textContent = "조회 기록 없음";
    const message = document.createElement("p");
    message.textContent = "아직 조회 기록이 없습니다.";
    card.append(heading, resultText, message);
    summary.append(card);
    return;
  }
  card.append(heading, resultText);
  summary.append(card);

  for (const entry of ordered) {
    const result = queryResultForSite(entry, route.site);
    const bar = document.createElement("button");
    bar.type = "button";
    bar.className = `history-bar ${result.status}`;
    bar.setAttribute("data-at", entry.requestedAt);
    bar.title = queryHistoryLabel(entry, route.site);
    bar.setAttribute("aria-label", bar.title);
    bar.addEventListener("click", () => {
      selectedQueryAt = entry.requestedAt;
      detail.textContent = queryHistoryLabel(entry, route.site);
    });
    bar.addEventListener("focus", () => {
      selectedQueryAt = entry.requestedAt;
      detail.textContent = queryHistoryLabel(entry, route.site);
    });
    bar.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        selectedQueryAt = entry.requestedAt;
        detail.textContent = queryHistoryLabel(entry, route.site);
      }
    });
    history.append(bar);
  }

  const successfulCount = ordered.filter((entry) => entry.ok).length;
  const successRate = ordered.length ? (successfulCount / ordered.length) * 100 : 0;
  const rangeStart = document.createElement("span");
  rangeStart.textContent = formatTime(ordered[0].requestedAt);
  const strong = document.createElement("strong");
  strong.textContent = `조회 성공률 ${successRate.toFixed(1)}% · ${ordered.length}건`;
  const rangeEnd = document.createElement("span");
  rangeEnd.textContent = formatTime(ordered.at(-1).requestedAt);
  range.className = "history-range";
  range.append(rangeStart, strong, rangeEnd);
  range.hidden = false;

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headingRow = document.createElement("tr");
  for (const label of ["요청 시각", "기준 시각", "조회 결과", "응답시간", "현장 값", "실패 이유"]) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    headingRow.append(th);
  }
  thead.append(headingRow);
  table.append(thead);
  const tbody = document.createElement("tbody");
  for (const entry of [...ordered].reverse()) {
    const tr = document.createElement("tr");
    const siteResult = queryResultForSite(entry, route.site);
    const values = [
      formatTime(entry.requestedAt),
      entry.at ? formatTime(entry.at) : "현재",
      entry.ok ? "성공" : "실패",
      `${entry.durationMs}ms`,
      entry.ok ? (entry.available[route.site] ? "제공" : "누락") : "확인 불가",
      entry.error || "—"
    ];
    tr.dataset.status = siteResult.status;
    for (const text of values) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
  tableScroll.setAttribute("aria-label", "기록 표. 좌우로 이동할 수 있습니다.");
  tableScroll.append(table);

  history.scrollLeft = historyScrollLeft;
  tableScroll.scrollLeft = tableScrollLeft;
  if (selectedAt) {
    const selectedEntry = ordered.find((entry) => entry.requestedAt === selectedAt);
    if (selectedEntry) detail.textContent = queryHistoryLabel(selectedEntry, route.site);
    else selectedQueryAt = "";
  } else if (!sameScreen) {
    selectedQueryAt = "";
  }
  if (focusedAt) {
    const focusTarget = [...history.querySelectorAll(".history-bar")]
      .find((bar) => bar.getAttribute("data-at") === focusedAt);
    focusTarget?.focus({ preventScroll: true });
  }
}

window.addEventListener("beforeunload", () => {
  pageIsLeaving = true;
});
window.addEventListener("pagehide", () => {
  pageIsLeaving = true;
});
window.addEventListener("pageshow", () => {
  pageIsLeaving = false;
});

document.addEventListener("DOMContentLoaded", renderQueryCards, { once: true });

function cleanSnapshot(snapshot) {
  const viewTime = snapshot?.viewTime || snapshot?.serverTime;
  const viewTimestamp = typeof viewTime === "string" ? Date.parse(viewTime) : NaN;
  const cleanSite = (site) => {
    const isNonnegativeInteger = (value) => Number.isSafeInteger(value) && value >= 0;
    const cleanTimestamp = (value) => {
      const timestamp = typeof value === "string" ? Date.parse(value) : NaN;
      return Number.isFinite(timestamp) && Number.isFinite(viewTimestamp) && timestamp <= viewTimestamp ? value : null;
    };
    const historyIsValid = Array.isArray(site?.history) && site.history.length <= 24 && site.history.every((entry) => {
      const timestamp = typeof entry?.timestamp === "string" ? Date.parse(entry.timestamp) : NaN;
      return Number.isFinite(timestamp) && Number.isFinite(viewTimestamp) && timestamp <= viewTimestamp && isNonnegativeInteger(entry.quantity);
    });
    const history = historyIsValid
      ? [...site.history].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
      : [];
    const image = typeof site?.image?.url === "string" && typeof site?.image?.alt === "string"
      ? site.image
      : null;
    const processingState = ["completed", "paused", "waiting"].includes(site?.processingState)
      ? site.processingState
      : site?.processedAt ? "completed" : "waiting";
    return {
      ...site,
      target: isNonnegativeInteger(site?.target) ? site.target : null,
      completed: isNonnegativeInteger(site?.completed) ? site.completed : null,
      status: ["normal", "warning", "error"].includes(site?.status) ? site.status : "unknown",
      note: typeof site?.note === "string" ? site.note : "기록 대기",
      processingState,
      lastEventAt: cleanTimestamp(site?.lastEventAt),
      receivedAt: cleanTimestamp(site?.receivedAt),
      processedAt: cleanTimestamp(site?.processedAt),
      image,
      history
    };
  };
  const alertStatus = snapshot?.services?.alerts?.status;
  return {
    ...snapshot,
    viewTime: typeof viewTime === "string" && Number.isFinite(viewTimestamp) ? viewTime : snapshot?.serverTime,
    sites: {
      ...snapshot?.sites,
      factory: cleanSite(snapshot?.sites?.factory),
      warehouse: cleanSite(snapshot?.sites?.warehouse)
    },
    services: {
      ...snapshot?.services,
      alerts: {
        ...snapshot?.services?.alerts,
        status: ["sent", "failed"].includes(alertStatus) ? alertStatus : "unknown",
        lastAttemptAt: cleanTimestampForView(snapshot?.services?.alerts?.lastAttemptAt, viewTimestamp)
      }
    }
  };
}

function cleanTimestampForView(value, viewTimestamp) {
  const timestamp = typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(timestamp) && Number.isFinite(viewTimestamp) && timestamp <= viewTimestamp ? value : null;
}

function validateSnapshotStep13(snapshot) {
  if (snapshot === null || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return "서버 자료의 기본 형식을 확인해 주세요. 틀린 항목: (응답 전체) (기대: JSON 객체)";
  }
  if (snapshot.schemaVersion !== 1) {
    return "서버 자료의 기본 형식을 확인해 주세요. 틀린 항목: schemaVersion (기대: 숫자 1)";
  }
  return "";
}

function validateSnapshot(snapshot) {
  const basicError = validateSnapshotStep13(snapshot);
  if (basicError) return basicError;
  const base = "서버 자료의 기본 형식을 확인해 주세요.";
  const incidentBase = "서비스 상태의 형식을 확인해 주세요.";
  const validTime = (value) => typeof value === "string" && Number.isFinite(Date.parse(value));
  const fail = (field, expected, sentence = base) => `${sentence} 틀린 항목: ${field} (기대: ${expected})`;

  if (!Number.isSafeInteger(snapshot.revision) || snapshot.revision < 1) return fail("revision", "1 이상의 정수");
  if (typeof snapshot.scenarioId !== "string") return fail("scenarioId", "문자열");
  if (!validTime(snapshot.changedAt)) return fail("changedAt", "시각 문자열(예: 2026-10-15T09:00:00+09:00)");
  if (!validTime(snapshot.serverTime)) return fail("serverTime", "시각 문자열(예: 2026-10-15T09:00:00+09:00)");
  if (snapshot.trainingOnly !== true) return fail("trainingOnly", "true");
  if (!snapshot.sites || typeof snapshot.sites !== "object" || Array.isArray(snapshot.sites)) return fail("sites", "객체");
  if (!snapshot.services || typeof snapshot.services !== "object" || Array.isArray(snapshot.services)) return fail("services", "객체");
  if (!Array.isArray(snapshot.incidents)) return fail("incidents", "배열", incidentBase);
  if (snapshot.incidents.length > 0) {
    const incident = snapshot.incidents[0];
    if (!incident || typeof incident !== "object" || Array.isArray(incident)) return fail("incidents[0]", "객체", incidentBase);
    if (typeof incident.id !== "string") return fail("incidents[0].id", "문자열", incidentBase);
    if (!["warning", "error"].includes(incident.level)) return fail("incidents[0].level", "\"warning\" 또는 \"error\"", incidentBase);
    for (const field of ["title", "owner", "action"]) {
      if (typeof incident[field] !== "string") return fail(`incidents[0].${field}`, "문자열", incidentBase);
    }
  }
  if (snapshot.viewTime !== undefined) {
    if (!validTime(snapshot.viewTime) || Date.parse(snapshot.viewTime) > Date.parse(snapshot.serverTime)) {
      return fail("viewTime", "serverTime 이전이거나 같은 시각 문자열(예: 2026-10-15T09:00:00+09:00)", "조회 기준 시각을 확인해 주세요.");
    }
  }
  return "";
}

function validateRecords(payload, viewTime) {
  const base = "기록 응답 형식이 올바르지 않습니다.";
  const validTime = (value) => typeof value === "string" && Number.isFinite(Date.parse(value));
  const fail = (field, expected) => `${base} 틀린 항목: ${field} (기대: ${expected})`;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return fail("(응답 전체)", "JSON 객체");
  if (!Array.isArray(payload.records)) return fail("records", "배열");
  const at = Date.parse(viewTime);
  if (payload.records.length > 0) {
    const record = payload.records[0];
    if (!record || typeof record !== "object" || Array.isArray(record)) return fail("records[0]", "객체");
    if (!Number.isSafeInteger(record.quantity) || record.quantity < 0) return fail("records[0].quantity", "0 이상의 정수");
    const occurredAt = Date.parse(record.occurredAt);
    if (!validTime(record.occurredAt) || !Number.isFinite(at) || occurredAt > at) return fail("records[0].occurredAt", "기준 시각 이전이거나 같은 시각 문자열(예: 2026-10-15T09:00:00+09:00)");
    for (const field of ["receivedAt", "processedAt"]) {
      if (record[field] !== null && (!validTime(record[field]) || !Number.isFinite(at) || Date.parse(record[field]) > at)) {
        return fail(`records[0].${field}`, "null 또는 기준 시각 이전이거나 같은 시각 문자열(예: 2026-10-15T09:00:00+09:00)");
      }
    }
  }
  return "";
}

function requestErrorMessage(error, response = null) {
  if (error?.message === "REQUEST_TIMEOUT" || error?.cause?.name === "AbortError") error = { name: "AbortError" };
  if (response) {
    const status = response.status;
    if (status === 400) return "서버가 요청 조건을 받아들이지 않았습니다(HTTP 400).";
    if (status === 404) return "서버에 요청한 주소가 없습니다(HTTP 404). 연결 주소를 확인해 주세요.";
    if (status >= 400 && status < 500) return `서버가 요청을 거절했습니다(HTTP ${status}).`;
    if (status >= 500) return `서버가 요청을 처리하지 못했습니다(HTTP ${status}). 잠시 후 다시 조회하고, 계속되면 서버를 실행한 창의 기록(로그)을 확인하거나 강사에게 알려 주세요.`;
  }
  if (error?.name === "AbortError") {
    const seconds = Number((timeoutMs / 1000).toFixed(1));
    return `서버가 ${seconds}초 안에 응답하지 않았습니다. 잠시 후 다시 조회하고, 계속되면 서버를 실행한 창의 기록(로그)을 확인하거나 강사에게 알려 주세요.`;
  }
  if (error?.message === "INVALID_JSON") return "서버 응답이 JSON 형식이 아닙니다. 연결 주소가 API 서버 주소인지 확인해 주세요.";
  if (error?.message?.startsWith("SERVER_ERROR:")) return `서버가 요청을 처리하지 못했습니다. 서버가 알린 이유: ${error.message.slice("SERVER_ERROR:".length)}`;
  return "API 서버에 연결하지 못했습니다. 연결 주소가 맞는지, 직접 띄운 서버라면 켜져 있는지 확인해 주세요. GAS 웹 앱이라면 편집기에서 함수를 한 번 실행해 권한을 승인했는지도 확인해 주세요.";
}

async function requestJson(url, signal) {
  let response;
  try {
    response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal
    });
  } catch (error) {
    throw new Error(error?.name === "AbortError" ? "REQUEST_TIMEOUT" : "CONNECTION_FAILED", { cause: error });
  }
  if (!response.ok) throw new Error(`HTTP_${response.status}`, { cause: response });
  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error("INVALID_JSON", { cause: error });
  }
  if (typeof payload?.error === "string") throw new Error(`SERVER_ERROR:${payload.error}`);
  return payload;
}

function renderSitePhoto(site, siteId) {
  const figure = document.querySelector(`#${siteId}-photo`);
  const image = site?.image;
  const url = typeof image?.url === "string" ? image.url : "";
  const alt = typeof image?.alt === "string" ? image.alt : "";
  const existingImage = figure.querySelector("img");

  if (!url || !alt) {
    if (existingImage) existingImage.remove();
    let caption = figure.querySelector("figcaption");
    if (!caption) {
      caption = document.createElement("figcaption");
      figure.append(caption);
    }
    caption.textContent = "\uD604\uC7A5 \uC0AC\uC9C4 \uC5C6\uC74C";
    return;
  }

  if (existingImage?.getAttribute("src") === url && existingImage.alt === alt) return;

  figure.replaceChildren();
  const photo = document.createElement("img");
  photo.src = url;
  photo.alt = alt;
  photo.addEventListener("error", () => {
    photo.remove();
    let caption = figure.querySelector("figcaption");
    if (!caption) {
      caption = document.createElement("figcaption");
      figure.append(caption);
    }
    caption.textContent = "\uD604\uC7A5 \uC0AC\uC9C4\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.";
  }, { once: true });
  figure.append(photo);
}

async function fetchSnapshot(at = selectedAt, generation = viewGeneration) {
  const requestedAt = new Date().toISOString();
  const startedAt = performance.now();
  let queryRecorded = false;
  const finishQuery = (result) => {
    if (queryRecorded || pageIsLeaving) return;
    queryRecorded = true;
    recordQueryResult({ requestedAt, at, startedAt, ...result });
  };
  const baseUrl = typeof dashboardConfig.apiBaseUrl === "string" ? dashboardConfig.apiBaseUrl.trim() : "";
  if (!/^https?:\/\//i.test(baseUrl)) {
    finishQuery({ ok: false, error: "API 연결 주소가 설정되지 않았습니다." });
    throw new Error("API 연결 주소가 설정되지 않았습니다.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const params = at ? new URLSearchParams({ at }) : "";
    const endpoint = apiUrl(baseUrl, "/api/v1/snapshot", params);
    const data = await requestJson(endpoint, controller.signal);
    if (generation !== viewGeneration) return;
    if (at && (!data?.viewTime || Date.parse(data.viewTime) !== Date.parse(at))) {
      throw new Error("요청한 기준 시각과 서버 자료의 시각이 다릅니다.");
    }
    const validationError = validateSnapshot(data);
    if (validationError) throw new Error(validationError);
    if (snapshotRequest && snapshotRequest.generation !== viewGeneration) {
      finishQuery({ ok: true, snapshot: data });
      return;
    }
    finishQuery({ ok: true, snapshot: data });
    lastData = cleanSnapshot(data);
    lastSuccessfulData = lastData;
    lastSuccessAt = new Date();
    currentError = "";
    updateViewTimeOptions();
    render(lastData);
    updateQueryStatus(true);
    if (resolveRoute(window.location.hash).page === "records") {
      if (!recordsRequest || recordsRequest.at !== lastData.viewTime || recordsRequest.generation !== recordsViewGeneration) {
        loadRecords(lastData.viewTime, recordsViewGeneration);
      }
    }
  } catch (error) {
    const response = error?.cause && Number.isInteger(error.cause.status) ? error.cause : null;
    const normalizedError = error?.message?.startsWith("HTTP_") ? new Error(error.message, { cause: response }) : error;
    finishQuery({ ok: false, error: requestErrorMessage(normalizedError, response) });
    if (generation !== viewGeneration) return;
    currentError = requestErrorMessage(normalizedError, response);
    updateQueryStatus(false);
  } finally {
    clearTimeout(timeoutId);
  }
}

document.querySelector("#view-time").addEventListener("change", (event) => {
  selectedAt = event.target.value;
  if (selectedAt && resolveRoute(window.location.hash).page === "records") {
    const referenceDate = new Date(selectedAt);
    const referenceEnd = formatLocalDateTime(referenceDate.toISOString());
    const referenceParts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(referenceDate);
    const referenceLocal = Object.fromEntries(referenceParts.map(({ type, value }) => [type, value]));
    const referenceStart = `${referenceLocal.year}-${referenceLocal.month}-${referenceLocal.day}T00:00:00`;
    const fromInput = document.querySelector("#record-from");
    const toInput = document.querySelector("#record-to");
    fromInput.value = referenceStart;
    toInput.value = referenceEnd;
    fromInput.min = referenceStart;
    fromInput.max = referenceEnd;
    toInput.min = referenceStart;
    toInput.max = referenceEnd;
    draftFrom = referenceStart;
    draftTo = referenceEnd;
    submittedFrom = "";
    submittedTo = "";
    if (!polling) syncRecordRangeValidation();
  }
  viewGeneration += 1;
  clearPollSchedule();
  pendingSnapshotAt = selectedAt;
  lastData = null;
  lastSuccessfulData = null;
  lastSuccessAt = null;
  currentError = "";
  recordsRequestId += 1;
  recordsViewGeneration += 1;
  recordsRequest = null;
  pendingRecordRange = null;
  recordsData = null;
  recordsError = "";
  submittedFrom = "";
  submittedTo = "";
  renderedRecordsKey = "";
  const recordsRoute = resolveRoute(window.location.hash).page === "records";
  render(null);
  if (recordsRoute && selectedAt && !lastData) {
    const route = resolveRoute(window.location.hash);
    renderRecords(null, route.site, "", "", false, selectedAt);
  }
  updateQueryStatus(false);
  if (!polling) {
    const at = pendingSnapshotAt;
    pendingSnapshotAt = null;
    pollSnapshotAt(at, viewGeneration);
  }
});

function updateQueryStatus(success) {
  const freshness = document.querySelector("#freshness");
  const updatedAt = document.querySelector("#updated-at");
  const viewContext = document.querySelector("#view-context");
  const dataErrors = document.querySelector("#data-errors");
  freshness.textContent = success ? "조회 정상" : "조회 실패";
  freshness.className = `connection-status ${success ? "good" : "danger"}`;
  updatedAt.textContent = lastSuccessAt
    ? `마지막 조회 성공: ${formatTime(lastSuccessAt.toISOString())}`
    : "조회 성공 기록이 없습니다.";
  if (selectedAt) {
    viewContext.replaceChildren(
      document.createTextNode(`${formatTime(selectedAt)} 기준 · 과거 자료 `),
      createReturnToCurrentButton()
    );
  } else {
    viewContext.textContent = "현재 시각 기준";
  }
  dataErrors.hidden = success;
  dataErrors.textContent = success
    ? ""
    : `현재 자료를 가져오지 못했습니다. ${currentError} ${lastSuccessfulData ? "아래 내용은 이전 조회 자료입니다." : "조회할 자료가 없습니다."}`;
}

function createReturnToCurrentButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "inline-button";
  button.textContent = "현재로 돌아가기";
  button.addEventListener("click", () => {
    const viewTime = document.querySelector("#view-time");
    viewTime.value = "";
    viewTime.dispatchEvent(new Event("change", { bubbles: true }));
  });
  return button;
}

function formatViewTimeOption(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).format(date);
}

function updateViewTimeOptions() {
  const select = document.querySelector("#view-time");
  if (document.activeElement === select) return;
  const selectedValue = selectedAt;
  const reference = lastSuccessAt ? new Date(lastData?.serverTime || lastSuccessAt) : new Date();
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(reference).map(({type,value}) => [type,value]));
  const dayStart = new Date(`${parts.year}-${parts.month}-${parts.day}T00:00:00+09:00`);
  const latestTime = reference.getTime();
  const options = [{value:"",label:"현재"}];
  for(let time=dayStart.getTime();time<=latestTime;time+=60*60*1000){
    const iso=new Date(time).toISOString();
    options.push({value:iso,label:formatViewTimeOption(iso)});
  }
  if(lastData?.serverTime && new Date(lastData.serverTime).getMinutes()!==0){
    options.push({value:lastData.serverTime,label:`${formatViewTimeOption(lastData.serverTime)}:${String(new Date(lastData.serverTime).getSeconds()).padStart(2,"0")} (최근 조회)`});
  }
  if(selectedValue && !options.some(option=>option.value===selectedValue)){
    options.push({value:selectedValue,label:`${formatViewTimeOption(selectedValue)}:${String(new Date(selectedValue).getSeconds()).padStart(2,"0")}`});
  }
  select.replaceChildren(...options.map(option=>{
    const element=document.createElement("option");
    element.value=option.value;
    element.textContent=option.label;
    return element;
  }));
  select.value=selectedValue;
}

function updatePollControls() {
  refreshButton.setAttribute("aria-disabled", String(polling));
  refreshButton.setAttribute("aria-busy", String(polling));
  refreshButton.classList.toggle("loading", polling);
  if (polling || !nextPollAt) {
    countdownText.textContent = "조회 중…";
    return;
  }
  const remainingSeconds = Math.max(1, Math.ceil((nextPollAt - Date.now()) / 1000));
  countdownText.textContent = `다음 조회 ${remainingSeconds}초`;
}

function clearPollSchedule() {
  if (pollTimer !== null) clearTimeout(pollTimer);
  pollTimer = null;
  nextPollAt = null;
}

function scheduleNextPoll() {
  clearPollSchedule();
  if (selectedAt) {
    updatePollControls();
    return;
  }
  nextPollAt = Date.now() + pollIntervalMs;
  pollTimer = setTimeout(() => {
    pollTimer = null;
    nextPollAt = null;
    poll();
  }, pollIntervalMs);
  updatePollControls();
}

async function poll() {
  if (polling) return;
  clearPollSchedule();
  polling = true;
  updatePollControls();
  const generation = viewGeneration;
  const at = selectedAt;
  try {
    await fetchSnapshot(at);
  } finally {
    polling = false;
    if (generation !== viewGeneration) {
      const pendingAt = pendingSnapshotAt;
      pendingSnapshotAt = null;
      if (pendingAt !== null) pollSnapshotAt(pendingAt, viewGeneration);
      else if (!selectedAt) scheduleNextPoll();
      return;
    }
    scheduleNextPoll();
  }
}

async function pollSnapshotAt(at, generation) {
  if (polling) {
    pendingSnapshotAt = at;
    return;
  }
  clearPollSchedule();
  polling = true;
  updatePollControls();
  const request = { at, generation };
  snapshotRequest = request;
  try {
    await fetchSnapshot(at);
  } finally {
    if (snapshotRequest === request) snapshotRequest = null;
    polling = false;
    if (generation !== viewGeneration) {
      const pendingAt = pendingSnapshotAt;
      pendingSnapshotAt = null;
      if (pendingAt !== null) pollSnapshotAt(pendingAt, viewGeneration);
      else if (!selectedAt) scheduleNextPoll();
      return;
    }
    if (!selectedAt) scheduleNextPoll();
    else updatePollControls();
  }
}

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
  const visibleIncidents = currentError
    ? [{
        id: "API-QUERY",
        scope: "service",
        level: "error",
        title: "최신 자료를 가져오지 못했습니다.",
        owner: "서비스 운영 담당자",
        action: "조회 연결과 서버 상태를 확인해 주세요."
      }, ...incidents]
    : incidents;
  const seen = new Set();
  return visibleIncidents
    .filter((incident) => {
      if (!incident?.id || incident.id === "PREDICTION-JOB" || seen.has(incident.id)) return false;
      seen.add(incident.id);
      return true;
    })
    .sort((a, b) => Number(b.id === "API-QUERY") - Number(a.id === "API-QUERY") || Number(b.level === "error") - Number(a.level === "error"));
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

async function loadRecords(viewTime, viewGeneration, range = null) {
  const route = resolveRoute(window.location.hash);
  if (route.page !== "records" || !viewTime) return;

  if (recordsRequest) {
    pendingRecordRange = { viewTime, viewGeneration, range };
    await recordsRequest.promise;
    return;
  }

  const kind = route.site === "factory" ? "production" : "shipment";

  const requestId = ++recordsRequestId;
  const baseUrl = typeof dashboardConfig.apiBaseUrl === "string" ? dashboardConfig.apiBaseUrl.trim() : "";
  if (!/^https?:\/\//i.test(baseUrl)) {
    recordsError = "API 연결 주소가 설정되지 않았습니다.";
    if (requestId === recordsRequestId && viewGeneration === recordsViewGeneration) render(lastData);
    return;
  }

  recordsError = "";
  render(lastData);
  const params = new URLSearchParams({ kind, at: viewTime });
  if (range?.from) params.set("from", new Date(`${range.from}+09:00`).toISOString());
  if (range?.to) params.set("to", new Date(`${range.to}+09:00`).toISOString());
  const endpoint = apiUrl(baseUrl, "/api/v1/records", params);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const request = { kind, at: viewTime, generation: viewGeneration, promise: null };
  request.promise = (async () => {
    try {
      const payload = await requestJson(endpoint, controller.signal);

      if (requestId !== recordsRequestId || viewGeneration !== recordsViewGeneration || resolveRoute(window.location.hash).site !== route.site) return;
      const validationError = validateRecords(payload, viewTime);
      if (validationError) throw new Error(validationError);
      recordsData = payload.records;
      recordsError = "";
    } catch (error) {
      if (requestId !== recordsRequestId || viewGeneration !== recordsViewGeneration || resolveRoute(window.location.hash).site !== route.site) return;
      const response = error?.cause && Number.isInteger(error.cause.status) ? error.cause : null;
      const normalizedError = error?.message?.startsWith("HTTP_") ? new Error(error.message, { cause: response }) : error;
      recordsError = requestErrorMessage(normalizedError, response);
    } finally {
      clearTimeout(timeoutId);
      if (recordsRequest === request) recordsRequest = null;
      if (requestId === recordsRequestId && viewGeneration === recordsViewGeneration && resolveRoute(window.location.hash).site === route.site) render(lastData);
      const pending = pendingRecordRange;
      pendingRecordRange = null;
      if (pending && pending.viewGeneration === recordsViewGeneration && resolveRoute(window.location.hash).page === "records") {
        loadRecords(pending.viewTime, pending.viewGeneration, pending.range);
      }
    }
  })();
  recordsRequest = request;
  await request.promise;
}

function renderRecords(data, siteId, selectedFrom = "", selectedTo = "", sameScreen = false, referenceTime = "") {
  const viewReference = selectedAt || referenceTime || lastData?.viewTime || lastData?.serverTime || new Date().toISOString();
  const hasReferenceData = Boolean(referenceTime || lastData?.viewTime || selectedAt);
  const isPastReference = Boolean(selectedAt || referenceTime);
  const referenceDate = new Date(viewReference);
  const now = Number.isFinite(referenceDate.getTime()) ? referenceDate : new Date();
  const viewEndValue = formatLocalDateTime(now.toISOString());
  const localParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const localDate = Object.fromEntries(localParts.map(({ type, value }) => [type, value]));
  const dayStartValue = `${localDate.year}-${localDate.month}-${localDate.day}T00:00:00`;
  const fromInput = document.querySelector("#record-from");
  const toInput = document.querySelector("#record-to");
  const result = document.querySelector("#records-result");
  const referenceChanged = hasReferenceData && (fromInput.max !== viewEndValue || fromInput.min !== dayStartValue);
  const fallbackFrom = dayStartValue;
  const fallbackTo = formatLocalDateTime(now.toISOString());
  const resetRange = hasReferenceData && (referenceChanged || isPastReference);
  const fromDefault = resetRange || isPastReference
    ? fallbackFrom
    : selectedFrom || submittedFrom || draftFrom || fallbackFrom;
  const toDefault = resetRange || isPastReference
    ? viewEndValue
    : selectedTo || submittedTo || draftTo || (hasReferenceData ? viewEndValue : fallbackTo);
  if (document.activeElement !== fromInput && (!sameScreen || resetRange || isPastReference || fromInput.value !== fromDefault)) {
    fromInput.value = fromDefault;
  }
  if (document.activeElement !== toInput && (!sameScreen || resetRange || isPastReference || toInput.value !== toDefault)) {
    toInput.value = toDefault;
  }
  draftFrom = fromInput.value;
  draftTo = toInput.value;
  fromInput.min = dayStartValue;
  fromInput.max = viewEndValue;
  toInput.min = dayStartValue;
  toInput.max = viewEndValue;
  validateRecordRange(fromInput, toInput);

  if (recordsError) {
    const error = document.createElement("p");
    error.className = "notice warning";
    error.textContent = recordsError;
    preserveScrollAndFocus(result.closest(".table-scroll"), () => replaceWhenChanged(result, error), sameScreen);
    return;
  }
  if (!recordsData) {
    const waiting = document.createElement("p");
    waiting.className = "notice";
    waiting.textContent = "기록을 확인하고 있습니다.";
    preserveScrollAndFocus(result.closest(".table-scroll"), () => replaceWhenChanged(result, waiting), sameScreen);
    return;
  }

  const records = recordsData;
  const from = Date.parse((submittedFrom || dayStartValue) + "+09:00");
  const to = Date.parse((submittedTo || formatLocalDateTime(now.toISOString())) + "+09:00");
  const rows = (Number.isFinite(from) && Number.isFinite(to) && from <= to ? (Array.isArray(records) ? records : []) : [])
    .filter((record) => {
      const occurredAt = Date.parse(record.occurredAt);
      return Number.isFinite(occurredAt) && from <= occurredAt && occurredAt <= to;
    })
    .sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt));
  const recordsKey = JSON.stringify(rows);
  if (recordsKey === renderedRecordsKey) return;

  if (rows.length === 0) {
    const empty = document.createElement("p");
    empty.className = "notice";
    empty.textContent = "선택한 시간대에 기록이 없습니다.";
    preserveScrollAndFocus(result.closest(".table-scroll"), () => replaceWhenChanged(result, empty), sameScreen);
    renderedRecordsKey = recordsKey;
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
  renderedRecordsKey = recordsKey;
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

function render(data = lastData) {
  if (data) lastData = data;
  const currentHash = window.location.hash;
  const sameScreen = currentHash === lastRenderedHash;
  const route = resolveRoute(currentHash);
  if (!sameScreen && lastRenderedHash && resolveRoute(lastRenderedHash).page === "records") {
    recordsViewGeneration += 1;
    recordsRequestId += 1;
    recordsRequest = null;
    recordsData = null;
    recordsError = "";
    submittedFrom = "";
    submittedTo = "";
    pendingRecordRange = null;
    renderedRecordsKey = "";
  }
  const viewTime = lastData?.viewTime || lastData?.serverTime;
  const today = document.querySelector("#today-view");
  const result = document.querySelector("#records-result");
  const records = document.querySelector("#records-view");
  const queries = document.querySelector("#queries-view");
  const queriesScroll = document.querySelector("#queries-scroll");
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
    const keepDraft = sameScreen && (draftFrom || draftTo);
    const hasReferenceTime = Boolean(selectedAt);
    renderRecords(lastData, route.site, keepDraft ? "" : from, keepDraft ? "" : to, sameScreen, selectedAt);
    if (hasReferenceTime) {
      const referenceDate = new Date(selectedAt || lastData.viewTime);
      const referenceEnd = formatLocalDateTime(referenceDate.toISOString());
      const referenceParts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(referenceDate);
      const referenceLocal = Object.fromEntries(referenceParts.map(({ type, value }) => [type, value]));
      const referenceStart = `${referenceLocal.year}-${referenceLocal.month}-${referenceLocal.day}T00:00:00`;
      document.querySelector("#record-from").value = referenceStart;
      document.querySelector("#record-to").value = referenceEnd;
      draftFrom = referenceStart;
      draftTo = referenceEnd;
      document.querySelector("#record-from").min = referenceStart;
      document.querySelector("#record-from").max = referenceEnd;
      document.querySelector("#record-to").min = referenceStart;
      document.querySelector("#record-to").max = referenceEnd;
      validateRecordRange(document.querySelector("#record-from"), document.querySelector("#record-to"));
    }
    if (!sameScreen && lastData?.viewTime) loadRecords(lastData.viewTime, recordsViewGeneration);
    lastRenderedHash = currentHash;
    return;
  }
  if (route.page === "queries") {
    renderQueries(route);
    lastRenderedHash = currentHash;
    return;
  }
  if (route.page !== "today" && !route.unknown) {
    lastRenderedHash = currentHash;
    return;
  }

  if (!lastData) {
    document.querySelector("#page-content").setAttribute("aria-busy", "true");
    const heroTitle = document.querySelector("#hero-title");
    heroTitle.firstChild.textContent = "자료 확인 중 ";
    heroTitle.querySelector(".help-wrap").hidden = true;
    document.querySelector(".hero").classList.add("neutral");
    document.querySelector("#hero-empty").hidden = true;
    document.querySelector("#hero-empty").textContent = "";
    document.querySelector("#hero-action").textContent = "운영 담당자 · 서버 연결 후 기록을 확인할 수 있습니다.";
    renderNotifications(null);
    if (currentError) renderHero(null);
    for (const [prefix, itemName] of [["factory", "생산"], ["warehouse", "출고"]]) {
      document.querySelector(`#${prefix}-quantity`).innerHTML = `<span>조회 중</span>`;
      document.querySelector(`#${prefix}-progress-text`).textContent = prefix === "factory"
        ? "생산 실적과 목표를 가져오고 있습니다."
        : "출고 실적과 목표를 가져오고 있습니다.";
      document.querySelector(`#${prefix}-progress`).hidden = true;
      document.querySelector(`#${prefix}-exceeded`).hidden = true;
      renderSitePhoto(null, prefix);
    }
    for (const selector of ["#factory-status", "#warehouse-status", "#alerts-status", "#factory-flow", "#warehouse-flow"]) {
      const card = document.querySelector(selector);
      const badge = card.querySelector(".badge");
      badge.textContent = "조회 중";
      badge.className = "badge neutral";
    }
    document.querySelector("#header-alerts-link").querySelector(".alerts-text").textContent = "알림 확인 중";
    document.querySelector("#header-alerts-link").setAttribute("aria-label", "알림 확인 중");
    document.querySelector("#header-alerts-link").className = "alerts-link neutral";
    document.querySelector("#factory-status .status-line + p").textContent = "생산 기록 정보를 가져오고 있습니다.";
    document.querySelector("#warehouse-status .status-line + p").textContent = "출고 기록 정보를 가져오고 있습니다.";
    document.querySelector("#alerts-status .status-line + p").textContent = "알림 전송 정보를 가져오고 있습니다.";
    document.querySelector("#factory-status .meta").textContent = "기록 시각 조회 중";
    document.querySelector("#warehouse-status .meta").textContent = "기록 시각 조회 중";
    document.querySelector("#alerts-status .meta").textContent = "전송 시각 조회 중";
    for (const selector of ["#factory-graph", "#warehouse-graph"]) {
      const graphContainer = document.querySelector(selector);
      graphContainer.querySelector(".loading-graph").textContent = "시간별 기록 조회 중";
      graphContainer.querySelector(".loading-graph").hidden = false;
      graphContainer.querySelector("p[hidden]").hidden = true;
      graphContainer.querySelector(".graph-scroll").hidden = true;
      graphContainer.querySelector("p:last-child").hidden = true;
    }
    lastRenderedHash = currentHash;
    return;
  }

  document.querySelector("#page-content").setAttribute("aria-busy", "false");
  const heroTitle = document.querySelector("#hero-title");
  heroTitle.firstChild.textContent = "먼저 확인할 일 ";
  heroTitle.querySelector(".help-wrap").hidden = false;
  renderProductionCard(lastData?.sites?.factory, "factory", "생산");
  renderProductionCard(lastData?.sites?.warehouse, "warehouse", "출고");
  renderSitePhoto(lastData?.sites?.factory, "factory");
  renderSitePhoto(lastData?.sites?.warehouse, "warehouse");
  renderGraph(lastData?.sites?.factory, "factory");
  renderGraph(lastData?.sites?.warehouse, "warehouse");
  renderSiteStatus(lastData?.sites?.factory, "factory", viewTime);
  renderSiteStatus(lastData?.sites?.warehouse, "warehouse", viewTime);
  renderNotifications(lastData);
  if (route.page === "today" || route.unknown) renderHero(lastData);
  renderFlow(lastData?.sites?.factory, "factory", viewTime);
  renderFlow(lastData?.sites?.warehouse, "warehouse", viewTime);
  lastRenderedHash = currentHash;
}

function validateRecordRange(from, to) {
  const fromTime = Date.parse(`${from.value}+09:00`);
  const toTime = Date.parse(`${to.value}+09:00`);
  to.setCustomValidity(
    from.value && to.value && Number.isFinite(fromTime) && Number.isFinite(toTime) && toTime < fromTime
      ? "끝 시각은 시작 시각과 같거나 늦어야 합니다."
      : ""
  );
}

function syncRecordRangeValidation() {
  const fromInput = document.querySelector("#record-from");
  const toInput = document.querySelector("#record-to");
  if (fromInput && toInput) validateRecordRange(fromInput, toInput);
}

document.querySelector("#record-from").addEventListener("input", syncRecordRangeValidation);
document.querySelector("#record-to").addEventListener("input", syncRecordRangeValidation);

document.querySelector("#record-filter").addEventListener("submit", (event) => {
  event.preventDefault();
  const route = resolveRoute(window.location.hash);
  if (route.page !== "records") return;
  const fromInput = document.querySelector("#record-from");
  const toInput = document.querySelector("#record-to");
  validateRecordRange(fromInput, toInput);
  if (!event.currentTarget.reportValidity()) return;
  const from = fromInput.value;
  const to = toInput.value;
  draftFrom = from;
  draftTo = to;
  submittedFrom = from;
  submittedTo = to;
  recordsViewGeneration += 1;
  recordsRequestId += 1;
  pendingRecordRange = { viewTime: lastData?.viewTime || lastData?.serverTime, viewGeneration: recordsViewGeneration, range: { from, to } };
  recordsData = null;
  recordsError = "";
  render(lastData);
  if (!recordsRequest) {
    const pending = pendingRecordRange;
    pendingRecordRange = null;
    loadRecords(pending.viewTime, pending.viewGeneration, pending.range);
  }
});

document.querySelector("#record-from").addEventListener("input", () => {
  const from = document.querySelector("#record-from");
  draftFrom = from.value;
  syncRecordRangeValidation();
});
document.querySelector("#record-to").addEventListener("input", () => {
  const to = document.querySelector("#record-to");
  draftTo = to.value;
  syncRecordRangeValidation();
});

refreshButton.addEventListener("click", () => {
  if (polling) return;
  clearPollSchedule();
  if (selectedAt) pollSnapshotAt(selectedAt, viewGeneration);
  else poll();
});

refreshButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.repeat) event.preventDefault();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;
  if (!polling && nextPollAt && Date.now() >= nextPollAt) {
    clearPollSchedule();
    poll();
  } else {
    updatePollControls();
  }
});

countdownTimer = setInterval(updatePollControls, 250);

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
  const returnToCurrentButton = event.target.closest(".inline-button");
  if (!returnToCurrentButton && !event.target.closest(".notification-wrap")) setNotificationsOpen(false);
  if (!event.target.closest(".help-wrap")) closeAllHelps();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !notificationDropdown.hidden) {
    setNotificationsOpen(false);
    alertButton.focus();
  }
  if (event.key === "Escape") closeAllHelps();
});

window.addEventListener("resize", () => {
  for (const button of document.querySelectorAll('.help-btn[aria-expanded="true"]')) positionHelpPopover(button);
});

window.addEventListener("hashchange", () => {
  render();
  window.scrollTo(0, 0);
});

render();
poll();
