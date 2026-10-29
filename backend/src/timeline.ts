import { businessDate, OperationRecord, seedRecords } from "./records";
import { ScenarioId } from "./scenarios";

export type PredictionStatus = "waiting" | "running" | "completed";

export type Transition = {
  at: string;
  revision: number;
  scenarioId: ScenarioId;
  prediction: PredictionStatus;
  startedAt: string | null;
  finishedAt: string | null;
};

export type Session = { sessionId: string; records: OperationRecord[]; transitions: Transition[] };

export function newSession(now: string, revision: number): Session {
  const start = Date.parse(businessDate(now) + "T00:00:00+09:00");
  const duration = Date.parse(now) - start;
  const transitions: Transition[] = [
    { at: new Date(start).toISOString(), revision, scenarioId: "normal", prediction: "waiting", startedAt: null, finishedAt: null },
  ];
  if (duration > 10000) {
    const runningAt = new Date(start + duration * 0.4).toISOString();
    const completedAt = new Date(start + duration * 0.6).toISOString();
    transitions.push(
      { ...transitions[0], at: runningAt, prediction: "running", startedAt: runningAt },
      { ...transitions[0], at: completedAt, prediction: "completed", startedAt: runningAt, finishedAt: completedAt },
    );
  }
  return { sessionId: "lesson-" + now + "-" + revision, records: seedRecords(now), transitions };
}
