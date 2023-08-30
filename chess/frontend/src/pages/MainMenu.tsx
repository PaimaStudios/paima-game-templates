import React from "react";
import { Box } from "@mui/material";
import { Page } from "@src/MainController";
import { useNavigate } from "react-router-dom";
import Layout from "@src/layouts/Layout";
import MenuCard from "@src/components/MenuCard";

import createBackground from "@assets/images/create-background.png";
import lobbiesBackground from "@assets/images/lobbies-background.png";
import gamesBackground from "@assets/images/games-background.png";
import UserStats from "./UserStats";

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <Layout navbar={false}>
      <Box sx={{ margin: 2 }}>
        <UserStats />
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <MenuCard
          onClick={() => navigate(Page.CreateLobby)}
          title="Create"
          background={createBackground}
        />
        <MenuCard
          onClick={() => navigate(Page.OpenLobbies)}
          title="Lobbies"
          background={lobbiesBackground}
        />
        <MenuCard
          onClick={() => navigate(Page.MyGames)}
          title="My Games"
          background={gamesBackground}
        />
      </Box>
    </Layout>
  );
};

export default MainMenu;
