export const scenarioIds = ["normal"] as const;

export type ScenarioId = (typeof scenarioIds)[number];

export function isScenarioId(value: unknown): value is ScenarioId {
  return typeof value === "string" && (scenarioIds as readonly string[]).includes(value);
}

export type Level = "normal" | "warning";
export type Incident = {
  id: string;
  scope: "factory" | "warehouse" | "service";
  level: "warning" | "error";
  title: string;
  owner: string;
  action: string;
};
export type Site = {
  label: string;
  target: number | null;
  completed: number | null;
  processingState?: "completed" | "waiting";
  lastEventAt: string | null;
  receivedAt: string | null;
  processedAt: string | null;
  status: Level;
  note: string;
  history?: { timestamp: string; quantity: number }[];
  image?: { url: string; alt: string };
};
export type Snapshot = {
  schemaVersion: 1;
  scenarioId: ScenarioId;
  revision: number;
  changedAt: string;
  serverTime: string;
  viewTime?: string;
  mode?: "current" | "past";
  sessionId?: string;
  trainingOnly: true;
  sites: { factory: Site; warehouse: Site };
  services: {
    api: { status: "normal" | "failed"; note: string };
    alerts: { status: "sent" | "failed"; lastAttemptAt: string; note: string };
    prediction: { status: "waiting" | "running" | "completed" | "failed"; version: string; lastRunAt: string | null; startedAt?: string | null; finishedAt?: string | null; note: string };
  };
  incidents: Incident[];
};

const ago = (now: number, minutes: number) => new Date(now - minutes * 60_000).toISOString();

export function makeSnapshot(scenarioId: ScenarioId, revision: number, changedAt: string, serverTime: string): Snapshot {
  return {
    schemaVersion: 1,
    scenarioId,
    revision,
    changedAt,
    serverTime,
    trainingOnly: true,
    sites: {
      factory: { label: "텀블공장", target: 120, completed: null, lastEventAt: null, receivedAt: null, processedAt: null, status: "normal", note: "" },
      warehouse: { label: "물류창고", target: 100, completed: null, lastEventAt: null, receivedAt: null, processedAt: null, status: "normal", note: "" },
    },
    services: {
      api: { status: "normal", note: "조회 서비스가 정상입니다." },
      alerts: { status: "sent", lastAttemptAt: ago(Date.parse(changedAt), 1), note: "모의 전송 성공 기록입니다. 실제 알림을 보내지 않았습니다." },
      prediction: { status: "waiting", version: "demo-v1", lastRunAt: null, note: "" },
    },
    incidents: [],
  };
}
