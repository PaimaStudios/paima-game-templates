import CopyableAddress from './CopyableAddress';

interface Props {
  address: string;
  network: string;
}

const AddressInfo = ({ address, network }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <p className="rounded-full px-4 py-4 bg-[#E0DFE3] mr-8">{network}</p>
      <CopyableAddress address={address} />
    </div>
  );
};

export default AddressInfo;
