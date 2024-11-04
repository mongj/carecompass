export type AllowEmptyString<T> = T extends string ? T | "" : T;

export type OptionalEnumFields<T> = {
  [K in keyof T]: T[K] extends string ? AllowEmptyString<T[K]> : T[K];
};
