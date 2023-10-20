import type { IGetLobbyPlayersResult } from '@cards/db';
import type {
  CardDbId,
  CardDraw,
  CardCommitmentIndex,
  ConciseResult,
  DrawIndex,
  LobbyPlayer,
  LobbyWithStateProps,
  MatchState,
  Move,
  PostTxTickEvent,
} from './types';
import Prando from '@paima/sdk/prando';
import {
  deserializeBoardCard,
  deserializeHandCard,
  deserializeLocalCard,
  deserializeMove,
} from './helpers';
import { COMMITMENT_LENGTH, MOVE_KIND, TICK_EVENT_KIND } from './constants';
import cryptoRandomString from 'crypto-random-string';

export function isValidMove(
  _randomnessGenerator: Prando,
  _matchState: MatchState,
  _move: Move
): boolean {
  return true;
}

export function matchResults(matchState: MatchState): ConciseResult[] {
  const results: ConciseResult[] = matchState.players.map(player => {
    return player.hitPoints <= 0 ? 'l' : 'w';
  });

  return results;
}

export function genCardDraw(
  currentDraw: DrawIndex,
  currentDeck: CardCommitmentIndex[],
  randomnessGenerator: Prando
): Omit<CardDraw, 'die'> {
  const seed = `${randomnessGenerator.seed}|drawCard|${currentDraw}`;
  const prando = new Prando(seed);
  const cardNumber =
    currentDeck.length === 0 ? undefined : prando.nextInt(0, currentDeck.length - 1);
  return {
    card: cardNumber == null ? undefined : { index: currentDeck[cardNumber], draw: currentDraw },
    newDeck:
      cardNumber == null
        ? []
        : [...currentDeck.slice(0, cardNumber), ...currentDeck.slice(cardNumber + 1)],
  };
}

export function buildCurrentMatchState(
  lobby: LobbyWithStateProps,
  rawPlayers: IGetLobbyPlayersResult[]
): MatchState {
  const players: LobbyPlayer[] = rawPlayers.map(player => {
    if (player.turn == null) throw new Error(`buildCurrentMatchState: player's turn is null`);

    return {
      nftId: player.nft_id,
      hitPoints: player.hit_points,
      startingCommitments: player.starting_commitments,
      currentDeck: player.current_deck,
      currentHand: player.current_hand.map(deserializeHandCard),
      currentBoard: player.current_board.map(deserializeBoardCard),
      currentDraw: player.current_draw,
      currentResult: player.current_result ?? undefined,
      botLocalDeck: player.bot_local_deck?.map(deserializeLocalCard),
      turn: player.turn,
    };
  });

  return {
    players,
    properRound: lobby.current_proper_round,
    turn: lobby.current_turn,
    txEventMove:
      lobby.current_tx_event_move == null
        ? undefined
        : deserializeMove(lobby.current_tx_event_move),
  };
}

export function genPostTxEvents(
  matchState: MatchState,
  randomnessGenerator: Prando
): PostTxTickEvent[] {
  const player = getTurnPlayer(matchState);
  let currentDraw = player.currentDraw;
  let currentDeck = player.currentDeck;
  const events: PostTxTickEvent[] = [];

  // draw 5 at start of match
  if (
    matchState.properRound === 0 &&
    // 1st player's first turn
    (matchState.txEventMove == null ||
      // 2nd player's first turn
      matchState.txEventMove.kind === MOVE_KIND.endTurn)
  ) {
    Array.from(Array(5).keys()).forEach(() => {
      const event = {
        kind: TICK_EVENT_KIND.postTx,
        draw: genCardDraw(currentDraw, currentDeck, randomnessGenerator),
      };
      currentDeck = event.draw.newDeck;
      currentDraw++;
      events.push(event);
    });
    return events;
  }

  // draw 2 at start of turn
  if (matchState.txEventMove?.kind === MOVE_KIND.endTurn) {
    {
      Array.from(Array(2).keys()).forEach(() => {
        const event = {
          kind: TICK_EVENT_KIND.postTx,
          draw: genCardDraw(currentDraw, currentDeck, randomnessGenerator),
        };
        currentDeck = event.draw.newDeck;
        currentDraw++;
        events.push(event);
      });
      return events;
    }
  }

  return [];
}

async function buildCommitment(
  crypto: Crypto,
  salt: string,
  cardId: CardCommitmentIndex
): Promise<Uint8Array> {
  // prepare input for hash function
  const cardIndex = cardId.toString(16).padStart(2, '0');
  const inputBytes = new TextEncoder().encode(cardIndex + salt);
  // Use sha256 hash. It's fast and length extension attacks don't apply to our use-case.
  const hashBytes = await crypto.subtle.digest('SHA-256', inputBytes);
  // Note: For our use-case, finding a pre-image for a commitment is only meaningful for an opponent if they can do so
  // within the duration of the card game so 256 bits is overkill. 128 bits is plenty, and this saves a lot of storage
  // space on-chain. Note 128 → 16 bytes (same as our salt)
  return new Uint8Array(hashBytes.slice(0, COMMITMENT_LENGTH));
}

export async function genCommitments(
  crypto: Crypto,
  deck: CardDbId[]
): Promise<{
  commitments: Uint8Array;
  salt: string[];
}> {
  const raw = await Promise.all(
    deck.map(async cardId => {
      // Generate salt for each card to avoid brute-force attacks.
      // Use COMMITMENT_LENGTH bytes as that's the most security we can get.
      const salt = cryptoRandomString({ length: COMMITMENT_LENGTH * 2 });
      return {
        commitment: await buildCommitment(crypto, salt, cardId),
        salt,
      };
    })
  );

  const commitments = new Uint8Array(raw.length * COMMITMENT_LENGTH);
  raw.forEach(({ commitment }, i) => {
    commitments.set(commitment, i * COMMITMENT_LENGTH);
  });
  const salt = raw.map(r => r.salt);

  return {
    commitments,
    salt,
  };
}

export async function checkCommitment(
  crypto: Crypto,
  commitments: Uint8Array,
  index: number,
  salt: string,
  cardId: CardDbId
): Promise<boolean> {
  const commitment = commitments.slice(index * COMMITMENT_LENGTH, (index + 1) * COMMITMENT_LENGTH);
  if (commitment.length !== COMMITMENT_LENGTH) return false;

  const responseCommitment = await buildCommitment(crypto, salt, cardId);
  return commitment.toString() === responseCommitment.toString();
}

export function getTurnPlayer(matchState: MatchState): LobbyPlayer {
  const turnPlayer = matchState.players.find(player => player.turn === matchState.turn);
  if (turnPlayer == null) throw new Error(`getTurnPlayer: missing player for turn`);
  return turnPlayer;
}

export function getNonTurnPlayer(matchState: MatchState): LobbyPlayer {
  const nonTurnPlayer = matchState.players.find(player => player.turn !== matchState.turn);
  if (nonTurnPlayer == null) throw new Error(`getTurnPlayer: missing player for turn`);
  return nonTurnPlayer;
}
