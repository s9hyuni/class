import { OperationRecord, seedRecords } from "./records";

export type Session = { sessionId: string; records: OperationRecord[] };

export function newSession(now: string): Session {
  return {
    sessionId: `lesson-${now}-1`,
    records: seedRecords(now),
  };
}