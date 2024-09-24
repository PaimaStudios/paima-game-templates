import './globals'; // This has to be loaded first as it defines global `process`
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import {
  toLedgerNetworkId,
  toRuntimeNetworkId,
  toZswapNetworkId,
  type NetworkId,
} from '@midnight-ntwrk/midnight-js-network-id';
import * as zswap from '@midnight-ntwrk/zswap';
import * as runtime from '@midnight-ntwrk/compact-runtime';
import * as ledger from '@midnight-ntwrk/ledger';

import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './config/theme';
import '@midnight-ntwrk/dapp-connector-api';
import * as pino from 'pino';

let networkId = import.meta.env.VITE_NETWORK_ID as NetworkId;
console.log({ networkId });
if (!networkId) networkId = 'devnet';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
runtime.setNetworkId(networkId);
zswap.setNetworkId(toZswapNetworkId(networkId));
runtime.setNetworkId(toRuntimeNetworkId(networkId));
ledger.setNetworkId(toLedgerNetworkId(networkId));

export const logger = pino.pino({
  level: 'trace',
});

logger.trace('networkId = ', networkId);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <App logger={logger} />
    </ThemeProvider>
  </React.StrictMode>,
);
