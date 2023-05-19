import { useWeb3Context } from '../hooks/useWeb3Context';

import ConnectWallet from '../components/ConnectWallet';
import BuyProgress from '../components/BuyProgress';
import { getNftPrice } from '../services/contract';

const NFTSale = () => {
  const { connected } = useWeb3Context();

  if (!connected) {
    return <ConnectWallet />;
  }

  return (
    <BuyProgress
      imageModal={'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'}
      nftPrice={getNftPrice()}
      tokenId="tokenId"
    />
  );
};

export default NFTSale;
