import React, { useState, useEffect, useContext } from "react";
import type MainController from "@src/MainController";
import { Page } from "@src/MainController";
import Login from "./Login";
import MainMenu from "./MainMenu";
import OpenLobbies from "./OpenLobbies";
import MyGames from "./MyGames";
import ChessGame from "./ChessGame/ChessGame";
import CreateLobby from "./CreateLobby";
import { Box } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import type { LobbyState } from "@chess/utils";
import { AppContext } from "@src/main";
import Loader from "@src/components/Loader";
import ProtectedRoute from "./ProtectedRoute";

const PageCoordinator: React.FC = () => {
  const mainController: MainController = useContext(AppContext);
  const navigate = useNavigate();

  const [lobby, setLobby] = useState<LobbyState>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mainController.callback = (
      newPage: Page | null,
      isLoading: boolean,
      extraData: LobbyState | null
    ) => {
      // Update the local state and show a message to the user
      setLoading(isLoading);
      if (newPage === Page.Game) {
        setLobby(extraData);
        navigate(`${newPage}?lobby=${extraData.lobby_id}`);
      } else if (newPage) {
        navigate(newPage);
      }
    };
  }, []);

  return (
    <Box>
      {loading && <Loader />}
      <Routes>
        <Route path={Page.Login} element={<Login />} />
        <Route
          element={
            <ProtectedRoute walletAddress={mainController.userAddress} />
          }
        >
          <Route path={Page.MainMenu} element={<MainMenu />} />
          <Route path={Page.CreateLobby} element={<CreateLobby />} />
          <Route path={Page.OpenLobbies} element={<OpenLobbies />} />
          <Route path={Page.MyGames} element={<MyGames />} />
          <Route path={Page.Game} element={<ChessGame lobby={lobby} />} />
        </Route>
        <Route element={<div>There was something wrong...</div>} />
      </Routes>
    </Box>
  );
};

export default PageCoordinator;
