import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { ScenarioId } from "./scenarios";
import { newSession, Session } from "./timeline";

type Stored = Session & { scenarioId: ScenarioId; revision: number; changedAt: string };

@Injectable()
export class StateService {
  private readonly path = resolve(process.env.STATE_FILE || "./var/state.json");
  private state: Stored;

  constructor() {
    mkdirSync(dirname(this.path), { recursive: true });
    if (existsSync(this.path)) {
      this.state = this.save(JSON.parse(readFileSync(this.path, "utf8")));
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
