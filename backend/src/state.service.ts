import { BadRequestException, Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { aggregate, businessDate, OperationRecord } from "./records";
import { isScenarioId, makeSnapshot, Snapshot } from "./scenarios";
import { newSession } from "./timeline";

type StoredState = {
  sessionId: string;
  records: OperationRecord[];
  scenarioId: "normal";
  revision: number;
  changedAt: string;
};

@Injectable()
export class StateService {
  private readonly path = resolve(process.env.STATE_FILE || "./var/state.json");
  private readonly state: StoredState;

  constructor() {
    mkdirSync(dirname(this.path), { recursive: true });
    if (existsSync(this.path)) {
      this.state = JSON.parse(readFileSync(this.path, "utf8")) as StoredState;
      return;
    }

    const createdAt = new Date().toISOString();
    this.state = {
      ...newSession(createdAt),
      scenarioId: "normal",
      revision: 1,
      changedAt: createdAt,
    };
    this.save();
  }

  records(kind: string, from?: string, to?: string, at?: string) {
    if (kind !== "production" && kind !== "shipment") {
      throw new BadRequestException("생산 또는 출고 기록을 선택해 주세요.");
    }

    const now = new Date().toISOString();
    const requestedAt = at === undefined ? now : at;
    if (
      !/^\d{4}-\d{2}-\d{2}T/.test(requestedAt) ||
      !/(Z|[+-]\d{2}:\d{2})$/i.test(requestedAt) ||
      !Number.isFinite(Date.parse(requestedAt)) ||
      Date.parse(requestedAt) > Date.parse(now) ||
      businessDate(requestedAt) !== businessDate(now)
    ) {
      throw new BadRequestException("오늘의 현재 이전 시각을 선택해 주세요.");
    }

    const viewTime = new Date(requestedAt).toISOString();
    const start = from || `${businessDate(viewTime)}T00:00:00+09:00`;
    const end = to || viewTime;
    const validBound = (value: string) =>
      /(Z|[+-]\d{2}:\d{2})$/i.test(value) &&
      Number.isFinite(Date.parse(value)) &&
      businessDate(value) === businessDate(viewTime);
    if (
      !validBound(start) ||
      !validBound(end) ||
      Date.parse(start) > Date.parse(end) ||
      Date.parse(end) > Date.parse(viewTime)
    ) {
      throw new BadRequestException("조회 시간 구간을 확인해 주세요.");
    }

    const cutoff = Date.parse(viewTime);
    const records = this.state.records
      .filter((record) =>
        record.kind === kind &&
        Date.parse(start) <= Date.parse(record.occurredAt) &&
        Date.parse(record.occurredAt) <= Date.parse(end))
      .sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt))
      .map((record) => {
        const receivedAt = record.receivedAt && Date.parse(record.receivedAt) <= cutoff ? record.receivedAt : null;
        const processedAt = record.processedAt && Date.parse(record.processedAt) <= cutoff ? record.processedAt : null;
        const status = processedAt ? "completed" : receivedAt ? "processing-wait" : "receipt-wait";
        return { ...record, receivedAt, processedAt, status };
      });

    return { sessionId: this.state.sessionId, viewTime, records };
  }

  snapshot(at?: string): Snapshot {
    const now = new Date().toISOString();
    const requestedAt = at === undefined ? now : at;
    if (
      !requestedAt ||
      !/^\d{4}-\d{2}-\d{2}T/.test(requestedAt) ||
      !/(Z|[+-]\d{2}:\d{2})$/i.test(requestedAt) ||
      !Number.isFinite(Date.parse(requestedAt)) ||
      Date.parse(requestedAt) > Date.parse(now) ||
      businessDate(requestedAt) !== businessDate(now)
    ) {
      throw new BadRequestException("오늘의 현재 이전 시각을 선택해 주세요.");
    }

    const viewTime = new Date(requestedAt).toISOString();
    const scenarioId = isScenarioId(this.state.scenarioId) ? this.state.scenarioId : "normal";
    const changedAt = Date.parse(this.state.changedAt) > Date.parse(viewTime) ? viewTime : this.state.changedAt;
    const snapshot = makeSnapshot(scenarioId, this.state.revision, changedAt, now);
    snapshot.viewTime = viewTime;
    snapshot.mode = at === undefined ? "current" : "past";
    snapshot.sessionId = this.state.sessionId;

    for (const [id, kind] of [["factory", "production"], ["warehouse", "shipment"]] as const) {
      const site = snapshot.sites[id];
      const rows = this.records(kind, undefined, viewTime, viewTime).records;
      const total = aggregate(this.state.records, kind, viewTime);
      const latest = rows.at(-1);
      site.completed = total.quantity || null;
      site.lastEventAt = latest?.occurredAt || null;
      site.receivedAt = latest?.receivedAt || null;
      site.processedAt = latest?.processedAt || null;
      site.processingState = latest?.processedAt ? "completed" : "waiting";
      const hourly = new Map<string, number>();
      for (const record of rows) {
        if (!record.processedAt) continue;
        const hour = new Date(Math.floor(Date.parse(record.occurredAt) / 3_600_000) * 3_600_000).toISOString();
        hourly.set(hour, (hourly.get(hour) || 0) + record.quantity);
      }
      site.history = [...hourly]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([timestamp, quantity]) => ({ timestamp, quantity }));
      const origin = process.env.PUBLIC_BASE_URL || `http://127.0.0.1:${process.env.PORT || "3000"}`;
      site.image = {
        url: `${origin.replace(/\/$/, "")}/api/v1/images/${id}`,
        alt: id === "factory" ? "생산 라인 참고 사진" : "물류창고 참고 사진",
      };
      const stale = latest && Date.parse(viewTime) - Date.parse(latest.occurredAt) > 30 * 60_000;
      site.status = !latest || stale || site.processingState !== "completed" ? "warning" : "normal";
      if (site.status === "warning") {
        const title = !latest
          ? `${site.label}의 기록이 없습니다.`
          : site.processingState !== "completed"
            ? `${site.label} 기록 처리를 기다리고 있습니다.`
            : `${site.label} 기록이 30분 넘게 들어오지 않았습니다.`;
        site.note = title;
        snapshot.incidents.push({
          id: id === "factory" ? "FACTORY-FEED" : "WAREHOUSE-FEED",
          scope: id,
          level: "warning",
          title,
          owner: id === "factory" ? "공장 데이터 담당자" : "창고 데이터 담당자",
          action: "기록 수집과 처리 상태를 확인해 주세요.",
        });
      } else {
        site.note = "기록이 반영되고 있습니다.";
      }
    }
    return snapshot;
  }

  private save() {
    const nextPath = `${this.path}.next`;
    writeFileSync(nextPath, `${JSON.stringify(this.state, null, 2)}\n`, "utf8");
    renameSync(nextPath, this.path);
  }
}