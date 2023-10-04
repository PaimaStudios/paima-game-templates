import type Prando from '@paima/sdk/prando';

//
// PracticeAI generates a move based on the current game state and prando.
//
export class PracticeAI {
  constructor(randomnessGenerator: Prando) {}

  // AI to generate next move
  //
  // Return string with next move
  // Return null to not send next move.
  public getNextMove(): string | null {
    return null;
  }
}
