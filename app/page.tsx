"use client"
import { useState } from "react";
import NFTContract from "@/components/NFTContract";
import MintNft from "@/components/MintNft";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import PinataForm from '../components/PinataForm';
import TransactionDetails from "@/components/TransactionDetails";
import TransferFrom from '../components/TransaferFrom'
import Approval from '../components/Approval'
import SafeTransferFrom from '../components/SafeTransferFrom'

export default function Home() {
  const [transactionHash, setTransactionHash] = useState<string>('');

  const handleTransactionHash = (hash: string) => {
    setTransactionHash(hash);
  };
  return (
    <>
    <section className="m-10 my-10">
      <div className="m-auto md:w-full w-1/2">
        <h1 className="text-white text-center">Getting info related to transactions on our NFT Token.</h1>
        <div className="my-5 flex justify-center"><ConnectButton/></div>
      </div>
    <div className="my-20">
      {/* <NFTContract/> */}
      <PinataForm/>
      <MintNft onTransactionHash={handleTransactionHash}/>
      <TransferFrom onTransactionHash={handleTransactionHash}/>
      <Approval onTransactionHash={handleTransactionHash}/>
      <SafeTransferFrom onTransactionHash={handleTransactionHash}/>

      <TransactionDetails hash={transactionHash}/>
    </div>
    </section>
    </>
  );
}
