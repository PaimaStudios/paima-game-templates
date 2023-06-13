import React, { useContext, useState } from "react";
import { Button, Typography } from "@mui/material";
import { AppContext } from "@src/main";
import type MainController from "@src/MainController";

import Card from "@src/components/Card";
import Layout from "@src/layouts/Layout";
import SelectField from "@src/components/SelectField";

const wallets = [
  "metamask",
  "flint",
  "evm-flint",
  "nufi",
  "nami",
  "eternl",
] as const;

type WalletType = typeof wallets[number];
const walletsRecord: Record<WalletType, string> = {
  "evm-flint": "EVM Flint",
  nufi: "NuFi",
  nami: "Nami",
  eternl: "Eternl",
  flint: "Flint",
  metamask: "Metamask",
};

const walletNaming = (wallet: WalletType) => walletsRecord[wallet];

const Login: React.FC = () => {
  const mainController: MainController = useContext(AppContext);

  const [selectedWallet, setSelectedWallet] = useState("metamask");

  return (
    <Layout small navbar={false}>
      <Card blurred layout>
        <Typography variant="h2">Login</Typography>
        <SelectField
          label="Please, select your wallet"
          items={wallets}
          value={selectedWallet}
          onChange={(event) => setSelectedWallet(event.target.value as string)}
          displayTransform={walletNaming}
        />
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
