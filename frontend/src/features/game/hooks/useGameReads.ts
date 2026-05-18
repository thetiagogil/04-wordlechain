import { useMemo } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { WordleGameABI } from "../../../lib/contracts/wordle-game.abi";
import { useContractAddresses } from "../../../lib/contracts/useContractAddresses";
import { NUMBER_OF_GUESSES } from "../lib/gameRules";
import { LetterStatusesByGuess } from "../types";

export const useGameReads = () => {
  const { address: playerAddress } = useAccount();
  const { gameAddress } = useContractAddresses();
  const canReadPlayerState = Boolean(playerAddress && gameAddress);

  const {
    data: playerGuesses,
    refetch: refetchPlayerGuesses,
    isLoading: isLoadingPlayerGuesses
  } = useReadContract({
    abi: WordleGameABI,
    address: gameAddress,
    functionName: "getPlayerGuesses",
    args: playerAddress ? [playerAddress] : undefined,
    query: { enabled: canReadPlayerState }
  });

  const playerGuessesArray = useMemo(() => {
    return Array.isArray(playerGuesses) ? [...playerGuesses] : [];
  }, [playerGuesses]);

  const {
    data: hasPlayerGuessedCorrectly,
    refetch: refetchHasPlayerGuessedCorrectly,
    isLoading: isLoadingHasPlayerGuessedCorrectly
  } = useReadContract({
    abi: WordleGameABI,
    address: gameAddress,
    functionName: "getHasPlayerGuessedCorrectly",
    args: playerAddress ? [playerAddress] : undefined,
    query: { enabled: canReadPlayerState }
  });

  const letterStatusesContracts =
    playerAddress && gameAddress && playerGuessesArray.length > 0
      ? playerGuessesArray.map(
          (_, index) =>
            ({
              abi: WordleGameABI,
              address: gameAddress,
              functionName: "getLetterStatuses",
              args: [playerAddress, BigInt(index)]
            }) as const
        )
      : [];

  const {
    data: letterStatusesData,
    refetch: refetchLetterStatusesData,
    isLoading: isLoadingLetterStatusesData
  } = useReadContracts({
    contracts: letterStatusesContracts,
    query: { enabled: letterStatusesContracts.length > 0 }
  });

  const letterStatusesArray: LetterStatusesByGuess = useMemo(() => {
    return letterStatusesData?.map(item => (item.result ? { data: Array.from(item.result) } : { data: [] })) || [];
  }, [letterStatusesData]);

  return {
    refetchPlayerGuesses,
    refetchHasPlayerGuessedCorrectly,
    refetchLetterStatusesData,
    playerGuessesArray,
    letterStatusesArray,
    hasPlayerGuessedCorrectly: Boolean(hasPlayerGuessedCorrectly),
    hasPlayerReachedGuessLimit: playerGuessesArray.length >= NUMBER_OF_GUESSES,
    isLoadingWordStatus: isLoadingPlayerGuesses || isLoadingHasPlayerGuessedCorrectly || isLoadingLetterStatusesData
  };
};
