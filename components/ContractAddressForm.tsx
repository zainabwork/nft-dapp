import React, { useState } from 'react';
import { IsERC721 } from './IsERC721';

interface ContractAddressFormProps {
  onSubmit: (address: string) => void;
}

const ContractAddressForm: React.FC<ContractAddressFormProps> = ({ onSubmit }) => {
  const [address, setAddress] = useState('');
  const [isERC721, setIsERC721] = useState<boolean | null>(null);
  const [valid, setValid] = useState<boolean | null>(false)
  const handleValidation = (isValid: boolean) => {
    setIsERC721(isValid);
    if (isValid) {
      setValid(true);
    } else{
      setValid(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsERC721(null);
    if(valid){
      onSubmit(address);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-4 flex flex-col">
      <label htmlFor="contractAddress" className="block text-sm font-medium text-white">
        Enter your NFT contract address:
      </label>
      <input
        type="text"
        id="contractAddress"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="bg-transparent border-2 p-2 rounded-full my-2"
        placeholder="contract address"
        required
      />
      <button disabled={!valid} type="submit" className={`text-white  p-2 rounded-xl my-2 w-40 m-auto ${valid ? "bg-green-700" : "bg-gray-500"} `}>
        Submit
      </button>
      {address  && (
        <IsERC721 contractAddress={address} onValidation={handleValidation} />
      )}
      {isERC721 === false && (
        <p className="text-red-500 text-center">The provided address is not an ERC-721 contract.</p>
      )}
    </form>
  );
};

export default ContractAddressForm;
