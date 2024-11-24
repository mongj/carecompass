export type AllowEmptyString<T> = T extends string ? T | "" : T;

export type OptionalEnumFields<T> = {
  [K in keyof T]: T[K] extends string ? AllowEmptyString<T[K]> : T[K];
};

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
