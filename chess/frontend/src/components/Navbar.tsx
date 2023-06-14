import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { IconButton, styled } from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBackIos";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Card from "./Card";
import { Container as ContainerBase } from "@mui/material";
import { Page } from "@src/MainController";

const ChessBar = styled(AppBar)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.primary.dark,
}));

const Container = styled(ContainerBase)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const IconCard = styled(Card)(() => ({
  display: "inline-flex",
  width: "40px",
  alignItems: "center",
  justifyContent: "center",
}));

const navigationMap: Record<Page, Page> = {
  [Page.Login]: Page.Login,
  [Page.MainMenu]: Page.MainMenu,
  [Page.CreateLobby]: Page.MainMenu,
  [Page.OpenLobbies]: Page.MainMenu,
  [Page.MyGames]: Page.MainMenu,
  [Page.Game]: Page.MyGames,
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const previousPage = navigationMap[location.pathname as Page];
  return (
    <Box sx={{ pb: "32px" }}>
      <ChessBar position="static">
        <Container maxWidth="lg">
          <Box sx={{ flex: 2, textAlign: "left" }}>
            <IconCard>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="back"
                onClick={() =>
                  previousPage ? navigate(previousPage) : navigate(-1)
                }
              >
                <BackIcon sx={{ textAlign: "center" }} />
              </IconButton>
            </IconCard>
          </Box>
          <Logo height={88} />
          <Box sx={{ flex: 2 }} />
        </Container>
      </ChessBar>
    </Box>
  );
};

export default Navbar;
