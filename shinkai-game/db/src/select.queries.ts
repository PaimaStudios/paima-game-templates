/** Types generated for queries found in "src/queries/select.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetUserStats' parameters type */
export interface IGetUserStatsParams {
  wallet?: string | null | void;
}

/** 'GetUserStats' return type */
export interface IGetUserStatsResult {
  tokens: number;
  wallet: string;
}

/** 'GetUserStats' query type */
export interface IGetUserStatsQuery {
  params: IGetUserStatsParams;
  result: IGetUserStatsResult;
}

const getUserStatsIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":false,"transform":{"type":"scalar"},"locs":[{"a":47,"b":53}]}],"statement":"SELECT * FROM global_user_state\nWHERE wallet = :wallet"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM global_user_state
 * WHERE wallet = :wallet
 * ```
 */
export const getUserStats = new PreparedQuery<IGetUserStatsParams,IGetUserStatsResult>(getUserStatsIR);


/** 'GetWorldStats' parameters type */
export type IGetWorldStatsParams = void;

/** 'GetWorldStats' return type */
export interface IGetWorldStatsResult {
  id: number;
  tokens: number;
}

/** 'GetWorldStats' query type */
export interface IGetWorldStatsQuery {
  params: IGetWorldStatsParams;
  result: IGetWorldStatsResult;
}

const getWorldStatsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM global_world_state"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM global_world_state
 * ```
 */
export const getWorldStats = new PreparedQuery<IGetWorldStatsParams,IGetWorldStatsResult>(getWorldStatsIR);


/** 'GetGameById' parameters type */
export interface IGetGameByIdParams {
  id: number;
}

/** 'GetGameById' return type */
export interface IGetGameByIdResult {
  block_height: number | null;
  id: number;
  prize: number | null;
  stage: string;
  wallet: string;
}

/** 'GetGameById' query type */
export interface IGetGameByIdQuery {
  params: IGetGameByIdParams;
  result: IGetGameByIdResult;
}

const getGameByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":31,"b":34}]}],"statement":"SELECT * FROM game \nWHERE id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM game 
 * WHERE id = :id!
 * ```
 */
export const getGameById = new PreparedQuery<IGetGameByIdParams,IGetGameByIdResult>(getGameByIdIR);


/** 'GetNewGame' parameters type */
export interface IGetNewGameParams {
  wallet: string;
}

/** 'GetNewGame' return type */
export interface IGetNewGameResult {
  block_height: number | null;
  id: number;
  prize: number | null;
  stage: string;
  wallet: string;
}

/** 'GetNewGame' query type */
export interface IGetNewGameQuery {
  params: IGetNewGameParams;
  result: IGetNewGameResult;
}

const getNewGameIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":34,"b":41}]}],"statement":"SELECT * FROM game\nwhere wallet = :wallet!\nand stage = 'new'"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM game
 * where wallet = :wallet!
 * and stage = 'new'
 * ```
 */
export const getNewGame = new PreparedQuery<IGetNewGameParams,IGetNewGameResult>(getNewGameIR);


/** 'GetQuestionAnswer' parameters type */
export interface IGetQuestionAnswerParams {
  game_id: number;
  stage: string;
}

/** 'GetQuestionAnswer' return type */
export interface IGetQuestionAnswerResult {
  answer: string | null;
  block_height: number | null;
  game_id: number;
  message: string | null;
  question: string | null;
  score: number | null;
  stage: string;
}

/** 'GetQuestionAnswer' query type */
export interface IGetQuestionAnswerQuery {
  params: IGetQuestionAnswerParams;
  result: IGetQuestionAnswerResult;
}

const getQuestionAnswerIR: any = {"usedParamSet":{"game_id":true,"stage":true},"params":[{"name":"game_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":47,"b":55}]},{"name":"stage","required":true,"transform":{"type":"scalar"},"locs":[{"a":70,"b":76}]}],"statement":"SELECT * FROM question_answer \nWHERE game_id = :game_id! \nand stage = :stage!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM question_answer 
 * WHERE game_id = :game_id! 
 * and stage = :stage!
 * ```
 */
export const getQuestionAnswer = new PreparedQuery<IGetQuestionAnswerParams,IGetQuestionAnswerResult>(getQuestionAnswerIR);


/** 'GetAllQuestionAnswer' parameters type */
export interface IGetAllQuestionAnswerParams {
  game_id: number;
}

/** 'GetAllQuestionAnswer' return type */
export interface IGetAllQuestionAnswerResult {
  answer: string | null;
  block_height: number | null;
  game_id: number;
  message: string | null;
  question: string | null;
  score: number | null;
  stage: string;
}

/** 'GetAllQuestionAnswer' query type */
export interface IGetAllQuestionAnswerQuery {
  params: IGetAllQuestionAnswerParams;
  result: IGetAllQuestionAnswerResult;
}

const getAllQuestionAnswerIR: any = {"usedParamSet":{"game_id":true},"params":[{"name":"game_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":47,"b":55}]}],"statement":"SELECT * FROM question_answer \nWHERE game_id = :game_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM question_answer 
 * WHERE game_id = :game_id!
 * ```
 */
export const getAllQuestionAnswer = new PreparedQuery<IGetAllQuestionAnswerParams,IGetAllQuestionAnswerResult>(getAllQuestionAnswerIR);


