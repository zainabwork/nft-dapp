"use client"
import React, { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import { useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import NFT_ABI from './abi/ERC721ContractAbi.json';
import Image from 'next/image';
import OwnerHistory from './OwnerHistory';
import TokenHistoryDailog from './TokenHistoryDailog';
import abi from './abi/ERC721ContractAbi.json';
import { SingleDetailProps } from './interfaces/interfaces';

const SingleDetail = ({ txHash, contractAddress } : SingleDetailProps ) => {
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [tokenId, setTokenId] = useState<string>('');
  const [nftMetadata, setNftMetadata] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  const [method, setMethod] = useState('')

  function stripLeadingZeros(address: string|undefined) {
    return address?.replace(/^0x0+/, '0x');
  }

  const { data: transactionReceipt, isError, isLoading } = useWaitForTransactionReceipt({
    hash:txHash as `0x${string}`
  });

  useEffect(() => {
    if (transactionReceipt) {
      setTransactionDetails(transactionReceipt);
      // Extract tokenId from transactionReceipt logs
      const mintEvent = transactionReceipt.logs.find((log) =>
        log.topics[0] === ethers.utils.id("Transfer(address,address,uint256)")
      );

      if (mintEvent) {
        const tokenIdHex = mintEvent.topics[3];
        const tokenId = ethers.BigNumber.from(tokenIdHex).toString();
        setTokenId(tokenId);
        // console.log("mintEvent",mintEvent)
      }
      
    }
    console.log("transactionReceipt",transactionReceipt)
  }, [transactionReceipt]);

  const { data: ownerData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'ownerOf',
    args: tokenId ? [tokenId] : [],
  });

  const { data: tokenURIData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'tokenURI',
    args: tokenId ? [tokenId] : [],
  });

  useEffect(() => {
    if (tokenURIData) {
      fetch(tokenURIData as string)
        .then((res) => res.json())
        .then((metadata) => setNftMetadata(metadata));
    }
  }, [tokenURIData]);

  if (isLoading) return <div>Loading transaction details...</div>;
  if (isError) return <div>Error fetching transaction details</div>;

  const etherscanUrl = `https://sepolia.etherscan.io/tx/${txHash}`;

  // fetching method name
  async function fetchTransactionDetails() {
    try {
      if (!transactionReceipt) return console.log("no transaction");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const receipt = await provider.getTransactionReceipt(transactionReceipt.transactionHash);

      if (!receipt || !receipt.logs) {
        throw new Error("Transaction receipt or logs not available");
      }
      const contractLogs = receipt.logs.filter(log => log.address === contractAddress);
      const contractInterface = new ethers.utils.Interface(abi);
  
      contractLogs.forEach(log => {
        const parsedLog = contractInterface.parseLog(log);
        setMethod(parsedLog.name);
      });
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  }
  fetchTransactionDetails();
  // fetching method name end

  return (
    <>
      {transactionDetails? (
        <>
        <tr className="text-sm">
          <td className="p-2 border border-gray-500"><a href={etherscanUrl} target="_blank">{transactionDetails.transactionHash}</a></td>
          <td className="p-2 border border-gray-500">{transactionDetails.from}</td>
          <td className="p-2 border border-gray-500">{stripLeadingZeros(transactionDetails.logs[0].topics[2])}</td>
          <td className='p-2 border border-gray-500'>{method}</td>
    
          <td className="p-2 border border-gray-500">{ownerData as string ? ownerData as string : 'No owner data available'}</td>
          <td className="p-2 border border-gray-500 cursor-pointer" onClick={() => setIsDialogOpen(true)}>{tokenId ? tokenId : 'No token ID available'}</td>
          <td className="p-2 border border-gray-500">{nftMetadata ? nftMetadata.name : 'No NFT metadata available'}</td>
          <td className="p-2 border border-gray-500">{nftMetadata && nftMetadata.image && <Image src={nftMetadata.image} width={200} height={100} alt={nftMetadata.name}/>}</td>

        </tr>
        <TokenHistoryDailog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <OwnerHistory tokenId={tokenId} contractAddress={contractAddress} />
        </TokenHistoryDailog>
        </>
      ) : (
        <tr>No transaction details available</tr>
      )}
    </>
  );
};

export default SingleDetail;
