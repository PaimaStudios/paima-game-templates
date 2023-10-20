import type Prando from '@paima/sdk/prando';
import type {
  MatchEndTickEvent,
  RoundEndTickEvent,
  TurnEndTickEvent,
  MatchState,
  MatchEnvironment,
  TickEvent,
  PostTxTickEvent,
  TxTickEvent,
  PlayCardTickEvent,
  DestroyCardTickEvent,
} from './types';
import { CARD_REGISTRY, MOVE_KIND, TICK_EVENT_KIND } from './constants';
import { deserializeMove, getNonTurnPlayer, getTurnPlayer, matchResults } from '.';
import type { IGetRoundMovesResult } from '@cards/db';
import { genPostTxEvents } from './cards-logic';

// TODO: variable number of players
const numPlayers = 2;

// Executes a round executor tick and generates a tick event as a result
export function processTick(
  matchEnvironment: MatchEnvironment,
  matchState: MatchState,
  // TODO: type for round and match moves is the same, not sure which is provided here
  moves: IGetRoundMovesResult[],
  currentTick: number,
  randomnessGenerator: Prando
): TickEvent[] | null {
  const events: TickEvent[] = [];
  // Every tick we intend to process a single move.
  const rawMove = moves[currentTick - 1];

  // Round ends (by returning null) if no more moves in round or game is finished.
  // This is nearly identical to writing a recursive function, where you want to check
  // the base/halt case before running the rest of the logic.
  if (!rawMove) return null;
  const move = deserializeMove(rawMove.serialized_move);

  // If a move does exist, we continue processing the tick by generating the event.
  // Required for frontend visualization and applying match state updates.
  const postTxEvents: PostTxTickEvent[] = genPostTxEvents(matchState, randomnessGenerator);

  // We then call `applyEvents` to mutate the `matchState` based off of the event.
  for (const event of postTxEvents) {
    applyEvent(matchState, event);
    events.push(event);
  }

  const playCardEvents: PlayCardTickEvent[] =
    move.kind === MOVE_KIND.playCard
      ? [
          {
            kind: TICK_EVENT_KIND.playCard,
            handPosition: move.handPosition,
            newHand: getTurnPlayer(matchState).currentHand.filter(
              (_, i) => i !== move.handPosition
            ),
            newBoard: [
              ...getTurnPlayer(matchState).currentBoard,
              {
                id: move.cardId,
                index: move.cardIndex,
                registryId: move.cardRegistryId,
                hasAttack: false,
              },
            ],
          },
        ]
      : [];
  // We then call `applyEvents` to mutate the `matchState` based off of the event.
  for (const event of playCardEvents) {
    applyEvent(matchState, event);
    events.push(event);
  }

  const destroyCardEvents: DestroyCardTickEvent[] = (() => {
    if (move.kind !== MOVE_KIND.targetCardWithBoardCard) return [];
    const turnPlayer = getTurnPlayer(matchState);
    const nonTurnPlayer = getNonTurnPlayer(matchState);
    if (!turnPlayer.currentBoard[move.fromBoardPosition].hasAttack) return [];
    const fromCardRegistryId = turnPlayer.currentBoard[move.fromBoardPosition]?.registryId;
    const toCardRegistryId = nonTurnPlayer.currentBoard[move.toBoardPosition]?.registryId;
    if (fromCardRegistryId == null || toCardRegistryId == null) return [];
    const fromCard = CARD_REGISTRY[fromCardRegistryId];
    if (fromCard == null) return [];
    if (fromCard.defeats !== toCardRegistryId) return [];
    return [
      {
        kind: TICK_EVENT_KIND.destroyCard,
        fromBoardPosition: move.fromBoardPosition,
        toBoardPosition: move.toBoardPosition,
        newFromBoard: turnPlayer.currentBoard.map((card, i) => {
          if (i === move.fromBoardPosition)
            return {
              ...card,
              hasAttack: false,
            };

          return card;
        }),
        newToBoard: nonTurnPlayer.currentBoard.filter((_, i) => i !== move.toBoardPosition),
      },
    ];
  })();
  for (const event of destroyCardEvents) {
    applyEvent(matchState, event);
    events.push(event);
  }

  const turnEnds = move.kind === MOVE_KIND.endTurn;
  const roundEnds = turnEnds && matchState.turn === numPlayers - 1;

  const turnEndEvents: TurnEndTickEvent[] = turnEnds
    ? [
        {
          kind: TICK_EVENT_KIND.turnEnd,
          damageDealt:
            getNonTurnPlayer(matchState).currentBoard.length === 0
              ? getTurnPlayer(matchState).currentBoard.length
              : 0,
        },
      ]
    : [];
  for (const event of turnEndEvents) {
    applyEvent(matchState, event);
    events.push(event);
  }

  const roundEndEvents: RoundEndTickEvent[] = roundEnds ? [{ kind: TICK_EVENT_KIND.roundEnd }] : [];
  for (const event of roundEndEvents) {
    applyEvent(matchState, event);
    events.push(event);
  }

  const matchEnds = matchState.players.some(player => player.hitPoints <= 0);
  const matchEndEvents: MatchEndTickEvent[] = matchEnds
    ? [{ kind: TICK_EVENT_KIND.matchEnd, result: matchResults(matchState) }]
    : [];
  for (const event of matchEndEvents) {
    applyEvent(matchState, event);
    events.push(event);
  }

  // Note: In this game, move === round. If there were multiple moves per tx round, this wouldn't always happen.
  const txEvents: TxTickEvent[] = [{ kind: TICK_EVENT_KIND.tx, move }];
  for (const event of txEvents) {
    applyEvent(matchState, event);
    events.push(event);
  }

  // We return the tick event which gets emitted by the round executor. This is explicitly
  // for the frontend to know what happened during the current tick.
  return events;
}

// Apply events to match state for the roundExecutor.
export function applyEvent(matchState: MatchState, event: TickEvent): void {
  if (event.kind === TICK_EVENT_KIND.postTx) {
    const turnPlayerIndex = matchState.players.findIndex(player => player.turn === matchState.turn);
    matchState.players[turnPlayerIndex].currentDraw++;
    matchState.players[turnPlayerIndex].currentDeck = event.draw.newDeck;
    if (event.draw.card == null) {
      matchState.players[turnPlayerIndex].hitPoints -= 1;
    } else {
      matchState.players[turnPlayerIndex].currentHand.push(event.draw.card);
    }
    matchState.txEventMove = undefined;
    return;
  }

  if (event.kind === TICK_EVENT_KIND.playCard) {
    const turnPlayerIndex = matchState.players.findIndex(player => player.turn === matchState.turn);
    matchState.players[turnPlayerIndex].currentHand = event.newHand;
    matchState.players[turnPlayerIndex].currentBoard = event.newBoard;
  }

  if (event.kind === TICK_EVENT_KIND.destroyCard) {
    const turnPlayerIndex = matchState.players.findIndex(player => player.turn === matchState.turn);
    const nonTurnPlayerIndex = matchState.players.findIndex(
      player => player.turn !== matchState.turn
    );
    matchState.players[turnPlayerIndex].currentBoard = event.newFromBoard;
    matchState.players[nonTurnPlayerIndex].currentBoard = event.newToBoard;
  }

  if (event.kind === TICK_EVENT_KIND.turnEnd) {
    const nonTurnPlayerIndex = matchState.players.findIndex(
      player => player.turn !== matchState.turn
    );
    matchState.players[nonTurnPlayerIndex].hitPoints -= event.damageDealt;

    for (const player of matchState.players.keys()) {
      for (const boardCard of matchState.players[player].currentBoard.keys()) {
        matchState.players[player].currentBoard[boardCard].hasAttack = true;
      }
    }

    matchState.turn = (matchState.turn + 1) % numPlayers;
    return;
  }

  if (event.kind === TICK_EVENT_KIND.roundEnd) {
    matchState.properRound++;
  }

  if (event.kind === TICK_EVENT_KIND.matchEnd) {
    for (const player of matchState.players.keys()) {
      matchState.players[player].currentResult = event.result[player];
    }
  }

  if (event.kind === TICK_EVENT_KIND.tx) {
    matchState.txEventMove = event.move;
  }
}
