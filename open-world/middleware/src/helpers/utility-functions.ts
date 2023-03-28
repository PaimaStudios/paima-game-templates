import { ENV } from 'paima-sdk/paima-utils';
import { buildEndpointErrorFxn, OpenWorldMiddlewareErrorCode } from '../errors';
import type { RoundEnd } from '../types';

export function calculateRoundEnd(
  roundStart: number,
  roundLength: number,
  current: number
): RoundEnd {
  const errorFxn = buildEndpointErrorFxn('calculateRoundEnd');

  let roundEnd = roundStart + roundLength;
  if (roundEnd < current) {
    errorFxn(OpenWorldMiddlewareErrorCode.CALCULATED_ROUND_END_IN_PAST);
    roundEnd = current;
  }

  try {
    const blocksToEnd = roundEnd - current;
    const secsPerBlock = ENV.BLOCK_TIME;
    const secondsToEnd = blocksToEnd * secsPerBlock;
    return {
      blocks: blocksToEnd,
      seconds: secondsToEnd,
    };
  } catch (err) {
    errorFxn(OpenWorldMiddlewareErrorCode.INTERNAL_INVALID_DEPLOYMENT, err);
    return {
      blocks: 0,
      seconds: 0,
    };
  }
}
