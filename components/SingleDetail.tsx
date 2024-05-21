"use client"
import React, { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import { useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import NFT_ABI from './abi/ERC721ContractAbi.json';


const SingleDetail = ({ txHash }: { txHash: any }) => {
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [nftMetadata, setNftMetadata] = useState<any>(null);

  const { data: transactionReceipt, isError, isLoading } = useWaitForTransactionReceipt({
    hash:txHash
  });

  useEffect(() => {
    if (transactionReceipt) {
      setTransactionDetails(transactionReceipt);

      // Extract tokenId from transactionReceipt logs
      const mintEvent = transactionReceipt.logs.find((log) =>
        log.topics[0] === ethers.utils.id("Transfer(address,address,uint256)")
      );

      if (mintEvent) {
        const tokenIdHex = mintEvent.topics[3]; // The tokenId is usually the fourth topic
        const tokenId = ethers.BigNumber.from(tokenIdHex).toString();
        setTokenId(tokenId);
      }
    }
    console.log("transactionReceipt",transactionReceipt)
  }, [transactionReceipt]);

  const { data: ownerData } = useReadContract({
    address: '0x685E837fCD0EEf367e2D9D58F58e0d48A0723D80',
    abi: NFT_ABI,
    functionName: 'ownerOf',
    args: tokenId ? [tokenId] : [],
  });

  const { data: tokenURIData } = useReadContract({
    address: '0x685E837fCD0EEf367e2D9D58F58e0d48A0723D80',
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
  return (
    <>
      {transactionDetails && ownerData && nftMetadata ? (
        <tr className="text-sm">
          <td className="p-2 border border-gray-500"><a href={etherscanUrl} target="_blank" rel="noopener noreferrer">{transactionDetails.transactionHash}</a></td>
          <td className="p-2 border border-gray-500">{transactionDetails.from}</td>
          <td className="p-2 border border-gray-500">{transactionDetails.to}</td>
          <td className="p-2 border border-gray-500">{ownerData as string}</td>
          <td className="p-2 border border-gray-500">{nftMetadata.name}</td>
          <td className="p-2 border border-gray-500">{nftMetadata.description}</td>
          <td className="p-2 border border-gray-500">{nftMetadata.image && <img src={nftMetadata.image} alt={nftMetadata.name} />}</td>
        </tr>
      ) : (
        <tr>No transaction details available</tr>
      )}
      
    </>
  );
};

export default SingleDetail;
