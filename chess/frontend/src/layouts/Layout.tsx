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
        <>
          <Logo height={116} mainMenu />
          <Box paddingTop="32px" />
        </>
      )}
      <Container maxWidth={small ? "sm" : "lg"}>{children}</Container>
      <Box paddingTop="32px" />
      <PaimaNotice />
    </>
  );
};

export default Layout;
