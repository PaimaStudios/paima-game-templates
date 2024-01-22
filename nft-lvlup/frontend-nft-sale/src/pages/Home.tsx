import { useAccount } from 'wagmi';
import ConnectWallet from '../components/ConnectWallet';
import Router from '../Router';

const Home = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <ConnectWallet />;
  }

  return <Router />;
};

export default Home;
