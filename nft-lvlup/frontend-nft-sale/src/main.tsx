import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Web3ContextProvider } from './hooks/web3-data-provider/Web3Provider';
import Layout from './pages/Layout';
import Home from './pages/Home';

const appRoot = document.getElementById('root');

if (!appRoot) {
  throw new Error('App root not found');
}

ReactDOM.createRoot(appRoot).render(
  <React.StrictMode>
    <Web3ContextProvider>
      <Layout>
        <Home />
      </Layout>
    </Web3ContextProvider>
  </React.StrictMode>
);
