import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { useWeb3Context } from '../../hooks/useWeb3Context';
import { Link } from 'react-router-dom';
import { CHAIN_EXPLORER_URI } from '../../services/constants';
import Button from '../../components/Buttons';

interface Props {
  contractFunction: (account: string, value: string) => Promise<any>;
  title: string;
  numberValue?: boolean;
  label: string;
}

const UpdateNativeNftSaleContract: React.FC<Props> = ({
  contractFunction,
  numberValue = false,
  title,
  label,
}) => {
  const { currentAccount } = useWeb3Context();

  const [value, setNewValue] = useState<string>('');

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>('');

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();

    const tx = await contractFunction(currentAccount, value);
    setIsPending(true);
    setTxHash(tx.hash);
    await tx.wait(3);
    setIsPending(false);
    setIsSuccessful(true);
  };

  return (
    <div>
      <h1>{title}</h1>
      {isSuccessful && (
        <div>
          <p>Executed successfully!</p>
          <Link to={`${CHAIN_EXPLORER_URI}/tx/${txHash}`}>View transaction</Link>
        </div>
      )}
      {isPending && <p>Transaction pending...</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <label>
          {label}
          <input
            value={value}
            onChange={event => setNewValue(event.target.value)}
            type={numberValue ? 'number' : undefined}
          />
        </label>
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
};

export default UpdateNativeNftSaleContract;
