import { type Address } from "viem";
import { env } from "../env";
import { CHAIN_ID, type SupportedChainId } from "./chains";

export type ContractAddresses = {
  tokenAddress?: Address;
  gameAddress?: Address;
};

export const contractAddressesByChainId: Record<SupportedChainId, ContractAddresses> = {
  [CHAIN_ID.anvil]: {
    tokenAddress: env.WORDLE_TOKEN_ANVIL_ADDRESS,
    gameAddress: env.WORDLE_GAME_ANVIL_ADDRESS
  },
  [CHAIN_ID.sepolia]: {
    tokenAddress: env.WORDLE_TOKEN_SEPOLIA_ADDRESS,
    gameAddress: env.WORDLE_GAME_SEPOLIA_ADDRESS
  }
};
