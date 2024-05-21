import React from 'react'
import { useEffect,useState } from 'react';
import SingleDetail from './SingleDetail';

const TransactionDetails = ({hash}:any) => {
  const [nftTransactHashes, setNftTransactHashes] = useState<string[]>([]);

    useEffect(() => {
        const storedHashes = JSON.parse(localStorage.getItem('nftTransactHashes') || '[]');
        setNftTransactHashes(storedHashes);
      }, []);
    
      useEffect(() => {
        if (hash) {
          const updatedHashes = [...nftTransactHashes, hash];
          localStorage.setItem('nftTransactHashes', JSON.stringify(updatedHashes));
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
          <th className="p-4 border border-gray-400">Current Owner</th>
          <th className="p-4 border border-gray-400">Nft Name</th>
          <th className="p-4 border border-gray-400">Nft Description</th>
          <th className="p-4 border border-gray-400">Nft Image</th>
        </tr>
        {nftTransactHashes.map((nftTransactHashes) => (
          <SingleDetail key={nftTransactHashes} txHash={nftTransactHashes} />
      ))}
        
      </tbody>
    </table>
    </div>
    </>
  )
}

export default TransactionDetails