import { type ReactElement, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Button, List, ListItem } from '@mui/material';

import { useAppContext } from '../../hooks';
import { Header } from './Header';
import { BackdropLoader } from '../Loader';

export const MainLayout = (): ReactElement => {
  const { dispatch, isLoading, contractAddress, counterValue } = useAppContext();

  const handleIncrement = async (): Promise<void> => {
    await dispatch({ type: 'join', payload: '' });
  };

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Header />
      {isLoading && <BackdropLoader />}
      <Box sx={{ px: 10, position: 'relative', height: '100%' }}>
        <img src="/logo-render.png" alt="logo-image" height={200} />
        <div>Contract Address: {contractAddress}</div>
        <div>Current EVM Tokens: {String(counterValue)} </div>

        <Button
          variant="contained"
          sx={{
            fontSize: '1.5rem',
            px: '2rem',
            py: '0.5rem',
            borderRadius: '1rem',
            background: '#0404fb',
            color: '#fff',
            cursor: 'pointer',
            textTransform: 'none',
          }}
          onClick={() => {
            handleIncrement();
          }}
        >
          Send Token to EVM Wallet
        </Button>
2edb3aff374e767da887fcb3dcc7682e
        <Box
          sx={{
            zIndex: 999,
            position: 'relative',
            height: '100%',
            py: '10vh',
            px: '5vw',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
