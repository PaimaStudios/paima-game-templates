/** Types generated for queries found in "src/queries/insert.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'CreateGlobalUserState' parameters type */
export interface ICreateGlobalUserStateParams {
  wallet: string;
}

/** 'CreateGlobalUserState' return type */
export type ICreateGlobalUserStateResult = void;

/** 'CreateGlobalUserState' query type */
export interface ICreateGlobalUserStateQuery {
  params: ICreateGlobalUserStateParams;
  result: ICreateGlobalUserStateResult;
}

const createGlobalUserStateIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":54,"b":61}]}],"statement":"INSERT INTO global_user_state (\n  wallet\n) VALUES (\n  :wallet!\n)\nON CONFLICT (wallet)\nDO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO global_user_state (
 *   wallet
 * ) VALUES (
 *   :wallet!
 * )
 * ON CONFLICT (wallet)
 * DO NOTHING
 * ```
 */
export const createGlobalUserState = new PreparedQuery<ICreateGlobalUserStateParams,ICreateGlobalUserStateResult>(createGlobalUserStateIR);


/** 'NewGame' parameters type */
export interface INewGameParams {
  wallet: string;
}

/** 'NewGame' return type */
export type INewGameResult = void;

/** 'NewGame' query type */
export interface INewGameQuery {
  params: INewGameParams;
  result: INewGameResult;
}

const newGameIR: any = {"usedParamSet":{"wallet":true},"params":[{"name":"wallet","required":true,"transform":{"type":"scalar"},"locs":[{"a":41,"b":48}]}],"statement":"INSERT INTO game (\n  wallet\n) VALUES (\n  :wallet!\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO game (
 *   wallet
 * ) VALUES (
 *   :wallet!
 * )
 * ```
 */
export const newGame = new PreparedQuery<INewGameParams,INewGameResult>(newGameIR);


/** 'NewQuestionAnswer' parameters type */
export interface INewQuestionAnswerParams {
  game_id: number;
  question: string;
  stage: string;
}

/** 'NewQuestionAnswer' return type */
export type INewQuestionAnswerResult = void;

/** 'NewQuestionAnswer' query type */
export interface INewQuestionAnswerQuery {
  params: INewQuestionAnswerParams;
  result: INewQuestionAnswerResult;
}

const newQuestionAnswerIR: any = {"usedParamSet":{"game_id":true,"stage":true,"question":true},"params":[{"name":"game_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":72,"b":80}]},{"name":"stage","required":true,"transform":{"type":"scalar"},"locs":[{"a":85,"b":91}]},{"name":"question","required":true,"transform":{"type":"scalar"},"locs":[{"a":96,"b":105}]}],"statement":"INSERT INTO question_answer (\n game_id,\n stage,\n question \n) VALUES (\n  :game_id!,\n  :stage!,\n  :question!\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO question_answer (
 *  game_id,
 *  stage,
 *  question 
 * ) VALUES (
 *   :game_id!,
 *   :stage!,
 *   :question!
 * )
 * ```
 */
export const newQuestionAnswer = new PreparedQuery<INewQuestionAnswerParams,INewQuestionAnswerResult>(newQuestionAnswerIR);


