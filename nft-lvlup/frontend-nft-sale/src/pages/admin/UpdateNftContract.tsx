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

const UpdateNftContract: React.FC<Props> = ({
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
    try {
      setIsSuccessful(false);
      const tx = await contractFunction(currentAccount, value);
      setIsPending(true);
      setTxHash(tx.hash);
      await tx.wait(3);
      setIsSuccessful(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-medium mb-12 text-center">{title}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-96">
        <div>
          <label htmlFor="new_value" className="block mb-2 text-sm font-medium text-gray-900">
            {label}
          </label>
          <input
            id="new_value"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
            required
            autoComplete="off"
            value={value}
            onChange={event => setNewValue(event.target.value)}
            type={numberValue ? 'number' : 'text'}
          />
        </div>
        <Button type="submit">Submit</Button>
        {isSuccessful && (
          <div>
            <span>Success! </span>
            <Link
              to={`${CHAIN_EXPLORER_URI}/tx/${txHash}`}
              className="text-emerald-500 hover:text-emerald-700"
            >
              View transaction.
            </Link>
          </div>
        )}
        {isPending && <p>Transaction pending...</p>}
      </form>
    </div>
  );
};

export default UpdateNftContract;
