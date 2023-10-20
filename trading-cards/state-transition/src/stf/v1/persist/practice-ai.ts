import type { MatchState, Move } from '@cards/game-logic';
import {
  CARD_REGISTRY,
  MOVE_KIND,
  applyEvent,
  genPostTxEvents,
  getNonTurnPlayer,
  getTurnPlayer,
} from '@cards/game-logic';
import { PRACTICE_BOT_NFT_ID } from '@cards/utils';
import type Prando from '@paima/sdk/prando';

//
// PracticeAI generates a move based on the current game state and prando.
//
export class PracticeAI {
  randomnessGenerator: Prando;
  matchState: MatchState;

  constructor(matchState: MatchState, randomnessGenerator: Prando) {
    this.randomnessGenerator = randomnessGenerator;

    const postTx = genPostTxEvents(matchState, randomnessGenerator);
    postTx.forEach(event => {
      applyEvent(matchState, event);
    });
    this.matchState = matchState;
  }

  // AI to generate next move
  //
  // Return next move
  // Return null to not send next move.
  public getNextMove(): Move {
    const me = getTurnPlayer(this.matchState);
    const them = getNonTurnPlayer(this.matchState);

    if (me.nftId !== PRACTICE_BOT_NFT_ID)
      throw new Error(`getNextMove: bot move for non-bot player`);
    if (me.botLocalDeck == null) throw new Error(`getNextMove: bot does not have a deck saved`);

    if (me.currentBoard.length < 2 && me.currentHand.length > 0) {
      return {
        kind: MOVE_KIND.playCard,
        handPosition: 0,
        cardIndex: me.currentHand[0].index,
        cardId: me.botLocalDeck[me.currentHand[0].index].id,
        cardRegistryId: me.botLocalDeck[me.currentHand[0].index].registryId,
        salt: me.botLocalDeck[me.currentHand[0].index].salt,
      };
    }

    for (const [myCardPos, myCard] of me.currentBoard.entries()) {
      if (myCard.hasAttack) {
        for (const [theirCardPos, theirCard] of them.currentBoard.entries()) {
          if (CARD_REGISTRY[myCard.registryId]?.defeats === theirCard.registryId) {
            return {
              kind: MOVE_KIND.targetCardWithBoardCard,
              fromBoardPosition: myCardPos,
              toBoardPosition: theirCardPos,
            };
          }
        }
      }
    }

    return { kind: MOVE_KIND.endTurn };
  }
}
