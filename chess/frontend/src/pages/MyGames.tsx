import React, { useState, useEffect, useContext } from "react";
import type MainController from "@src/MainController";
import type { UserLobby } from "@chess/utils";
import { AppContext } from "@src/main";
import Layout from "@src/layouts/Layout";
import LobbyList from "@src/components/LobbyList";

const MyGames: React.FC = () => {
  const mainController: MainController = useContext(AppContext);

  const [lobbies, setLobbies] = useState<UserLobby[]>([]);

  useEffect(() => {
    mainController.getMyGames().then((lobbies) => {
      setLobbies(lobbies);
    });
  }, []);

  const handleLobbyRefresh = async () => {
    const lobbies = await mainController.getMyGames();
    setLobbies(lobbies);
  };

  const handleLobbyAction = ({ lobby_id, lobby_state }: UserLobby) => {
    if (lobby_state === "open") {
      mainController.closeLobby(lobby_id);
    } else {
      mainController.moveToJoinedLobby(lobby_id);
    }
  };

  return (
    <Layout>
      <LobbyList
        title="My Games"
        lobbies={lobbies}
        onLobbySelect={handleLobbyAction}
        onLobbyRefresh={handleLobbyRefresh}
        actionMap={{
          open: "Close",
          active: "Continue",
          finished: "Replay",
          closed: "Closed",
        }}
      />
    </Layout>
  );
};

export default MyGames;
