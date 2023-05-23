import { useWeb3Context } from '../hooks/useWeb3Context';
import Button from './Buttons';

const ConnectWallet = () => {
  const { connectWallet } = useWeb3Context();

  return (
    <>
      <h2 className="text-28 leading-9 font-bold font-heading">Connect your wallet</h2>
      <p>Connect your wallet to buy stateful NFTs</p>
      <Button className="mt-6 " onClick={connectWallet}>
        Connect
      </Button>
    </>
  );
};

export default ConnectWallet;
