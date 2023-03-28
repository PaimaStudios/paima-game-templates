import React from "react";
import { Box, Typography } from "@mui/material";
import { Page } from "@src/MainController";
import { useNavigate } from "react-router-dom";
import Button from "@src/components/Button";
import Wrapper from "@src/components/Wrapper";
import Logo from "@src/components/Logo";

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <>
      <Logo height={160} mainMenu />
      <Box paddingTop="96px" />
      <Wrapper small>
        <Typography variant="h1" marginTop="96px">
          Running on Paima Engine
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
            gap: "24px",
          }}
        >
          <Button onClick={() => navigate(Page.CreateLobby)}>Create</Button>
          <Button onClick={() => navigate(Page.OpenLobbies)}>Lobbies</Button>
          <Button onClick={() => navigate(Page.MyGames)}>My Games</Button>
        </Box>
      </Wrapper>
    </>
  );
};

export default MainMenu;
