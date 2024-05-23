import { useReadContract } from 'wagmi';
import { useEffect, useState } from 'react';
import abi from './abi/ERC721ContractAbi.json'

const ERC721_INTERFACE_ID = '0x80ac58cd';

interface IsERC721Props {
  contractAddress: string;
  onValidation: (isValid: boolean) => void;
}

export const IsERC721: React.FC<IsERC721Props> = ({ contractAddress, onValidation }) => {
  const [isERC721, setIsERC721] = useState<boolean | null>(null);

  const { data, isError, isLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: abi,
    functionName: 'supportsInterface',
    args: [ERC721_INTERFACE_ID],
  });

  useEffect(() => {
    if (!isLoading) {
      if (isError || !data) {
        setIsERC721(false);
        onValidation(false);
      } else {
        setIsERC721(data as boolean);
        onValidation(data as boolean);
      }
    }
  }, [data, isError, isLoading, onValidation]);

  return (
    <div>
      {isLoading ? (
        <p>Checking contract...</p>
      ) : isERC721 === false ? (
        <p className="text-red-500">This is not a valid ERC-721 contract address.</p>
      ) : isERC721 === true ? (
        <p className="text-green-500">This is a valid ERC-721 contract address.</p>
      ) : null}
    </div>
  );
};
