export type PropertiesNonNullable<T> = { [P in keyof T]-?: NonNullable<T[P]> };
