import { useAccount } from "wagmi";

export const useWalletStatus = () => {
  const { address, isConnected } = useAccount();

  return {
    address,
    isConnected,
  };
};
