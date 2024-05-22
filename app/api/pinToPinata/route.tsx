// app/api/pinToPinata/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
// console.log("pinata",pinata)
export async function POST(req:any, res:any) {

  const data = await req.formData(); 
  const name: string|null = data.get('name') as unknown as string;
  const description: string|null = data.get('description') as unknown as string;
  const file: File | null = data.get('file') as unknown as File;
  console.log("data",data);
  console.log("file:",file)

if (!name || !description || !file) {
  return res.status(400).json({ message: 'Missing required fields' });
}

try {
  // making file object in readable stream form
  const fileBuffer = await file.arrayBuffer();
  const fileStream = new Readable();
  fileStream._read = () => {};
  fileStream.push(Buffer.from(fileBuffer));
  fileStream.push(null);
//now readable stream file can be send as argument to pinata function as per requirement
  const fileResponse = await pinata.pinFileToIPFS(fileStream, {
    pinataMetadata: {
      name: file.name,
    },
  });

    const imageUrl = `https://gateway.pinata.cloud/ipfs/${fileResponse.IpfsHash}`;
    console.log("imageurl",imageUrl)

    const metadata = { name, description, image: imageUrl };
    const metadataResponse = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: `${file.name.split('.')[0]}.json`, // Use the uploaded file name without extension as metadata file name
      }
      });
    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataResponse.IpfsHash}`;

    return new Response(JSON.stringify(metadataUrl), {status : 200})
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    return new Response("Failed to fetch all prompts", {status : 500})
  }
};

