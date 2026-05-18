import { useChainId } from "wagmi";
import { contractAddressesByChainId, type ContractAddresses } from "./addresses";
import { isSupportedChainId, supportedChainNames } from "./chains";

type ContractAddressStatus = "ready" | "unsupported-chain" | "missing-address";

export type ContractAddressState = ContractAddresses & {
  chainId: number;
  status: ContractAddressStatus;
  isReady: boolean;
  message?: string;
};

export const useContractAddresses = (): ContractAddressState => {
  const chainId = useChainId();

  if (!isSupportedChainId(chainId)) {
    return {
      chainId,
      status: "unsupported-chain",
      isReady: false,
      message: "Unsupported network. Switch to Sepolia or Anvil to play Wordlechain."
    };
  }

  const addresses = contractAddressesByChainId[chainId];
  const missingNames = [
    !addresses.tokenAddress ? "token contract" : undefined,
    !addresses.gameAddress ? "game contract" : undefined
  ].filter(Boolean);

  if (missingNames.length > 0) {
    return {
      ...addresses,
      chainId,
      status: "missing-address",
      isReady: false,
      message: `Missing ${missingNames.join(" and ")} address for ${supportedChainNames[chainId]}. Check the VITE_WORDLE_* environment variables.`
    };
  }

  return {
    ...addresses,
    chainId,
    status: "ready",
    isReady: true
  };
};
