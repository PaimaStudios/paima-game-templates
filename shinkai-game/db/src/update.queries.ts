/** Types generated for queries found in "src/queries/update.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'UpdateUserGlobalPosition' parameters type */
export interface IUpdateUserGlobalPositionParams {
  change: number;
  wallet: string;
}

/** 'UpdateUserGlobalPosition' return type */
export type IUpdateUserGlobalPositionResult = void;

/** 'UpdateUserGlobalPosition' query type */
export interface IUpdateUserGlobalPositionQuery {
  params: IUpdateUserGlobalPositionParams;
  result: IUpdateUserGlobalPositionResult;
}

const updateUserGlobalPositionIR: any = {"usedParamSet":{"change":true,"wallet":true},"params":[{"name":"change","required":true,"transform":{"type":"scalar"},"locs":[{"a":47,"b":54}]},{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":78}]}],"statement":"UPDATE global_user_state\nSET tokens = tokens + :change!\nWHERE wallet = :wallet!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE global_user_state
 * SET tokens = tokens + :change!
 * WHERE wallet = :wallet!
 * ```
 */
export const updateUserGlobalPosition = new PreparedQuery<IUpdateUserGlobalPositionParams,IUpdateUserGlobalPositionResult>(updateUserGlobalPositionIR);


/** 'SetAnswer' parameters type */
export interface ISetAnswerParams {
  answer: string;
  game_id: number;
  score: number;
  stage: string;
}

/** 'SetAnswer' return type */
export type ISetAnswerResult = void;

/** 'SetAnswer' query type */
export interface ISetAnswerQuery {
  params: ISetAnswerParams;
  result: ISetAnswerResult;
}

const setAnswerIR: any = {"usedParamSet":{"answer":true,"score":true,"game_id":true,"stage":true},"params":[{"name":"answer","required":true,"transform":{"type":"scalar"},"locs":[{"a":36,"b":43}]},{"name":"score","required":true,"transform":{"type":"scalar"},"locs":[{"a":54,"b":60}]},{"name":"game_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":78,"b":86}]},{"name":"stage","required":true,"transform":{"type":"scalar"},"locs":[{"a":101,"b":107}]}],"statement":"UPDATE question_answer\nSET answer = :answer!, score = :score!\nWHERE game_id = :game_id! \nAND stage = :stage!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE question_answer
 * SET answer = :answer!, score = :score!
 * WHERE game_id = :game_id! 
 * AND stage = :stage!
 * ```
 */
export const setAnswer = new PreparedQuery<ISetAnswerParams,ISetAnswerResult>(setAnswerIR);


/** 'UpdateGame' parameters type */
export interface IUpdateGameParams {
  block_height: number;
  id: number;
  prize?: number | null | void;
  stage: string;
}

/** 'UpdateGame' return type */
export type IUpdateGameResult = void;

/** 'UpdateGame' query type */
export interface IUpdateGameQuery {
  params: IUpdateGameParams;
  result: IUpdateGameResult;
}

const updateGameIR: any = {"usedParamSet":{"stage":true,"block_height":true,"prize":true,"id":true},"params":[{"name":"stage","required":true,"transform":{"type":"scalar"},"locs":[{"a":27,"b":33}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":52,"b":65}]},{"name":"prize","required":false,"transform":{"type":"scalar"},"locs":[{"a":77,"b":82}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":97,"b":100}]}],"statement":"UPDATE game \nSET \n stage = :stage!,\n block_height = :block_height!,\n prize = :prize\nWHERE \n id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE game 
 * SET 
 *  stage = :stage!,
 *  block_height = :block_height!,
 *  prize = :prize
 * WHERE 
 *  id = :id!
 * ```
 */
export const updateGame = new PreparedQuery<IUpdateGameParams,IUpdateGameResult>(updateGameIR);


/** 'UpdateTokens' parameters type */
export interface IUpdateTokensParams {
  change: number;
}

/** 'UpdateTokens' return type */
export type IUpdateTokensResult = void;

/** 'UpdateTokens' query type */
export interface IUpdateTokensQuery {
  params: IUpdateTokensParams;
  result: IUpdateTokensResult;
}

const updateTokensIR: any = {"usedParamSet":{"change":true},"params":[{"name":"change","required":true,"transform":{"type":"scalar"},"locs":[{"a":48,"b":55}]}],"statement":"UPDATE global_world_state\nset tokens = tokens + :change!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE global_world_state
 * set tokens = tokens + :change!
 * ```
 */
export const updateTokens = new PreparedQuery<IUpdateTokensParams,IUpdateTokensResult>(updateTokensIR);


