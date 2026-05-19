import { anvil, sepolia } from "wagmi/chains";

export const CHAIN_ID = {
  anvil: anvil.id,
  sepolia: sepolia.id,
} as const;

export const supportedChains = [sepolia, anvil] as const;

export type SupportedChainId = (typeof CHAIN_ID)[keyof typeof CHAIN_ID];

export const supportedChainNames: Record<SupportedChainId, string> = {
  [CHAIN_ID.anvil]: "Anvil",
  [CHAIN_ID.sepolia]: "Sepolia",
};

export const isSupportedChainId = (
  chainId: number,
): chainId is SupportedChainId => {
  return chainId === CHAIN_ID.anvil || chainId === CHAIN_ID.sepolia;
};
