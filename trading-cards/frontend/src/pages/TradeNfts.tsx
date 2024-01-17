import { Box, Link, MenuItem, Paper, Select, Typography } from "@mui/material";
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
import { CARD_TRADE_NFT, CHAIN_EXPLORER_URI } from "@src/services/constants";

enum Buttons {
  NONE,
  STORE,
  BUY,
  BURN
};

const genExplorerUrl = (tokenId: number): string => `${CHAIN_EXPLORER_URI}/token/${CARD_TRADE_NFT}?a=${tokenId}`;

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
  >(undefined);
  const [awaitingSignature, setAwaitingSignature] = useState<Buttons>(Buttons.NONE);

  // reset fields if a trade NFT is created/consumed
  React.useEffect(() => {
    setSelectedCard([]);
    if (tradeNfts == null) {
      setSelectedTradeNft(undefined);
      return;
    }
    setSelectedTradeNft(tradeNfts.tradeNfts.filter(pack => pack.cards == null)[0]?.nft_id);
  }, [JSON.stringify(tradeNfts?.tradeNfts)]);

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
              <Paper
                sx={{
                  padding: 2,
                  background: "rgba(0,0,0,0.1)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box marginRight={4} sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography color="white">Card Pack NFT #{tradeNft.nft_id}</Typography>
                  <Link
                    href={genExplorerUrl(tradeNft.nft_id)}
                    target="_blank" 
                    rel="noopener"
                    sx={{ color: '#ffffff', marginBottom: "8px" }}
                  >
                    (see on explorer)
                  </Link>
                  <LoadingButton
                    loading={awaitingSignature === Buttons.BURN}
                    disabled={awaitingSignature !== Buttons.NONE}
                    onClick={async () => {
                      setAwaitingSignature(Buttons.BURN);
                      try {
                        await burnTradeNft(connectedWallet, BigInt(tradeNft.nft_id));
                      } catch (e) {
                        console.error(e);
                      } finally {
                        setAwaitingSignature(Buttons.NONE);
                      }
                    }}
                  >
                    Burn & Claim
                  </LoadingButton>
                </Box>
                {tradeNft.cards?.map((card) => (
                  <Card
                    key={card}
                    cardRegistryId={tradeNfts.cardLookup[card].registry_id}
                  />
                ))}
              </Paper>
              <Box minHeight={64} />
            </Box>
          ))}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ width: "100%", display: "flex", gap: 4 }}>
            <Select
              sx={{width: "200px"}}
              disabled={selectedTradeNft == null || awaitingSignature !== Buttons.NONE}
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
                    Card Pack NFT #{tradeNft.nft_id}
                  </MenuItem>
                ))}
            </Select>
            <LoadingButton
              loading={awaitingSignature === Buttons.STORE}
              disabled={selectedCards.length === 0 || selectedTradeNft == null || awaitingSignature !== Buttons.NONE}
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
            disabled={awaitingSignature !== Buttons.NONE}
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
