import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import NFT_ABI from './abi/ERC721ContractAbi.json';
import { OwnershipHistoryProps } from './interfaces/interfaces';

const NFT_CONTRACT_ADDRESS = '0x685E837fCD0EEf367e2D9D58F58e0d48A0723D80';

const OwnerHistory: React.FC<OwnershipHistoryProps> = ({ tokenId }) => {

  const [ownershipHistory, setOwnershipHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOwnershipHistory = async () => {
      setLoading(true);
      try {

        const storedHistory = localStorage.getItem(`ownershipHistory_${tokenId}`);
        if (storedHistory) {
          setOwnershipHistory(JSON.parse(storedHistory));
          setLoading(false);
          return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);

        const filter = contract.filters.Transfer(null, null, tokenId);
        const events = await contract.queryFilter(filter);
        const history = await Promise.all(
          events.map(async (event) => {
            const block = await provider.getBlock(event.blockNumber);
            return {
              from: event.args?.from,
              to: event.args?.to,
              timestamp: new Date(block.timestamp * 1000).toLocaleString(),
            };
          })
        );

        if(tokenId){
            localStorage.setItem(`ownershipHistory_${tokenId}`, JSON.stringify(history));
            setOwnershipHistory(history);
        } 
      } catch (error) {
        console.error('Error fetching ownership history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnershipHistory();

  }, [tokenId]);

  if (loading) return <div>Loading ownership history...</div>;
// console.log("ownershiphistory",ownershipHistory)
  return (
    <div className='text-white'>
      <h3 className='text-left my-2'>Ownership History for Token ID: {tokenId}</h3>
      <div className='overflow-x-auto'>
      <table className="border border-collapse border-gray-400 text-center min-w-full">
        <thead>
          <tr>
            <th className="p-2 border border-gray-500">From</th>
            <th className="p-2 border border-gray-500">To</th>
            <th className="p-2 border border-gray-500">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {ownershipHistory.map((entry, index) => (
            <tr key={index}>
              <td className="p-2 border border-gray-500">{entry.from}</td>
              <td className="p-2 border border-gray-500">{entry.to}</td>
              <td className="p-2 border border-gray-500">{entry.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default OwnerHistory;
