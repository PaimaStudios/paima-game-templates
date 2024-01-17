import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Page } from "@src/pages/PageCoordinator";
import { useNavigate } from "react-router-dom";
import Button from "@src/components/Button";
import Wrapper from "@src/components/Wrapper";
import Logo from "@src/components/Logo";
import { buyAccountNft } from "@src/services/contract";
import { useGlobalStateContext } from "@src/GlobalStateContext";
import LoadingButton from "@src/components/LoadingButton";

const NoNFTMenu = () => {
  const {
    connectedWallet,
    selectedNftState: [selectedNft],
  } = useGlobalStateContext();
  const [isBuying, setIsBuying] = useState<boolean>(false);
  // if user successfully submitted a tx, keep loading until we fetch the nft
  const [buyDone, setBuyDone] = useState<boolean>(false);

  if (!connectedWallet || selectedNft.loading)
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  return (
    <>
      <LoadingButton
        loading={isBuying || buyDone}
        sx={(theme) => ({
          marginTop: 5,
          "&.Mui-disabled": {
            backgroundColor: theme.palette.menuButton.dark,
          },
          backgroundColor: theme.palette.menuButton.main,
        })}
        onClick={async () => {
          try {
            setIsBuying(true);
            await buyAccountNft(connectedWallet);
            setBuyDone(true);
          } catch (e) {
            console.error(e);
          } finally {
            setIsBuying(false);
          }
        }}
        variant="contained"
      >
        Create account (NFT)
      </LoadingButton>
    </>
  );
};

const HasNFTMenu = () => {
  const {
    selectedDeckState: [selectedDeck],
  } = useGlobalStateContext();
  const navigate = useNavigate();

  return (
    <>
      <Button
        sx={(theme) => ({ backgroundColor: theme.palette.menuButton.main })}
        onClick={() => navigate(Page.CreateLobby)}
        disabled={selectedDeck == null}
      >
        {selectedDeck == null ? "Create (requires cards)" : "Create"}
      </Button>
      <Button
        sx={(theme) => ({ backgroundColor: theme.palette.menuButton.main })}
        onClick={() => navigate(Page.OpenLobbies)}
        disabled={selectedDeck == null}
      >
        {selectedDeck == null ? "Lobbies (requires cards)" : "Lobbies"}
      </Button>
      <Button
        sx={(theme) => ({ backgroundColor: theme.palette.menuButton.main })}
        onClick={() => navigate(Page.MyGames)}
      >
        My Games
      </Button>
      <Button
        sx={(theme) => ({ backgroundColor: theme.palette.menuButton.main })}
        onClick={() => navigate(Page.Collection)}
      >
        Collection
      </Button>
      <Button
        sx={(theme) => ({ backgroundColor: theme.palette.menuButton.main })}
        onClick={() => navigate(Page.BuyPacks)}
      >
        Buy Packs
      </Button>
      <Button
        sx={(theme) => ({ backgroundColor: theme.palette.menuButton.main })}
        onClick={() => navigate(Page.TradeNfts)}
      >
        Trade Nfts
      </Button>
    </>
  );
};

const MainMenu = () => {
  const {
    connectedWallet,
    selectedNftState: [selectedNft],
  } = useGlobalStateContext();

  if (connectedWallet == null) return <></>;

  return (
    <>
      <Logo height={160} mainMenu />
      <Box paddingTop="96px" />
      <Wrapper small>
        <Box marginTop="48px" />
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
            gap: "24px",
          }}
        >
          {selectedNft.nft != null ? <HasNFTMenu /> : <NoNFTMenu />}
        </Box>
      </Wrapper>
    </>
  );
};

export default MainMenu;
