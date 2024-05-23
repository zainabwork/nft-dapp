import React from 'react'
import { useEffect,useState } from 'react';
import SingleDetail from './SingleDetail';
import {TransactionDetailsProps} from './interfaces/interfaces'

const TransactionDetails = ({hash, contractAddress} :TransactionDetailsProps) => {
  const [nftTransactHashes, setNftTransactHashes] = useState<string[]>([]);

    useEffect(() => {
        const storedHashes = JSON.parse(localStorage.getItem(`nftTransactHashes${contractAddress}`) || '[]');
        setNftTransactHashes(storedHashes);
      }, []);
    
      useEffect(() => {
        if (hash) {
          const updatedHashes = [...nftTransactHashes, hash];
          localStorage.setItem(`nftTransactHashes${contractAddress}`, JSON.stringify(updatedHashes));
          setNftTransactHashes(updatedHashes);
        }
      }, [hash]);

  return (
    <>
    <h1 className='text-center font-bold text-white my-5'>See the whole transaction list</h1>
    <div className='overflow-y-auto'>
    <table className='border border-collapse border-gray-400 text-center w-full'>
      <tbody>
        <tr className='text-nowrap'>
          <th className="p-4 border border-gray-400 text-wrap">Hash</th>
          <th className="p-4 border border-gray-400">From</th>
          <th className="p-4 border border-gray-400">To</th>
          <th className="p-4 border border-gray-400">Method</th>
          <th className="p-4 border border-gray-400">Current Owner</th>
          <th className="p-4 border border-gray-400">Nft TokenId</th>
          <th className="p-4 border border-gray-400">Nft Name</th>
          <th className="p-4 border border-gray-400">Nft Image</th>
        </tr>
        {nftTransactHashes.map((nftTransactHashes) => (
          <SingleDetail key={nftTransactHashes} txHash={nftTransactHashes} contractAddress={contractAddress} />
      ))}
        
      </tbody>
    </table>
    </div>
    </>
  )
}

export default TransactionDetails