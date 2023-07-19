import { useWeb3Context } from '../hooks/useWeb3Context';

import ConnectWallet from '../components/ConnectWallet';
import Router from '../Router';

const Home = () => {
  const { connected } = useWeb3Context();

  if (!connected) {
    return <ConnectWallet />;
  }

  return <Router />;
};

export default Home;
