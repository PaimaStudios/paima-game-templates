import React, { useContext, useState } from "react";
import { Button, MenuItem, Select, Typography } from "@mui/material";
import { AppContext } from "@src/main";
import type MainController from "@src/MainController";

import Card from "@src/components/Card";
import Layout from "@src/layouts/Layout";

const Login: React.FC = () => {
  const mainController: MainController = useContext(AppContext);

  const [selectedWallet, setSelectedWallet] = useState("metamask");

  return (
    <Layout small navbar={false}>
      <Card layout>
        <Typography variant="h2">Login</Typography>
        <Typography>Please, select your wallet</Typography>
        {/* //TODO: styling */}
        <Select
          variant="outlined"
          color="primary"
          fullWidth
          value={selectedWallet}
          label="Wallet"
          onChange={(event) => setSelectedWallet(event.target.value as string)}
        >
          <MenuItem value="metamask">Metamask</MenuItem>
          <MenuItem value="flint">Flint</MenuItem>
          <MenuItem value="evm-flint">Flint - EVM</MenuItem>
          <MenuItem value="nufi">NuFi</MenuItem>
          <MenuItem value="nami">Nami</MenuItem>
          <MenuItem value="eternl">Eternl</MenuItem>
        </Select>
        <Button
          disabled={!selectedWallet}
          onClick={() => mainController.connectWallet(selectedWallet)}
        >
          Connect
        </Button>
      </Card>
    </Layout>
  );
};

export default Login;
