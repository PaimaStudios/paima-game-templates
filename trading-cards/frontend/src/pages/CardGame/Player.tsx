import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Card, { cardHeight } from "./Card";
import Deck from "./Deck";
import {
  CARD_REGISTRY,
  type BoardCard,
  type CardCommitmentIndex,
  type HandCard,
  type LobbyPlayer,
  type LocalCard,
} from "@cards/game-logic";
import type { UseStateResponse } from "@src/utils";
import Button from "@src/components/Button";

export type PlayerProps = {
  lobbyPlayer: LobbyPlayer;
  isThisPlayer?: boolean;
  localDeck?: LocalCard[];
  turn: number;
  selectedCardState: UseStateResponse<undefined | HandCard | BoardCard>;
  disableInteraction?: boolean;
  awaitingSign?: boolean,
  onEndTurn?: () => void;
  onTargetCard?: (index: CardCommitmentIndex) => void;
  onConfirmCard?: (index: CardCommitmentIndex) => void;
};

export default function Player({
  lobbyPlayer,
  isThisPlayer,
  localDeck,
  turn,
  selectedCardState: [selectedCard, setSelectedCard],
  disableInteraction,
  awaitingSign,
  onEndTurn,
  onTargetCard,
  onConfirmCard,
}: PlayerProps): React.ReactElement {
  const Hand = (
    <Box
      key="hand"
      sx={{
        minHeight: cardHeight,
        display: "flex",
      }}
    >
      {lobbyPlayer.currentHand.map((card) => (
        <Card
          key={card.index}
          cardRegistryId={localDeck?.[card.index].registryId}
          overlap
          onHover
          onConfirm={
            disableInteraction ? undefined : () => onConfirmCard?.(card.index)
          }
          darkenUnselected={disableInteraction || awaitingSign}
          darkenSelected={awaitingSign}
          selectedState={
            disableInteraction
              ? undefined
              : [
                  isThisPlayer === true && selectedCard?.index === card.index,
                  (val) => {
                    if (isThisPlayer)
                      setSelectedCard(val ? card : undefined);
                  },
                ]
          }
          selectedEffect="closeup"
        />
      ))}
    </Box>
  );
  const Board = (
    <Box
      key="board"
      sx={{
        minHeight: cardHeight,
        display: "flex",
        gap: 1,
      }}
    >
      {lobbyPlayer.currentBoard.map((card) => {
        const canBeTargeted = (() => {
          if (selectedCard == null) return undefined;
          if (isThisPlayer) return undefined; // can only target opponent cards
          if (!('registryId' in selectedCard)) return undefined;
          console.log(CARD_REGISTRY[selectedCard.registryId].defeats === card.registryId)
          return CARD_REGISTRY[selectedCard.registryId].defeats === card.registryId;
        })();
        
        const canAttack = !isThisPlayer && selectedCard;
        return (
          <Card
            key={card.index}
            cardRegistryId={card.registryId}
            hasAttack={(card.hasAttack && isThisPlayer) || canBeTargeted === true}
            selectedEffect="glow"
            darkenUnselected={awaitingSign || !card.hasAttack || canBeTargeted === false}
            darkenSelected={awaitingSign}
            selectedState={
              disableInteraction || !card.hasAttack
                ? undefined
                : [
                    isThisPlayer === true && selectedCard?.index === card.index,
                    (val) => {
                      if (!isThisPlayer) onTargetCard?.(card.index);
                      if (isThisPlayer)
                        setSelectedCard(val ? card : undefined);
                    },
                  ]
            }
          />
        );
        })}
    </Box>
  );

  const isMyTurn = lobbyPlayer.turn === turn;

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        gap: 2,
      }}
    >
      <Box sx={{
          flex: "none",
          width: "180px",
          padding: 2,
          background: isMyTurn
            ? "rgba(219, 109, 104, 0.5)"
            : "rgba(119, 109, 104, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Box
          sx={{
            flex: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "1rem",
              lineHeight: "1.5rem",
            }}
          >
            {isThisPlayer ? "You" : "Opponent"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
            }}
          >
            {lobbyPlayer.hitPoints}HP
          </Typography>
          {isThisPlayer && (
            <>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                }}
              >
                <Button disabled={onEndTurn == null || awaitingSign} onClick={onEndTurn}>
                  end turn
                </Button>
              </Box>
            </>
          )}
        </Box>
        <Box sx={{ flexGrow: 0.4 }} />
        {isThisPlayer && (onEndTurn == null || awaitingSign) ? <CircularProgress size={32} /> : undefined}
      </Box>
      <Box
        sx={{
          flex: 1,
          padding: 2,
          gap: 2,
          display: "flex",
          flexDirection: "column",
          background: isMyTurn
            ? "rgba(219, 109, 104, 0.5)"
            : "rgba(119, 109, 104, 0.5)",
          overflow: "auto",
          minWidth: 0,
        }}
      >
        {isThisPlayer ? [Board, Hand] : [Hand, Board]}
      </Box>
      <Deck size={lobbyPlayer.currentDeck.length} />
    </Box>
  );
}
