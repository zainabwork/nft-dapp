export interface TransactionListProps {
    onTransactionHash: (hash: string) => void; // Callback function to update hash in Home component
    contractAddress: string;
  }

export interface OwnershipHistoryProps {
    tokenId: string;
    contractAddress: string;
  }

export interface TransactionDetailsProps {
  hash:string;
  contractAddress:string;
}

export interface SingleDetailProps {
  txHash:string;
  contractAddress:string;
}