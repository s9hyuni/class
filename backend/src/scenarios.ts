export const scenarioIds = ["normal"] as const;

export type ScenarioId = (typeof scenarioIds)[number];

export function isScenarioId(value: unknown): value is ScenarioId {
  return typeof value === "string" && (scenarioIds as readonly string[]).includes(value);
}
