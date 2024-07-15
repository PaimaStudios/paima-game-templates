import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import { ENV, type SubmittedChainData } from '@paima/sdk/utils';
import { createScheduledData, type SQLUpdate } from '@paima/node-sdk/db';
import { ShinkaiAPI } from '@game/shinkai';
import type {
  ICreateGlobalUserStateParams,
  IGetUserStatsResult,
  INewGameParams,
  INewQuestionAnswerParams,
  ISetAnswerParams,
  IUpdateGameParams,
  IUpdateTokensParams,
  IUpdateUserGlobalPositionParams,
} from '@game/db';
import {
  getGameById,
  newGame,
  newQuestionAnswer,
  setAnswer,
  getQuestionAnswer,
  updateGame,
  getWorldStats,
  updateUserGlobalPosition,
  updateTokens,
  getUserStats,
  createGlobalUserState,
  getAllQuestionAnswer,
} from '@game/db';
import type { AIInput, NewGameInput, TickInput } from './types.js';
import { bisonPrompt, monkeyPrompt, pandaPrompt, tigerPrompt } from './persist/prompts.js';

(async () => {
  try {
    const start = new Date().getTime();
    console.log('This is Quickstart AI test.');
    const question = `1+1`;
    const shinkai = new ShinkaiAPI();
    await shinkai.init();
    const ai = await shinkai.askQuestion(question);
    const time = new Date().getTime() - start;
    console.log(`Quickstart check (${time}[mS])`, ai);
  } catch (e) {
    console.log('Quickstart', e);
  }
})();

async function tickCommand(input: TickInput, blockHeight: number) {
  const sqlUpdate: SQLUpdate[] = [];
  // Update world tokens
  const updateTokensParams: IUpdateTokensParams = {
    change: 20,
  };
  sqlUpdate.push([updateTokens, updateTokensParams]);
  sqlUpdate.push(createScheduledData(`tick|${input.n + 1}`, blockHeight + 60 / ENV.BLOCK_TIME));
  return sqlUpdate;
}

async function newGameCommand(
  input: NewGameInput,
  user: string,
  userData: IGetUserStatsResult | null
) {
  const sqlUpdate: SQLUpdate[] = [];
  if (!userData) {
    const createGlobalUserStateParams: ICreateGlobalUserStateParams = {
      wallet: user,
    };
    sqlUpdate.push([createGlobalUserState, createGlobalUserStateParams]);
  }
  const params: INewGameParams = {
    wallet: user,
  };
  sqlUpdate.push([newGame, params]);
  return sqlUpdate;
}

async function aiCommand(input: AIInput, user: string, blockHeight: number, dbConn: Pool) {
  const [game] = await getGameById.run({ id: input.id }, dbConn);
  if (!game) {
    console.log('Invalid ID');
    return [];
  }
  if (game.wallet !== user) {
    console.log('Not players game');
    return [];
  }
  const [qa] = await getQuestionAnswer.run(
    {
      game_id: input.id,
      stage: input.target,
    },
    dbConn
  );
  if (qa) {
    console.log('This stage has been responded');
    return [];
  }
  const shinkai = new ShinkaiAPI();
  await shinkai.init();

  const [worldStats] = await getWorldStats.run(undefined, dbConn);
  // [100, 1000] tokens per game
  const maxTokens = Math.max(100, Math.min(worldStats.tokens, 1000));
  const sqlUpdate: SQLUpdate[] = [];
  const updateGameParams: IUpdateGameParams = {
    stage: input.target,
    block_height: blockHeight,
    id: input.id,
  };
  let ai = '';
  let score = 0;
  switch (input.target) {
    case 'tiger': {
      const [r1, r2] = await Promise.all([
        shinkai.askQuestion(tigerPrompt(input.response, 'text')),
        shinkai.askQuestion(tigerPrompt(input.response, 'score')),
      ]);
      console.log(r1, r2);
      ai = r1.response;
      score = parseInt(r2.response, 10);
      break;
    }
    case 'monkey': {
      const [r1, r2] = await Promise.all([
        shinkai.askQuestion(monkeyPrompt(input.response, 'text')),
        shinkai.askQuestion(monkeyPrompt(input.response, 'score')),
      ]);
      console.log(r1, r2);
      ai = r1.response;
      score = parseInt(r2.response, 10);
      break;
    }
    case 'bison': {
      const [r1, r2] = await Promise.all([
        shinkai.askQuestion(bisonPrompt(input.response, 'text')),
        shinkai.askQuestion(bisonPrompt(input.response, 'score')),
      ]);
      console.log(r1, r2);
      ai = r1.response;
      score = parseInt(r2.response, 10);
      break;
    }
    case 'panda': {
      const [r1, r2] = await Promise.all([
        shinkai.askQuestion(pandaPrompt(input.response, 'text')),
        shinkai.askQuestion(pandaPrompt(input.response, 'score')),
      ]);
      console.log(r1, r2);
      ai = r1.response;
      score = parseInt(r2.response, 10);

      const court = await getAllQuestionAnswer.run(
        {
          game_id: game.id,
        },
        dbConn
      );

      const multiplier: number = court
        .map(c => c.score)
        .filter((c): c is number => !!c)
        .reduce((a, b) => (a ?? 0) + (b ?? 0), 0);

      const prize = (((score ?? 0) / 100) * maxTokens * (multiplier / 100)) | 0;
      updateGameParams.prize = prize;

      // Update user tokens
      const updateUserGlobalPositionParams: IUpdateUserGlobalPositionParams = {
        change: prize,
        wallet: user,
      };
      sqlUpdate.push([updateUserGlobalPosition, updateUserGlobalPositionParams]);

      // Update world tokens
      const updateTokensParams: IUpdateTokensParams = {
        change: -1 * prize,
      };
      sqlUpdate.push([updateTokens, updateTokensParams]);
      break;
    }
  }
  // Update Game State
  sqlUpdate.push([updateGame, updateGameParams]);
  console.log('AI Response ', ai);

  // Insert Response
  const newQuestionAnswerParams: INewQuestionAnswerParams = {
    game_id: input.id,
    question: input.response,
    stage: input.target,
  };
  sqlUpdate.push([newQuestionAnswer, newQuestionAnswerParams]);

  // Update Response
  const setAnswerParams: ISetAnswerParams = {
    game_id: input.id,
    answer: ai,
    score,
    stage: input.target,
  };
  sqlUpdate.push([setAnswer, setAnswerParams]);
  return sqlUpdate;
}

// entrypoint for your state machine
export default async function (
  inputData: SubmittedChainData,
  blockHeight: number,
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log(inputData, 'parsing input data');
  const user = inputData.userAddress.toLowerCase();
  const input = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${input.input}`);
  const [userData] = await getUserStats.run({}, dbConn);

  switch (input.input) {
    case 'tick':
      return await tickCommand(input, blockHeight);
    case 'newGame':
      return await newGameCommand(input, user, userData);
    case 'ai':
      return await aiCommand(input, user, blockHeight, dbConn);
    default:
      return [];
  }
}
