import React, { useEffect, useMemo, useState } from "react";
import "./Lobby.scss";
import { Box, Typography } from "@mui/material";
import type { LobbyState } from "@cards/game-logic";
import Navbar from "@src/components/Navbar";
import Wrapper from "@src/components/Wrapper";
import CardGame from "./CardGame";
import * as Paima from "@cards/middleware";
import LocalStorage from "@src/LocalStorage";
import { useGlobalStateContext } from "@src/GlobalStateContext";

export function Lobby(): React.ReactElement {
  const {
    selectedNftState: [selectedNft],
    joinedLobbyRawState: [joinedLobbyRaw],
  } = useGlobalStateContext();

  const [lobbyState, setLobbyState] = useState<LobbyState>();

  useEffect(() => {
    const fetchLobbyData = async () => {
      if (joinedLobbyRaw == null) return;

      const newLobbyState = await Paima.default.getLobbyState(
        joinedLobbyRaw.lobby_id
      );
      if (!newLobbyState.success || newLobbyState.result.lobby == null) return;
      setLobbyState(newLobbyState.result.lobby);
    };

    // Fetch data every 5 seconds
    const intervalIdLobby = setInterval(fetchLobbyData, 5 * 1000);

    // Clean up the interval when component unmounts
    return () => {
      clearInterval(intervalIdLobby);
    };
  }, [joinedLobbyRaw, lobbyState]);

  const localDeck = useMemo(() => {
    if (lobbyState == null) return undefined;
    return LocalStorage.getLobbyDeck(lobbyState.lobby_id);
  }, [lobbyState]);

  if (joinedLobbyRaw == null || selectedNft.nft == null) return <></>;

  return (
    <>
      <Navbar />
      <Wrapper blurred={false}>
        <Typography variant="h1">Lobby {joinedLobbyRaw.lobby_id}</Typography>
        {lobbyState == null && (
          <>
            <div>
              <Box minHeight={24} />
              Waiting for another player
              <span className="loading-text">...</span>
            </div>
          </>
        )}
        {lobbyState != null && localDeck != null && (
          <CardGame
            lobbyState={lobbyState}
            selectedNft={selectedNft.nft}
            refetchLobbyState={async () => {
              const response = await Paima.default.getLobbyState(
                joinedLobbyRaw.lobby_id
              );
              if (!response.success || response.result.lobby == null) return;
              setLobbyState(response.result.lobby);
            }}
            localDeck={localDeck}
          />
        )}
      </Wrapper>
    </>
  );
}
