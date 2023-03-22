import type Prando from 'paima-sdk/paima-prando';
import type { MatchMove, MatchEnvironment, MatchState } from './types';
import type { ConciseResult, MatchResult, UserLobby } from '@chess/utils';
import { Chess } from 'chess.js';
import type { WalletAddress } from 'paima-sdk/paima-utils';

export function detectWin(chess: Chess): boolean {
  return chess.isCheckmate();
}

export function gameOverFromChess(chess: Chess): boolean {
  return chess.isGameOver();
}

export function gameOver(fenBoard: string): boolean {
  const chess = new Chess();
  chess.load(fenBoard);
  return gameOverFromChess(chess);
}

export function detectDraw(chess: Chess): boolean {
  return chess.isDraw();
}

export function didPlayerWin(playerColor: string, fen: string): boolean {
  const chess = new Chess();
  chess.load(fen);

  if (chess.isCheckmate() && chess.turn() !== playerColor) {
    return true;
  } else {
    return false;
  }
}

export function isPlayersTurn(player: WalletAddress, lobby: UserLobby) {
  const chess = new Chess();
  chess.load(lobby.latest_match_state);

  const isCreator = lobby.lobby_creator === player;
  const playerColor = isCreator === lobby.player_one_iswhite ? 'w' : 'b';
  return chess.turn() === playerColor;
}

export function matchResults(
  matchState: MatchState,
  matchEnvironment: MatchEnvironment
): MatchResult {
  // We compute the winner
  const user1won = didPlayerWin(matchEnvironment.user1.color, matchState.fenBoard);
  const user2won = didPlayerWin(matchEnvironment.user2.color, matchState.fenBoard);
  // Assign the winner to a variable called winner. If no one won, winner is null
  const winner = user1won
    ? matchEnvironment.user1.wallet
    : user2won
    ? matchEnvironment.user2.wallet
    : null;

  console.log(`${winner} won match.`);

  const results: [ConciseResult, ConciseResult] = !winner
    ? ['t', 't']
    : winner === matchEnvironment.user1.wallet
    ? ['w', 'l']
    : ['l', 'w'];

  return results;
}

// Updates the fenBoard string by applying a new move
export function updateBoard(fenBoard: string, move: string): string {
  const chess = new Chess();
  chess.load(fenBoard);
  chess.move(move);
  return chess.fen();
}

// Verifies if a provided move is valid on the current fenBoard
export function isValidMove(fenBoard: string, move: string): boolean {
  const chess = new Chess();
  chess.load(fenBoard);
  try {
    chess.move(move);
    return true;
  } catch (_) {
    return false;
  }
}

export function generateRandomMove(positions: string, randomnessGenerator: Prando): MatchMove {
  const chess = new Chess();
  chess.load(positions);
  const possibleMoves = chess.moves();
  return possibleMoves[randomnessGenerator.next(0, possibleMoves.length)];
}
