import type { IGetBoughtPacksResult } from "@cards/db/build/select.queries";
import type { CardRegistryId } from "@cards/game-logic";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import { useGlobalStateContext } from "@src/GlobalStateContext";
import Navbar from "@src/components/Navbar";
import Wrapper from "@src/components/Wrapper";
import { buyCardPack } from "@src/services/contract";
import React, { useEffect, useState } from "react";
import Card from "./CardGame/Card";

export default function BuyPack(): React.ReactElement {
  const { connectedWallet, collection } = useGlobalStateContext();
  const [isBuying, setIsBuying] = useState<boolean>(false);

  // Cache the length of collection.
  // When it changes, assume the last pack is the one we just bought.
  const [collectionCache, setCollectionCache] = useState<undefined | number>();
  const [boughtPack, setBoughtPack] = useState<undefined | CardRegistryId[]>();
  useEffect(() => {
    if (
      collection.boughtPacks == null ||
      collection.boughtPacks.length === collectionCache
    )
      return;
    setCollectionCache(collection.boughtPacks.length);
    setIsBuying(false);

    // first set
    if (collectionCache == null) return;

    const lastPackRaw = collection.boughtPacks.reduce(
      (acc, next) => (acc == null || acc.id < next.id ? next : acc),
      undefined as undefined | IGetBoughtPacksResult
    );

    setBoughtPack(lastPackRaw?.card_registry_ids);
  }, [collection, collectionCache]);

  return (
    <>
      <Navbar />
      <Wrapper blurred={false}>
        <LoadingButton
          loading={isBuying}
          sx={(theme) => ({
            "&.Mui-disabled": {
              backgroundColor: theme.palette.menuButton.dark,
            },
            backgroundColor: theme.palette.menuButton.main,
          })}
          onClick={async () => {
            try {
              if (connectedWallet == null) return;

              setIsBuying(true);
              await buyCardPack(connectedWallet);
            } catch (e) {
              console.error(e);
              setIsBuying(false);
            }
          }}
          variant="contained"
        >
          Buy pack
        </LoadingButton>
        <Box minHeight={16} />
        {boughtPack && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {boughtPack.map((cardRegistryId, i) => (
                <Card key={i} cardRegistryId={cardRegistryId} />
              ))}
            </Box>
            <Box minHeight={16} />
            You got {boughtPack.length} new cards!
          </>
        )}
      </Wrapper>
    </>
  );
}
