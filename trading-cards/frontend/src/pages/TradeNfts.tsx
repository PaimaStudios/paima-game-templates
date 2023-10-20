import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useGlobalStateContext } from "@src/GlobalStateContext";
import Navbar from "@src/components/Navbar";
import Wrapper from "@src/components/Wrapper";
import React, { useMemo, useState } from "react";
import Card from "./CardGame/Card";
import type { CardDbId } from "@cards/game-logic";
import { DECK_LENGTH } from "@cards/game-logic";
import { burnTradeNft, buyTradeNft } from "@src/services/contract";
import * as Paima from "@cards/middleware";
import LoadingButton from "@src/components/LoadingButton";

enum Buttons {
  NONE,
  STORE,
  BUY,
  BURN
};

export default function TradeNfts(): React.ReactElement {
  const { connectedWallet, collection, tradeNfts } = useGlobalStateContext();
  const sortedCards = useMemo(() => {
    if (collection.cards == null) return [];
    const result = Object.values(collection.cards).map((card) => card.id);
    result.sort();
    return result;
  }, [collection.cards]);
  const [selectedCards, setSelectedCard] = useState<CardDbId[]>([]);
  const [selectedTradeNft, setSelectedTradeNft] = useState<
    undefined | number
  >(tradeNfts?.tradeNfts[0]?.nft_id);
  const [awaitingSignature, setAwaitingSignature] = useState<Buttons>(Buttons.NONE);

  if (connectedWallet == null) return <></>;

  return (
    <>
      <Navbar />
      <Wrapper blurred={false}>
        {tradeNfts?.tradeNfts
          .filter((tradeNft) => tradeNft.cards != null)
          .map((tradeNft) => (
            <Box
              key={tradeNft.nft_id}
              sx={{
                padding: 2,
                background: "#90797A",
              }}
            >
              <Typography>{tradeNft.nft_id}</Typography>
              <LoadingButton
                loading={awaitingSignature === Buttons.BURN}
                onClick={async () => {
                  setAwaitingSignature(Buttons.BURN);
                  try {
                    await burnTradeNft(connectedWallet, tradeNft.nft_id);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setAwaitingSignature(Buttons.NONE);
                  }
                }}
              >
                Burn & Claim
              </LoadingButton>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {tradeNft.cards?.map((card) => (
                  <Card
                    key={card}
                    cardRegistryId={tradeNfts.cardLookup[card].registry_id}
                  />
                ))}
              </Box>
            </Box>
          ))}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ width: "100%", display: "flex", gap: 4 }}>
            <Select
              value={selectedTradeNft ?? ""}
              onChange={(event) => {
                setSelectedTradeNft(
                  event.target.value === ""
                    ? undefined
                    : Number.parseInt(event.target.value.toString())
                );
              }}
            >
              {tradeNfts?.tradeNfts
                .filter((tradeNft) => tradeNft.cards == null)
                .map((tradeNft) => (
                  <MenuItem key={tradeNft.nft_id} value={tradeNft.nft_id}>
                    Trading Card NFT #{tradeNft.nft_id}
                  </MenuItem>
                ))}
            </Select>
            <LoadingButton
              loading={awaitingSignature === Buttons.STORE}
              disabled={selectedCards.length === 0 || selectedTradeNft == null}
              sx={{ width: "300px" }}
              onClick={async () => {
                if (selectedTradeNft == null) return;
                setAwaitingSignature(Buttons.STORE);
                try {
                  const sortedCards = [...selectedCards];
                  sortedCards.sort();
                  await Paima.default.setTradeNftCards(
                    selectedTradeNft,
                    sortedCards
                  );
                } catch (e) {
                  console.error(e);
                } finally {
                  setAwaitingSignature(Buttons.NONE);
                }
              }}
            >
              Store Selected Cards into NFT
            </LoadingButton>
          </Box>
          <LoadingButton
            loading={awaitingSignature === Buttons.BUY}
            sx={(theme) => ({ backgroundColor: theme.palette.menuButton.main, width: "200px" })}
            onClick={async () => {
              setAwaitingSignature(Buttons.BUY);
              try {
                await buyTradeNft(connectedWallet)
              } catch (e) {
                console.error(e);
              } finally {
                setAwaitingSignature(Buttons.NONE);
              }
            }}
          >
            Buy Trade Nft
          </LoadingButton>
        </Box>
        <Box minHeight={24} />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {sortedCards?.map((card) => (
            <Card
              key={card}
              cardRegistryId={collection.cards?.[card]?.registry_id}
              selectedEffect="glow"
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
      </Wrapper>
    </>
  );
}
