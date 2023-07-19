import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Web3ContextProvider } from './hooks/web3-data-provider/Web3Provider';
import { client } from './hooks/web3-data-provider/wagmi';
import { WagmiConfig } from 'wagmi';
import Layout from './pages/Layout';
import Home from './pages/Home';

const appRoot = document.getElementById('root');

if (!appRoot) {
  throw new Error('App root not found');
}

ReactDOM.createRoot(appRoot).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <Web3ContextProvider>
        <Layout>
          <Home />
        </Layout>
      </Web3ContextProvider>
    </WagmiConfig>
  </React.StrictMode>
);
