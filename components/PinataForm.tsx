"use client"
import React, { useState } from 'react';

const MintForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [ipfsURL, setIpfsURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!file) {
      setError('Please select an image file.');
      setLoading(false);
      return;
    }
    try { 
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('file', file);

      const response = await fetch('/api/pinToPinata', {
        method: 'POST',
        body: formData,
      });

      const ipfsJsonUri = await response.json();
      console.log("data",ipfsJsonUri)

      if (response.ok) {
        setIpfsURL(ipfsJsonUri);
      } else {
        setError(ipfsJsonUri.message || 'An error occurred while uploading metadata to IPFS.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while uploading metadata to IPFS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:w-full w-1/2 m-auto flex flex-col gap-2 mb-10">
      <h1>Firstly lets create meta data for your nft<br/>Enter details of your nft you want to create and use the generated uri to mint the nft to your account</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="bg-transparent border-2 p-2 rounded-full my-2"
        />
        <input
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="bg-transparent border-2 p-2 rounded-full my-2"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          required
          className="bg-transparent border-2 p-2 rounded-full my-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="text-white bg-blue-500 p-2 rounded-xl my-2 w-40 m-auto"
        >
          {loading ? 'Uploading...' : 'Upload MetaData'}
        </button>
      </form>
      {ipfsURL && (
        <div>
          <p>IPFS URL: <a href={ipfsURL} target="_blank" rel="noopener noreferrer">{ipfsURL}</a></p>
        </div>
      )}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default MintForm;
