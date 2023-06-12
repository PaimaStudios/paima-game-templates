import React from "react";
import logo from "@assets/images/chess_logo.png";
import { Box } from "@mui/material";

interface LogoProps {
  mainMenu?: boolean;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ height, mainMenu = false }) => {
  return (
    <Box sx={{ margin: mainMenu ? "24px 0 8px 0" : "8px 0" }}>
      <img src={logo} alt="Paima Chess" height={height} />
    </Box>
  );
};

export default Logo;
