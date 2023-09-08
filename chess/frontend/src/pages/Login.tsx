import React, { useContext, useState } from "react";
import { Button, Typography } from "@mui/material";
import { AppContext } from "@src/main";
import type MainController from "@src/MainController";

import Card from "@src/components/Card";
import Layout from "@src/layouts/Layout";
import SelectField from "@src/components/SelectField";

const wallets = [
  "Metamask",
  "EVM",
  "Algorand",
  "Flint - EVM",
  "Polkadot",
  "Cardano"
] as const;

type WalletType = typeof wallets[number];

const walletMapping: Record<WalletType, string> = {
  Metamask: "metamask",
  EVM: "metamask",
  "Flint - EVM": "evm-flint",
  Cardano: 'cardano',
  Polkadot: "polkadot",
  Algorand: "pera",
};

const preferBatchedModeMapping: Record<WalletType, boolean> = {
  Metamask: true,
  EVM: false,
  "Flint - EVM": false,
  Cardano: false,
  Polkadot: false,
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
