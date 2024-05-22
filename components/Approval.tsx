"use client"
import React, { useState, FormEvent } from 'react';
import { useWriteContract, type BaseError } from 'wagmi';
import contractAbi from './abi/ERC721ContractAbi.json';
import { TransactionListProps } from './interfaces/interfaces';

export default function TransferFrom({ onTransactionHash }: TransactionListProps) {

  const { data: txHash,error, isPending, writeContractAsync } = useWriteContract();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const spender = formData.get('spender') as string;
    const tokenId = formData.get('tokenId') as string;

    await writeContractAsync({
      address: '0x685E837fCD0EEf367e2D9D58F58e0d48A0723D80',
      abi: contractAbi,
      functionName: 'approve',
      args: [spender, tokenId],
    });
  }

  onTransactionHash(txHash!);
  
  return (
    <>
    <h1 className='text-center font-bold my-5'>Give Approval to wallet of your any nft you like</h1>
    <div className="md:w-full w-1/2 m-auto flex flex-col gap-2 mb-10">
      <form className="flex flex-col" onSubmit={submit}>
        <input name="spender" placeholder="Spender Address" className='bg-transparent border-2 p-2 rounded-full my-2' required />
        <input name="tokenId" placeholder="TokenId" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <button disabled={isPending} type="submit" className='bg-blue-500 p-2 rounded-xl my-2 w-40 m-auto'>
          {isPending ? 'Approving...' : 'Approve'}
        </button>
      </form>
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
    </>
  );
}
