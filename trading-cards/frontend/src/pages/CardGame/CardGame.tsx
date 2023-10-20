import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, CircularProgress, Modal, Typography } from "@mui/material";
import "./CardGame.scss";
import type {
  MatchState,
  TickEvent,
  LobbyState,
  PostTxTickEvent,
  Move,
  LocalCard,
  CardCommitmentIndex,
  BoardCard,
  HandCard,
} from "@cards/game-logic";
import {
  applyEvent,
  CARD_REGISTRY,
  genPostTxEvents,
  getTurnPlayer,
  MOVE_KIND,
  TICK_EVENT_KIND,
} from "@cards/game-logic";
import * as Paima from "@cards/middleware";
import Prando from "@paima/sdk/prando";
import Player from "./Player";
import { useNavigate } from "react-router-dom";
import { Page } from "../PageCoordinator";

interface CardGameProps {
  lobbyState: LobbyState;
  refetchLobbyState: () => Promise<void>;
  selectedNft: number;
  localDeck: LocalCard[];
}

const CardsGame: React.FC<CardGameProps> = ({
  lobbyState,
  refetchLobbyState,
  selectedNft,
  localDeck,
}) => {
  const navigate = useNavigate();
  // awaiting user to sign the transaction
  const [awaitingSign, setAwaitingSign] = useState(false);
  // waiting for a tx to be accepted and processed by the backend
  const [awaitingTxEffect, rawSetAwaitingTxEffect] = useState(false);
  const setAwaitingTxEffect = useCallback((value: boolean) => {
    // We want to disable interaction after a successful tx while we wait for the backend to process it.
    // But, if it takes too long (10s), something might have gone wrong, so we let the user try again.

    rawSetAwaitingTxEffect(value);
    if (value) {
      setTimeout(() => {
        rawSetAwaitingTxEffect(false);
      }, 10_000);
    }
  }, []);
  const [selectedCard, setSelectedCard] = useState<
    undefined | BoardCard | HandCard
  >();
  const [caption, setCaption] = useState<undefined | string>();
  const [matchResult, setMatchResult] = useState<undefined | string>();

  // Game data for what is being currently shown to user.
  // Lags behind lobby's current state when waiting for animations.
  // Jumps ahead when letting user interact with the game.
  const [display, setDisplay] = useState<{
    round: number;
    matchState: MatchState;
    isPostTxDone: boolean;
  }>({
    round: lobbyState.current_round,
    matchState: {
      turn: lobbyState.current_turn,
      properRound: lobbyState.current_proper_round,
      players: lobbyState.players,
      txEventMove: lobbyState.txEventMove,
    },
    isPostTxDone: false,
  });
  const matchOver = useMemo(() => {
    if (
      display.matchState.players.some((player) => player.currentResult != null)
    ) {
      if (
        display.matchState.players.some(
          (player) => player.currentResult == null
        )
      )
        throw new Error(
          `CardsGame: inconsistent match state, only some players have result`
        );

      return true;
    }

    return false;
  }, [display.matchState]);

  // cache of state that was fetched, but still needs to be displayed
  // the actual round executor is stateful so we store all it's end results instead
  const [roundExecutor, setRoundExecutor] = useState<
    | undefined
    | {
        tickEvents: TickEvent[];
        endState: MatchState;
      }
  >();
  const [isTickDisplaying, setIsTickDisplaying] = useState(false);

  const { thisPlayer, opponent } = useMemo(() => {
    const thisPlayer = display.matchState.players.find(
      (player) => player.nftId === selectedNft
    );
    if (thisPlayer == null) throw new Error(`CardsGame: nft not in lobby`);

    const opponent = display.matchState.players.find(
      (player) => player.nftId !== selectedNft
    );
    if (opponent == null) throw new Error(`CardsGame: opponent not in lobby`);
    return { thisPlayer, opponent };
  }, [selectedNft, display]);

  // Note: we could just async play the post tx animations, but in some games you want a user interaction for it.
  // E.g. in blackjack dice we let the user click "roll" to roll their dice at the start of their turn.
  const [postTxEventQueue, setPostTxEventQueue] = useState<PostTxTickEvent[]>(
    []
  );

  useEffect(() => {
    // Set post-tx event queue:
    // Someone submitted a tx and it now this player's turn. This means we have to play
    // post-tx events from the start of the current round (interactively, before executor is available).
    // In cards this can mean they chose to draw a card and are waiting for it to happen.

    if (
      matchOver ||
      // not displaying current round
      display.round < lobbyState.current_round ||
      // not interactive round
      thisPlayer.turn !== lobbyState.current_turn ||
      // already set
      postTxEventQueue.length !== 0 ||
      display.isPostTxDone
    )
      return;

    setPostTxEventQueue(
      genPostTxEvents(display.matchState, new Prando(lobbyState.roundSeed))
    );
    setDisplay((oldDisplay) => ({
      ...oldDisplay,
      isPostTxDone: true,
    }));
    setAwaitingTxEffect(false);
  }, [
    display,
    lobbyState,
    thisPlayer,
    postTxEventQueue,
    matchOver,
    setAwaitingTxEffect,
  ]);

  useEffect(
    () =>
      void (async () => {
        // Play post-tx event, this doesn't have to be just an effect, see comment before the queue.
        if (isTickDisplaying || postTxEventQueue.length === 0) return;

        setIsTickDisplaying(true);
        const [playedEvent, ...restEvents] = postTxEventQueue;
        setPostTxEventQueue(restEvents);
        setDisplay((oldDisplay) => {
          const newMatchState = structuredClone(oldDisplay.matchState);
          applyEvent(newMatchState, playedEvent);
          return {
            ...oldDisplay,
            matchState: newMatchState,
          };
        });

        if (playedEvent.draw.card != null) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        if (playedEvent.draw.card == null) {
          setCaption(
            (() => {
              const turnPlayer = getTurnPlayer(display.matchState);

              return turnPlayer.nftId === selectedNft
                ? "You overdraw a card and take 1 damage!"
                : "Your opponent overdraws a card and takes 1 damage!";
            })()
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setCaption(undefined);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsTickDisplaying(false);
      })(),
    [display, isTickDisplaying, postTxEventQueue, selectedNft]
  );

  async function submit(move: Move) {
    try {
      setAwaitingSign(true);
      const moveResult = await Paima.default.submitMoves(
        selectedNft,
        lobbyState.lobby_id,
        lobbyState.current_match,
        lobbyState.current_round,
        move
      );
      if (moveResult.success) {
        setAwaitingTxEffect(true);
      }
      console.log("Move result:", moveResult);
    } finally {
      setAwaitingSign(false);
    }
    await refetchLobbyState();
  }

  useEffect(() => {
    // past turn animation (mostly opponents' turns)
    if (isTickDisplaying || roundExecutor == null) return;

    void (async () => {
      setIsTickDisplaying(true);

      const tickEvents = roundExecutor.tickEvents;
      const endState = roundExecutor.endState;

      for (const tickEvent of tickEvents) {
        // skip replay of this player's actions that already happened interactively
        if (
          thisPlayer.turn === display.matchState.turn &&
          tickEvent.kind === TICK_EVENT_KIND.postTx
        )
          continue;

        // show animations before applying events to state
        // TODO: we don't have any at the moment

        // apply events to state
        setDisplay((oldDisplay) => {
          const newMatchState = structuredClone(oldDisplay.matchState);
          applyEvent(newMatchState, tickEvent);
          return { ...oldDisplay, matchState: newMatchState };
        });

        // show animations after applying events to sate
        if (
          (tickEvent.kind === TICK_EVENT_KIND.postTx &&
            tickEvent.draw.card != null) ||
          tickEvent.kind === TICK_EVENT_KIND.playCard
        ) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (
          tickEvent.kind === TICK_EVENT_KIND.postTx &&
          tickEvent.draw.card == null
        ) {
          setCaption(
            (() => {
              const turnPlayer = getTurnPlayer(display.matchState);

              return turnPlayer.nftId === selectedNft
                ? "You overdraw a card and take 1 damage!"
                : "Your opponent overdraws a card and takes 1 damage!";
            })()
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setCaption(undefined);
        }

        if (tickEvent.kind === TICK_EVENT_KIND.turnEnd) {
          setCaption(
            (() => {
              const turnPlayer = getTurnPlayer(display.matchState);

              const target =
                turnPlayer.nftId === selectedNft ? "You deal" : "You take";

              return `${target} ${tickEvent.damageDealt} damage!`;
            })()
          );
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setCaption(undefined);
        }

        if (tickEvent.kind === TICK_EVENT_KIND.matchEnd) {
          setMatchResult(() => {
            const thisPlayerIndex = display.matchState.players.findIndex(
              (player) => player.nftId === selectedNft
            );
            const thisPlayerResult = tickEvent.result[thisPlayerIndex];

            if (thisPlayerResult === "w") return "You win!";
            if (thisPlayerResult === "l") return "You lose!";
            return "It's a tie!";
          });
        }
      }

      setDisplay({
        // intentionally set using the 'display' we started with instead of 'oldDisplay'
        round: display.round + 1,
        // round ended, which means a tx happened, calculate post-tx next render
        isPostTxDone: false,
        // resync with backend state in case we applied some events wrong (makes bugs less game-breaking)
        matchState: endState,
      });

      setIsTickDisplaying(false);
      setRoundExecutor(undefined);
    })();
  }, [display, isTickDisplaying, roundExecutor, selectedNft, thisPlayer]);

  const [isFetchingRound, setIsFetchingRound] = useState(false);
  const [fetchedEndState, setFetchedEndState] = useState<MatchState>({
    turn: lobbyState.current_turn,
    properRound: lobbyState.current_proper_round,
    players: lobbyState.players,
    txEventMove: lobbyState.txEventMove,
  });
  const [nextFetchedRound, setNextFetchedRound] = useState(
    lobbyState.current_round
  );
  useEffect(() => {
    // fetch new round data
    if (
      // we're up-to-date
      nextFetchedRound >= lobbyState.current_round ||
      // we already fetched a round
      roundExecutor != null ||
      // we're currently fetching
      isFetchingRound
    )
      return;

    setIsFetchingRound(true);
    Paima.default
      .getRoundExecutor(
        lobbyState.lobby_id,
        lobbyState.current_match,
        nextFetchedRound,
        fetchedEndState
      )
      .then((newRoundExecutor) => {
        if (newRoundExecutor.success) {
          const newRoundExecutorResults = {
            tickEvents: newRoundExecutor.result.processAllTicks(),
            endState: newRoundExecutor.result.endState(),
          };

          setRoundExecutor(newRoundExecutorResults);
          setNextFetchedRound(nextFetchedRound + 1);
          setFetchedEndState(newRoundExecutorResults.endState);
          setIsFetchingRound(false);
        } else {
          console.error(
            `Failed to fetch round executor: ${
              newRoundExecutor.success === false &&
              newRoundExecutor.errorMessage
            }`
          );
          // delay refetch of fail
          setTimeout(() => {
            setIsFetchingRound(false);
          }, 1000);
        }
      });
  }, [
    isFetchingRound,
    lobbyState,
    roundExecutor,
    nextFetchedRound,
    fetchedEndState,
  ]);

  useEffect(() => {
    // assertion: no card is selected if match is over
    if (!matchOver || selectedCard == null) return;

    setSelectedCard(undefined);
  }, [matchOver, selectedCard]);

  const disableInteraction =
    awaitingTxEffect ||
    matchOver ||
    display.round !== lobbyState.current_round ||
    thisPlayer.turn !== display.matchState.turn ||
    isTickDisplaying;

  const canPass = !disableInteraction;
  const canPlay = !disableInteraction;

  if (lobbyState == null) return <></>;

  return (
    <>
      <Typography
        variant="caption"
        sx={{ fontSize: "1.75rem", lineHeight: "2.25rem" }}
      >
        {(() => {
          if (matchOver) {
            const result = (() => {
              if (thisPlayer.currentResult === "w") return "You win!";
              if (thisPlayer.currentResult === "l") return "You lose!";
              return "It's a tie!";
            })();

            return (
              <>
                <span>Match over</span>
                <span> | </span>
                <span>{result}</span>
              </>
            );
          }

          const finalCaption: JSX.Element = (() => {
            if (caption != null) return <span>{caption}</span>;
            if (awaitingTxEffect)
              return (
                <span>
                  <span>Processing tx </span>
                  <CircularProgress
                    size="1em"
                    sx={{ display: "inline-block", verticalAlign: "middle" }}
                  />
                </span>
              );
            return (
              <span>
                {thisPlayer.turn === display.matchState.turn
                  ? "Your turn"
                  : "Opponent's turn"}
              </span>
            );
          })();

          return (
            <>
              {finalCaption}
            </>
          );
        })()}
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <Player
          lobbyPlayer={opponent}
          turn={display.matchState.turn}
          selectedCardState={[selectedCard, setSelectedCard]}
          onTargetCard={
            canPlay
              ? async (index) => {
                  if (selectedCard == null) return;

                  const fromBoardPosition = thisPlayer.currentBoard.findIndex(
                    (card) => card.index === selectedCard.index
                  );
                  if (fromBoardPosition === -1) return;

                  const toBoardPosition = opponent.currentBoard.findIndex(
                    (card) => card.index === index
                  );
                  if (toBoardPosition === -1) return;

                  if (!thisPlayer.currentBoard[fromBoardPosition].hasAttack)
                    return;

                  const fromCardRegistryId =
                    thisPlayer.currentBoard[fromBoardPosition].registryId;
                  const toCardRegistryId =
                    opponent.currentBoard[toBoardPosition].registryId;
                  if (
                    CARD_REGISTRY[fromCardRegistryId].defeats !==
                    toCardRegistryId
                  )
                    return;

                  await submit({
                    kind: MOVE_KIND.targetCardWithBoardCard,
                    fromBoardPosition,
                    toBoardPosition,
                  });
                  setSelectedCard(undefined);
                }
              : undefined
          }
        />
        <Player
          lobbyPlayer={thisPlayer}
          isThisPlayer
          localDeck={localDeck}
          turn={display.matchState.turn}
          selectedCardState={[selectedCard, setSelectedCard]}
          disableInteraction={disableInteraction}
          awaitingSign={awaitingSign}
          onEndTurn={
            canPass
              ? () => {
                  submit({ kind: MOVE_KIND.endTurn });
                }
              : undefined
          }
          onConfirmCard={
            canPlay
              ? async (index) => {
                  const handPosition = thisPlayer.currentHand.findIndex(
                    (card) => card.index === index
                  );
                  if (handPosition === -1) return;

                  await submit({
                    kind: MOVE_KIND.playCard,
                    handPosition,
                    cardIndex: index,
                    salt: localDeck[index].salt,
                    cardId: localDeck[index].id,
                    cardRegistryId: localDeck[index].registryId,
                  });
                  setSelectedCard(undefined);
                }
              : undefined
          }
        />
      </Box>
      <Modal
        open={matchResult != null}
        onClose={() => {
          navigate(Page.MainMenu)
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontSize: "1.75rem", lineHeight: "2.25rem" }}
          >
            {matchResult}
            <Box minHeight={16} />
            <Button
              sx={(theme) => ({ backgroundColor: theme.palette.menuButton.dark })}
              onClick={() => navigate(Page.MainMenu)}
            >
              Return to menu
            </Button>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default CardsGame;
