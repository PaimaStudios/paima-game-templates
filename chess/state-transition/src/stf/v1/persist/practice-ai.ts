import { gameOver } from '@chess/game-logic';
import { Chess } from 'chess.js';
import type Prando from 'paima-sdk/paima-prando';

//
// PracticeAI generates a move based on the current game state and prando.
//
export class PracticeAI {
  chess: Chess;
  randomnessGenerator: Prando;

  constructor(gameState: string, playerMovePgn: string, randomnessGenerator: Prando) {
    this.randomnessGenerator = randomnessGenerator;
    this.chess = new Chess();
    this.chess.load(gameState);
    this.chess.move(playerMovePgn);
  }

  // AI to generate next move
  //
  // Return string with next move
  // Return null to not send next move.
  public getNextMove(): string | null {
    if (gameOver(this.chess.fen())) {
      return null;
    }
    /*
     * Example
     * The code is a pseudo example of
     * what is required to implement this function.
     * NOTE: Do *NOT* use this or any libraries
     * which have their own source of randomness.
     * Otherwise your game node will be non-deterministic
     * and thus your game will break.
     * Only Prando can be used for randomness.
     */

    // const fen = this.chess.fen();
    //
    // import { Game } from 'js-chess-engine'
    // const game = new Game(fen);
    // const AIMove = game.aiMove(1);

    const move = 'Nf3';
    return move;
  }
}
