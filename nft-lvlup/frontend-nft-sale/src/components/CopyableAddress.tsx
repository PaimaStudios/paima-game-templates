import { DuplicateIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { truncateAddress } from '../services/utils';

interface Props {
  address: string;
}

const CopyableAddress = ({ address }: Props) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="flex">
      <button
        className="cursor-pointer flex items-center"
        onClick={copyToClipboard}
        aria-label="Copy address"
        title="Copy address"
      >
        <span className="text-black font-base text-16">{truncateAddress(address)}</span>
        <DuplicateIcon className="h-4 w-4 ml-4" />
      </button>
      {copied && <span className="font-base font-medium ml-4">Copied!</span>}
    </div>
  );
};

export default CopyableAddress;
