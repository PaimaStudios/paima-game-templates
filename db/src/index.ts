import { SQLUpdate } from '@paima/node-sdk/db.js';
import { PreparedQuery } from '@pgtyped/runtime';

export * from './canvas.queries.js';
export * from './pool.js';

export function sqlUpdate<TParam, TResult>(
  statement: PreparedQuery<TParam, TResult>,
  params: TParam
): SQLUpdate {
  return [statement, params];
}
