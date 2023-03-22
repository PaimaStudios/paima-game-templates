import React, { useState, useEffect, useContext } from "react";
import MainController, { Page } from "@src/MainController";
import LandingPage from "./Landing";
import MainMenu from "./MainMenu";
import OpenLobbies from "./OpenLobbies";
import MyGames from "./MyGames";
import ChessGame from "./ChessGame/ChessGame";
import CreateLobby from "./CreateLobby";
import { CircularProgress } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import { LobbyState } from "../paima/types.d";
import "./PageCoordinator.scss";
import { AppContext } from "@src/main";

const PageCoordinator: React.FC = () => {
  const mainController: MainController = useContext(AppContext);
  const navigate = useNavigate();

  const [lobby, setLobby] = useState<LobbyState>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const page = mainController.initialState();
    navigate(page);
  }, []);

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
      }
      if (newPage) {
        navigate(newPage);
      }
    };
  }, []);

  return (
    <div className="chess-app">
      {loading && (
        <div className="overlay">
          <CircularProgress sx={{ ml: 2 }} />
        </div>
      )}
      <Routes>
        <Route path={Page.MainMenu} element={<MainMenu />} />
        <Route path={Page.OpenLobbies} element={<OpenLobbies />} />
        <Route
          path={Page.MyGames}
          element={<MyGames myAddress={mainController.userAddress} />}
        />
        <Route
          path={Page.Game}
          element={
            <ChessGame lobby={lobby} address={mainController.userAddress} />
          }
        />
        <Route path={Page.CreateLobby} element={<CreateLobby />} />
        <Route path={Page.Landing} element={<LandingPage />} />
        <Route element={<div>There was something wrong...</div>} />
      </Routes>
    </div>
  );
};

export default PageCoordinator;
