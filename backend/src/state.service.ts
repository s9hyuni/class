import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { validRecord } from "./records";
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

  private save(next: Stored): Stored {
    const temporary = this.path + ".next";
    writeFileSync(temporary, JSON.stringify(next, null, 2) + "\n", { mode: 0o600 });
    renameSync(temporary, this.path);
    return next;
  }
}
