export type ElementType<T> = T extends ReadonlyArray<infer R> ? R : never;

export type ValuesOf<T> = T[keyof T];

export type StateUpdate<T> = (s: T) => T;

export type RecursivePartial<T> = T extends object
  ? {
      [K in keyof T]?: RecursivePartial<T[K]>;
    }
  : T;
