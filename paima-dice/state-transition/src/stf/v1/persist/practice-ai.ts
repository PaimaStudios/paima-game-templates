import { genDiceRolls, getTurnPlayer } from '@dice/game-logic';
import { PRACTICE_BOT_NFT_ID, type MatchState } from '@dice/utils';
import type Prando from '@paima/sdk/prando';

//
// PracticeAI generates a move based on the current game state and prando.
//
export class PracticeAI {
  randomnessGenerator: Prando;
  matchState: MatchState;

  constructor(matchState: MatchState, randomnessGenerator: Prando) {
    this.randomnessGenerator = randomnessGenerator;
    this.matchState = matchState;
  }

  // AI to generate next move
  //
  // Return next move
  // Return null to not send next move.
  public getNextMove(): boolean {
    const me = getTurnPlayer(this.matchState);
    if (me.nftId !== PRACTICE_BOT_NFT_ID)
      throw new Error(`getNextMove: bot move for non-bot player`);
    const diceRolls = genDiceRolls(me.score, this.randomnessGenerator);
    return diceRolls.finalScore < 19;
  }
}
