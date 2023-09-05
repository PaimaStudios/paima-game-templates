import React, { useContext, useState } from "react";
import { Button, Typography } from "@mui/material";
import { AppContext } from "@src/main";
import type MainController from "@src/MainController";

import Card from "@src/components/Card";
import Layout from "@src/layouts/Layout";
import SelectField from "@src/components/SelectField";

const wallets = [
  "Metamask",
  "EVM Self-sequence",
  "Algorand",
  "Flint",
  "Flint - EVM",
  // "Cardano"
  "Astar",
  "NuFi",
  "Nami",
  "Eternl",
] as const;

type WalletType = typeof wallets[number];

const walletMapping: Record<WalletType, string> = {
  Metamask: "metamask",
  "EVM Self-sequence": "metamask",
  Flint: "flint",
  "Flint - EVM": "evm-flint",
  // Cardaro: 'cardano',
  NuFi: "nufi",
  Nami: "nami",
  Eternl: "eternl",
  Astar: "polkadot",
  Algorand: "pera",
};

const preferBatchedModeMapping: Record<WalletType, boolean> = {
  Metamask: false,
  "EVM Self-sequence": false,
  Flint: false,
  "Flint - EVM": false,
  // Cardaro: false,
  NuFi: false,
  Nami: false,
  Eternl: false,
  Astar: false,
  Algorand: false,
};

const Login: React.FC = () => {
  const mainController: MainController = useContext(AppContext);

  const [selectedWallet, setSelectedWallet] = useState<WalletType>("Metamask");

  return (
    <Layout small navbar={false}>
      <Card blurred layout>
        <Typography variant="h2">Login</Typography>
        <SelectField
          label="Please, select your wallet"
          items={wallets}
          value={selectedWallet}
          onChange={(event) =>
            setSelectedWallet(event.target.value as WalletType)
          }
        />
        <Button
          disabled={!selectedWallet}
          onClick={() =>
            mainController.connectWallet(walletMapping[selectedWallet], preferBatchedModeMapping[selectedWallet])
          }
        >
          Connect
        </Button>
      </Card>
    </Layout>
  );
};

export default Login;
