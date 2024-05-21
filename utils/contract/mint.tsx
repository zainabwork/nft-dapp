import { useEthers, useContractFunction } from '@wagmi/hooks';
import  {Contract} from 'ethers';
import ERC721ABI from '../../components/abi/ERC721ContractAbi.json';

const contractAddress = 'YOUR_ERC721_CONTRACT_ADDRESS';
const contract = new Contract(contractAddress, ERC721ABI);

export async function mintNFT(tokenURI: string) {
    try {
        const { account } = useEthers();
        const { send } = useContractFunction(contract, 'mint');
        
        // Ensure account is connected
        if (!account) {
            console.error('No Ethereum account connected.');
            return;
        }

        // Call the mint function of the contract
        await send(account, tokenURI);
        console.log('NFT minted successfully to owner\'s address!');
    } catch (error) {
        console.error('Error minting NFT:', error);
    }
}
