import React, { useState, useEffect, useContext } from "react";
import type MainController from "@src/MainController";
import type { LobbyStateQuery } from "@chess/utils";
import { AppContext } from "@src/main";
import Layout from "@src/layouts/Layout";
import LobbyList from "@src/components/LobbyList";

const OpenLobbies: React.FC = () => {
  const mainController: MainController = useContext(AppContext);

  const [lobbies, setLobbies] = useState<LobbyStateQuery[]>([]);

  useEffect(() => {
    mainController.getOpenLobbies().then((lobbies) => {
      setLobbies(lobbies);
    });
  }, []);

  const handleLobbyRefresh = async () => {
    const lobbies = await mainController.getOpenLobbies();
    setLobbies(lobbies);
  };

  const searchForHiddenLobby = async (query: string) => {
    const results = await mainController.searchLobby(query, 0);
    if (results == null || results.length === 0) return;
    const newLobbies = results.filter(
      (result) => !lobbies.some((lobby) => lobby.lobby_id === result.lobby_id)
    );
    setLobbies([...lobbies, ...newLobbies]);
  };

  return (
    <Layout>
      <LobbyList
        title="Lobbies"
        lobbies={lobbies}
        onLobbyRefresh={handleLobbyRefresh}
        onLobbySelect={(lobby) => mainController.joinLobby(lobby.lobby_id)}
        onLobbySearch={searchForHiddenLobby}
        actionMap={{
          open: "Enter",
        }}
      />
    </Layout>
  );
};

export default OpenLobbies;
