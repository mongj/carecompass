export function getRecordKeys<T extends string>(record: Record<T, unknown>) {
  return Object.keys(record) as T[];
}
