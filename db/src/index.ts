import { SQLUpdate } from '@paima/node-sdk/db.js';
import { PreparedQuery } from '@pgtyped/runtime';
import { cyrb128, sfc32 } from './rng.js';

export * from './canvas.queries.js';
export * from './pool.js';

export function sqlUpdate<TParam, TResult>(
  statement: PreparedQuery<TParam, TResult>,
  params: TParam
): SQLUpdate {
  return [statement, params];
}

export function rngForCanvas(canvasId: number): () => number {
  return sfc32(...cyrb128(`${canvasId}`));
}

export function rngForColor(canvasId: number, color: string): () => number {
  return sfc32(...cyrb128(`${canvasId}${color}`));
}
