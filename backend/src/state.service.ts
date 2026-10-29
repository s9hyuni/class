import { BadRequestException, Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { businessDate, validRecord } from "./records";
import { isScenarioId, ScenarioId } from "./scenarios";
import { newSession, Session, Transition } from "./timeline";

type Stored = Session & { scenarioId: ScenarioId; revision: number; changedAt: string };

@Injectable()
export class StateService {
  private readonly path = resolve(process.env.STATE_FILE || "./var/state.json");
  private state: Stored;

  constructor() {
    mkdirSync(dirname(this.path), { recursive: true });
    if (existsSync(this.path)) {
      const parsed = JSON.parse(readFileSync(this.path, "utf8"));
      if (
        !isScenarioId(parsed.scenarioId) ||
        !Number.isSafeInteger(parsed.revision) ||
        parsed.revision < 1 ||
        !Number.isFinite(Date.parse(parsed.changedAt))
      ) {
        throw new Error("STATE_FILE 내용이 잘못되었습니다. 기존 파일을 보존하고 확인해 주세요.");
      }
      if (
        parsed.records &&
        (!Array.isArray(parsed.records) ||
          !parsed.records.every(validRecord) ||
          new Set(parsed.records.map((record: { id: string }) => record.id)).size !== parsed.records.length)
      ) {
        throw new Error("저장된 기록을 확인해 주세요.");
      }
      if (
        parsed.transitions !== undefined &&
        (!Array.isArray(parsed.transitions) ||
          parsed.transitions.length === 0 ||
          parsed.transitions.some(
            (event: Transition) =>
              !event ||
              !Number.isFinite(Date.parse(event.at)) ||
              !isScenarioId(event.scenarioId) ||
              !["waiting", "running", "completed"].includes(event.prediction) ||
              !Number.isSafeInteger(event.revision),
          ))
      ) {
        throw new Error("상태 이력을 확인해 주세요.");
      }
      if (!parsed.transitions) {
        const seed = newSession(parsed.changedAt, parsed.revision);
        parsed.sessionId = seed.sessionId;
        parsed.records = parsed.records || seed.records;
        parsed.transitions = [
          {
            at: parsed.changedAt,
            revision: parsed.revision,
            scenarioId: parsed.scenarioId,
            prediction: "completed",
            startedAt: parsed.changedAt,
            finishedAt: parsed.changedAt,
          },
        ];
      }
      this.state = this.save(parsed);
    } else {
      const changedAt = new Date().toISOString();
      this.state = this.save({ ...newSession(changedAt, 1), scenarioId: "normal", revision: 1, changedAt });
    }
  }

  private view(at?: string) {
    const now = new Date().toISOString();
    const value = at === undefined ? now : at;
    if (
      !value ||
      !/^\d{4}-\d{2}-\d{2}T/.test(value) ||
      !/(Z|[+-]\d{2}:\d{2})$/i.test(value) ||
      !Number.isFinite(Date.parse(value)) ||
      Date.parse(value) > Date.parse(now) ||
      businessDate(value) !== businessDate(now)
    ) {
      throw new BadRequestException("오늘의 현재 이전 시각을 선택해 주세요.");
    }
    return { now, value: new Date(value).toISOString() };
  }

  records(kind: string, from?: string, to?: string, at?: string) {
    if (kind !== "production" && kind !== "shipment") {
      throw new BadRequestException("생산 또는 출고 기록을 선택해 주세요.");
    }
    return this.query(kind, this.view(at), from, to);
  }

  private query(kind: string, view: { now: string; value: string }, from?: string, to?: string) {
    const start = from || businessDate(view.value) + "T00:00:00+09:00";
    const end = to || view.value;
    const validBound = (value: string) =>
      /(Z|[+-]\d{2}:\d{2})$/i.test(value) &&
      Number.isFinite(Date.parse(value)) &&
      businessDate(value) === businessDate(view.value);
    if (
      !validBound(start) ||
      !validBound(end) ||
      Date.parse(start) > Date.parse(end) ||
      Date.parse(end) > Date.parse(view.value)
    ) {
      throw new BadRequestException("조회 시간 구간을 확인해 주세요.");
    }
    const cutoff = Date.parse(view.value);
    const records = this.state.records
      .filter(
        (r) =>
          r.kind === kind &&
          Date.parse(start) <= Date.parse(r.occurredAt) &&
          Date.parse(r.occurredAt) <= Date.parse(end),
      )
      .sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt))
      .map((r) => {
        const receivedAt = r.receivedAt && Date.parse(r.receivedAt) <= cutoff ? r.receivedAt : null;
        const processedAt = r.processedAt && Date.parse(r.processedAt) <= cutoff ? r.processedAt : null;
        const status = processedAt ? "completed" : receivedAt ? "processing-wait" : "receipt-wait";
        return { ...r, receivedAt, processedAt, status };
      });
    return { sessionId: this.state.sessionId, viewTime: view.value, records };
  }

  private save(next: Stored): Stored {
    const temporary = this.path + ".next";
    writeFileSync(temporary, JSON.stringify(next, null, 2) + "\n", { mode: 0o600 });
    renameSync(temporary, this.path);
    return next;
  }
}
