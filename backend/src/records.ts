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

const validTime = (value: unknown) => typeof value === "string" && Number.isFinite(Date.parse(value));

export function validRecord(value: unknown): value is OperationRecord {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(record.id)) return false;
  if (record.kind !== "production" && record.kind !== "shipment") return false;
  if (!Number.isSafeInteger(record.quantity) || (record.quantity as number) <= 0) return false;
  if (!validTime(record.occurredAt)) return false;
  if (record.receivedAt !== null && !validTime(record.receivedAt)) return false;
  if (record.processedAt !== null && !validTime(record.processedAt)) return false;
  if (record.receivedAt !== null && Date.parse(record.occurredAt as string) > Date.parse(record.receivedAt as string)) return false;
  if (record.processedAt !== null) {
    if (record.receivedAt === null) return false;
    if (Date.parse(record.receivedAt as string) > Date.parse(record.processedAt as string)) return false;
  }
  return true;
}

export function aggregate(records: OperationRecord[], kind: RecordKind, now: string) {
  const quantity = records
    .filter(
      (record) =>
        record.kind === kind &&
        businessDate(record.occurredAt) === businessDate(now) &&
        record.processedAt &&
        Date.parse(record.processedAt) <= Date.parse(now),
    )
    .reduce((sum, record) => sum + record.quantity, 0);
  return { quantity };
}
