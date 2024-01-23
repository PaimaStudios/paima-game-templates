export * from './select.queries.js';
export * from './insert.queries.js';
export * from './update.queries.js';
export * from './helpers.js';
export type { Pool } from 'pg';
export { creds, requirePool } from './pgPool.js';

// https://github.com/adelsz/pgtyped/issues/565
export type numberArray = (number)[];
export type stringArray = (string)[];
