"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import { useEffect } from 'react';
import { useReadContract } from 'wagmi';
// import {config} from '../app/providers';
import nftAbi from '../components/abi/NFTContractAbi.json';

const NFTContract = () => {
    const [imgURL, setImgURL] = useState('');
    const [name,setName] = useState('');
    const [desc, setDesc] = useState('');
      const { data: tokenURI } = useReadContract({
        abi:nftAbi,
        address:'0x0855Bc96Bb7342db02395C42E1dFC1d710910Ec2',
        functionName: 'tokenURI',
        args:['1']
      }); 

      useEffect(() => {
        console.log( {tokenURI} );
      }, [tokenURI]);

      useEffect(() => {
        (async () => {
          if (tokenURI) {
            const res = await (await fetch(tokenURI as unknown as string)).json();
            setName(res.name);
            setDesc(res.description);
            setImgURL(res.image);
          }
        })();
      }, [tokenURI]);

  return (
    <>
    <section className='my-10 flex flex-col items-center'>
    <div className='font-bold'>NFT that I hold</div><br/>
    <p>Name: {name}</p>
    <p>Description: {desc}</p>
    <Image src={imgURL} width={400} height={200} alt="nft image"/>
    </section>
    </>
  )
}

export default NFTContract