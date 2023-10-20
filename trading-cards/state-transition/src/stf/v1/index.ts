import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import { SCHEDULED_DATA_ADDRESS, type SubmittedChainData } from '@paima/sdk/utils';
import {
  createdLobby,
  joinedLobby,
  closedLobby,
  submittedMoves,
  practiceMoves,
  mintNft,
  cardPackBuy,
  mintTradeNft,
  setTradeNftCards,
  claimTradeNftCards,
  zombieRound,
  updateStats,
} from './transition';
import type { SQLUpdate } from '@paima/sdk/db';
import { GENERIC_PAYMENT_MESSAGES, PARSER_KEYS } from '@cards/game-logic';
import { ZERO_ADDRESS } from '@cards/utils';

export default async function (
  inputData: SubmittedChainData,
  blockHeight: number,
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log(inputData, 'parsing input data');
  const user = inputData.userAddress.toLowerCase();
  const parsed = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${parsed.input}`);

  switch (parsed.input) {
    case PARSER_KEYS.accountMint:
      return mintNft(parsed);
    case PARSER_KEYS.tradeNftMint:
      return mintTradeNft(parsed);
    case PARSER_KEYS.genericPayment: {
      if (inputData.userAddress !== SCHEDULED_DATA_ADDRESS) {
        console.log('DISCARD: scheduled data from regular address');
        return [];
      }

      switch (parsed.message) {
        case GENERIC_PAYMENT_MESSAGES.buyCardPack: {
          return cardPackBuy(parsed, dbConn, randomnessGenerator);
        }
        default: {
          console.log('DISCARD: unknown message');
          return [];
        }
      }
    }
    case PARSER_KEYS.createdLobby:
      return createdLobby(user, blockHeight, parsed, dbConn, randomnessGenerator);
    case PARSER_KEYS.joinedLobby:
      return joinedLobby(user, blockHeight, parsed, dbConn, randomnessGenerator);
    case PARSER_KEYS.closedLobby:
      return closedLobby(user, parsed, dbConn);
    case PARSER_KEYS.submittedMoves:
      return submittedMoves(user, blockHeight, parsed, dbConn);
    case PARSER_KEYS.practiceMoves:
      return practiceMoves(user, blockHeight, parsed, dbConn);
    case PARSER_KEYS.zombieScheduledData:
      return zombieRound(blockHeight, parsed, dbConn, randomnessGenerator);
    case PARSER_KEYS.userScheduledData:
      return updateStats(parsed, dbConn);
    case PARSER_KEYS.setTradeNftCards: {
      return setTradeNftCards(user, parsed, dbConn);
    }
    case PARSER_KEYS.transferTradeNft: {
      if (inputData.userAddress !== SCHEDULED_DATA_ADDRESS) {
        console.log('DISCARD: scheduled data from regular address');
        return [];
      }

      if (parsed.to !== ZERO_ADDRESS) {
        console.log('DISCARD: not a burn transfer, we only watch burn transfers');
        return [];
      }

      return claimTradeNftCards(parsed, dbConn);
    }
    default:
      return [];
  }
}
