import { Box, Typography } from "@mui/material";
import { useGlobalStateContext } from "@src/GlobalStateContext";
import Button from "@src/components/Button";
import Navbar from "@src/components/Navbar";
import Wrapper from "@src/components/Wrapper";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card from "./CardGame/Card";
import type { CardDbId } from "@cards/game-logic";
import { DECK_LENGTH } from "@cards/game-logic";

function getDisableReason(selectedCards: number[]): undefined | string {
  if (selectedCards.length !== DECK_LENGTH) {
    return `(need to select ${DECK_LENGTH} cards)`;
  }
  return undefined;
}
export default function Collection(): React.ReactElement {
  const {
    collection,
    selectedDeckState: [selectedDeck, setSelectedDeck],
  } = useGlobalStateContext();
  const [selectedCards, setSelectedCard] = useState<CardDbId[]>([]);
  useEffect(() => {
    setSelectedCard(selectedDeck ?? []);
  }, [JSON.stringify(selectedDeck)]);
  const sortedCards = useMemo(() => {
    if (collection.cards == null) return [];
    const result = Object.values(collection.cards).map((card) => card.id);
    result.sort();
    setSelectedCard(result);
    return result;
  }, [JSON.stringify(collection.cards)]);
  const disableReason = useMemo(() => getDisableReason(selectedCards), [selectedCards]);

  return (
    <>
      <Navbar />
      <Wrapper blurred={false}>
        {collection.cards != null && selectedDeck != null && (
          <Box sx={{ marginRight: "auto", marginLeft: "auto" }}>
            <Box marginBottom={1}>Currently selected cards</Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {selectedDeck.map((cardId, i) => (
                <Card
                  key={i}
                  cardRegistryId={collection.cards?.[cardId].registry_id}
                />
              ))}
            </Box>
            <Box marginBottom={12} />
          </Box>
        )}
        {sortedCards.length > 0 && <Box marginBottom={2}>{(selectedDeck?.length ?? 0) > 0 ? "New selection" : "Select your cards"}</Box>}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
          }}
        >
          {sortedCards?.map((card) => (
            <Card
              key={card}
              cardRegistryId={collection.cards?.[card]?.registry_id}
              selectedEffect="glow"
              darkenUnselected
              selectedState={[
                selectedCards.includes(card),
                () => {
                  setSelectedCard((oldSelectedCards) => {
                    if (oldSelectedCards.includes(card)) {
                      return oldSelectedCards.filter(
                        (selected) => selected !== card
                      );
                    }

                    if (oldSelectedCards.length < DECK_LENGTH) {
                      return [...oldSelectedCards, card];
                    }
                    return oldSelectedCards;
                  });
                },
              ]}
            />
          ))}
        </Box>
        <Box minHeight={32} />
        <Typography>
          {selectedCards.length}
          {" / "}
          {DECK_LENGTH}
        </Typography>
        <Button
          disabled={disableReason != null}
          onClick={() => {
            if (selectedCards.length != DECK_LENGTH) return;

            const sortedCards = [...selectedCards];
            sortedCards.sort();

            setSelectedDeck(sortedCards);
          }}
        >
          {disableReason != null ? `save ${disableReason}` : "save"}
        </Button>
      </Wrapper>
    </>
  );
}
