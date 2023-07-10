import { useWeb3Context } from '../hooks/useWeb3Context';
import Button from './Buttons';
import AddressInfo from './AddressInfo';
import { useNavigate } from 'react-router-dom';
import { Pages } from '../Router';

interface Props {
  address: string;
  children: React.ReactNode;
}

const PurchaseWrapper: React.FC<Props> = ({ address, children }) => {
  const { network } = useWeb3Context();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      <Button onClick={() => navigate(Pages.Admin)}>Admin functionality</Button>
      <AddressInfo network={network} address={address} />
      {children}
    </div>
  );
};

export default PurchaseWrapper;
