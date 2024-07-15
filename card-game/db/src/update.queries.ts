/** Types generated for queries found in "src/queries/update.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'FlipCard' parameters type */
export interface IFlipCardParams {
  card: number;
}

/** 'FlipCard' return type */
export type IFlipCardResult = void;

/** 'FlipCard' query type */
export interface IFlipCardQuery {
  params: IFlipCardParams;
  result: IFlipCardResult;
}

const flipCardIR: any = {"usedParamSet":{"card":true},"params":[{"name":"card","required":true,"transform":{"type":"scalar"},"locs":[{"a":59,"b":64}]}],"statement":"UPDATE global_cards\nSET upwards = NOT upwards\nWHERE card = :card!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE global_cards
 * SET upwards = NOT upwards
 * WHERE card = :card!
 * ```
 */
export const flipCard = new PreparedQuery<IFlipCardParams,IFlipCardResult>(flipCardIR);


