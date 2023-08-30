import { Box, Container } from "@mui/material";
import React from "react";
import { PaimaNotice } from "@src/components/PaimaNotice";
import Navbar from "@src/components/Navbar";
import Logo from "@src/components/Logo";

interface Props {
  children?: React.ReactNode;
  small?: boolean;
  navbar?: boolean;
}

const Layout: React.FC<Props> = ({ children, small, navbar = true }) => {
  return (
    <>
      {navbar ? (
        <Navbar />
      ) : (
        <Box marginBottom="40px" marginTop="24px">
          <Logo height={116} />
        </Box>
      )}
      <Container maxWidth={small ? "sm" : "lg"}>{children}</Container>
      <Box marginTop="32px">
        <PaimaNotice />
      </Box>
    </>
  );
};

export default Layout;
