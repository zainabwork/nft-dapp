"use client"
import * as React from 'react';
import { FormEvent } from 'react';
import { useWriteContract, type BaseError } from 'wagmi';
import contractAbi from './abi/ERC721ContractAbi.json'
import { TransactionListProps } from './interfaces/interfaces';

export default function MintNft({ onTransactionHash, contractAddress }: TransactionListProps){

  const { data: hash, error, isPending, writeContractAsync } = useWriteContract();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const from = formData.get('from') as string;
    const to = formData.get('to') as string;
    const tokenId = formData.get('tokenId') as string;

    await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'transferFrom',
      args: [from,to,tokenId],
    });
  }
  onTransactionHash(hash!);
  // console.log("HAsh:",hash)

  return (
    <>
    <div className="md:w-full w-1/2 m-auto flex flex-col gap-2 mb-10">
      <h1>(TransferFrom) Transfer the nft from owner address to desired address:</h1>
      <form className="flex flex-col" onSubmit={submit}>
        <input name="from" placeholder="from Address" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <input name="to" placeholder="to Address" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <input name="tokenId" placeholder="tokenId" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <button disabled={isPending} type="submit" className='text-white bg-blue-500 p-2 rounded-xl my-2 w-40 m-auto'>
          {isPending ? 'Transfering...' : 'Transfer'}
        </button>
      </form>
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}

    </div>
    </>
  );
}
