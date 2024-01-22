import { useConnect } from 'wagmi';
import Button from './Buttons';
import mw from 'mw';
import type { WalletMode } from '@paima/sdk/providers';
import { paimaConnector } from '../hooks/web3-data-provider/wagmi';

// we have to use a type alias because Vite requires isolatedModules which disallows const enums
const evmInjectedMode: WalletMode.EvmInjected = 0;

const ConnectWallet = () => {
  const { connect } = useConnect();

  return (
    <>
      <h2 className="text-28 leading-9 font-bold font-heading">Connect your wallet</h2>
      <p>Connect your wallet to buy stateful NFTs</p>
      <Button
        className="mt-6 "
        onClick={async () => {
          const response = await mw.userWalletLogin({
            mode: evmInjectedMode,
            preferBatchedMode: false,
          });
          if (response.success) {
            connect({ connector: paimaConnector });
          }
        }}
      >
        Connect
      </Button>
    </>
  );
};

export default ConnectWallet;
