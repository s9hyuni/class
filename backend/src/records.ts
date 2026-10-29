export type RecordKind = "production" | "shipment";

export type OperationRecord = {
  id: string;
  kind: RecordKind;
  quantity: number;
  occurredAt: string;
  receivedAt: string | null;
  processedAt: string | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const businessDate = (value: string) => dateFormatter.format(new Date(value));

export function seedRecords(now: string): OperationRecord[] {
  const nowTime = Date.parse(now);
  const dayStart = Date.parse(businessDate(now) + "T00:00:00+09:00");
  return (["production", "shipment"] as const).flatMap((kind, index) => {
    const total = index === 0 ? 100 : 75;
    const span = Math.max(0, nowTime - dayStart - 120000);
    const count = Math.max(1, Math.ceil(span / (20 * 60000)) + 1);
    const records: OperationRecord[] = [];
    for (let point = 0; point < count; point++) {
      const quantity = Math.floor(total / count) + (point < total % count ? 1 : 0);
      const base = dayStart + (count > 1 ? (span * point) / (count - 1) : 0);
      const occurred = Math.min(nowTime, base + index * Math.min(1000, span / 100));
      const received = Math.min(nowTime, occurred + 2000);
      const processed = Math.min(nowTime, received + 3000);
      records.push({
        id: "seed-" + kind + "-" + point,
        kind,
        quantity,
        occurredAt: new Date(occurred).toISOString(),
        receivedAt: new Date(received).toISOString(),
        processedAt: new Date(processed).toISOString(),
      });
    }
    return records;
  });
}
