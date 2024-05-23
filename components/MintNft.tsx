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
    const to = formData.get('to') as string;
    const tokenId = formData.get('tokenId') as string;
    const uri = formData.get('uri') as string;

    await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: 'safeMint',
      args: [to,tokenId,uri],
    });
  }
  onTransactionHash(hash!);
  // console.log("HAsh:",hash)

  return (
    <>
    <div className="md:w-full w-1/2 m-auto flex flex-col gap-2 mb-10">
      <h1>Now if you have made tokenURI, you can mint that nft to anybody you would like:</h1>
      <form className="flex flex-col" onSubmit={submit}>
        <input name="to" placeholder="To Address" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <input name="tokenId" placeholder="TokenId" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <input name="uri" placeholder="uri" required className='bg-transparent border-2 p-2 rounded-full my-2'/>
        <button disabled={isPending} type="submit" className='text-white bg-blue-500 p-2 rounded-xl my-2 w-40 m-auto'>
          {isPending ? 'Minting...' : 'Mint'}
        </button>
      </form>
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}

    </div>
    </>
  );
}
