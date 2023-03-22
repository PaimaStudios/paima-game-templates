import React from "react";
import { Button, Typography } from "@mui/material";
import { Page } from "@src/MainController";
import "./MainMenu.scss";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="main-menu">
      <Typography variant="h1" className="title">
        Chess
      </Typography>
      <Typography variant="h2" className="subtitle">
        Running on Paima Engine
      </Typography>
      <div className="button-container">
        <Button variant="contained" onClick={() => navigate(Page.CreateLobby)}>
          Create
        </Button>
        <Button variant="contained" onClick={() => navigate(Page.OpenLobbies)}>
          Lobbies
        </Button>
        <Button variant="contained" onClick={() => navigate(Page.MyGames)}>
          My Games
        </Button>
      </div>
    </div>
  );
};

export default MainMenu;
