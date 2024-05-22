export interface TransactionListProps {
    onTransactionHash: (hash: string) => void; // Callback function to update hash in Home component
  }

export interface OwnershipHistoryProps {
    tokenId: string;
  }