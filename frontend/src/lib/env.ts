import { isAddress, type Address } from "viem";

const getOptionalAddress = (value: unknown): Address | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const address = value.trim();
  return isAddress(address) ? address : undefined;
};

export const env = {
  PUBLIC_PROJECT_ID: import.meta.env.VITE_PUBLIC_PROJECT_ID || "",
  WORDLE_TOKEN_ANVIL_ADDRESS: getOptionalAddress(import.meta.env.VITE_WORDLE_TOKEN_ANVIL_ADDRESS),
  WORDLE_GAME_ANVIL_ADDRESS: getOptionalAddress(import.meta.env.VITE_WORDLE_GAME_ANVIL_ADDRESS),
  WORDLE_TOKEN_SEPOLIA_ADDRESS: getOptionalAddress(import.meta.env.VITE_WORDLE_TOKEN_SEPOLIA_ADDRESS),
  WORDLE_GAME_SEPOLIA_ADDRESS: getOptionalAddress(import.meta.env.VITE_WORDLE_GAME_SEPOLIA_ADDRESS)
} as const;
