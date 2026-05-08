import { useCallback, useEffect, useState } from "react";
import { useAccount, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleGameABI } from "../abis/WordleGame.abi";
import { useChainAddress } from "../utils/chains";
import { showToast } from "../utils/toast";

type UseUsePlayGameProps = {
  guess: string;
  setGuess: (string: string) => void;
  refetchBalance: () => void;
  refetchAllowance: () => void;
};

export const usePlayGame = ({ guess, setGuess, refetchBalance, refetchAllowance }: UseUsePlayGameProps) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { address: playerAddress } = useAccount();
  const { gameAddress } = useChainAddress();
  const { writeContractAsync } = useWriteContract();

  // Handle check player guesses
  const {
    data: playerGuesses,
    refetch: refetchPlayerGuesses,
    isLoading: isLoadingPlayerGuesses
  } = useReadContract({
    abi: WordleGameABI,
    address: gameAddress,
    functionName: "getPlayerGuesses",
    args: [playerAddress as `0x${string}`]
  }) as { data: string[]; refetch: () => void; isLoading: boolean };

  const hasPlayerReachedGuessLimit = Array.isArray(playerGuesses) && playerGuesses.length >= 5;
  const playerGuessesArray: string[] = Array.isArray(playerGuesses) ? playerGuesses : [];

  // Handle check if player has guessed correctly
  const {
    data: hasPlayerGuessedCorrectly,
    refetch: refetchHasPlayerGuessedCorrectly,
    isLoading: isLoadingHasPlayerGuessedCorrectly
  } = useReadContract({
    abi: WordleGameABI,
    address: gameAddress,
    functionName: "getHasPlayerGuessedCorrectly",
    args: [playerAddress as `0x${string}`]
  }) as { data: boolean; refetch: () => void; isLoading: boolean };

  // Handle check letter statuses
  const letterStatusesMap =
    playerGuessesArray.length > 0
      ? Array.from({ length: playerGuessesArray.length }).map(
          (_, index) =>
            ({
              abi: WordleGameABI,
              address: gameAddress,
              functionName: "getLetterStatuses",
              args: [playerAddress as `0x${string}`, BigInt(index)]
            }) as const
        )
      : [];

  const {
    data: letterStatusesData,
    refetch: refetchLetterStatusesData,
    isLoading: isLoadingLetterStatusesData
  } = useReadContracts({
    contracts: letterStatusesMap
  });

  const letterStatusesArray =
    letterStatusesData?.map(item => (item.result ? { data: Array.from(item.result) } : { data: [] })) || [];

  // Handle submit guess
  const handleSubmitGuess = async (allowance: number) => {
    if (allowance <= 0) return showToast("error", "You need allowance to play the game.");
    if (hasPlayerGuessedCorrectly) return showToast("error", "You have already guessed correctly!");
    if (hasPlayerReachedGuessLimit)
      return showToast("error", "You already reached the limit play tries for this word!");

    setIsLoading(true);
    try {
      const response = await writeContractAsync({
        address: gameAddress,
        abi: WordleGameABI,
        functionName: "makeGuess",
        args: [guess]
      });
      setHash(response);
    } catch (err: unknown) {
      showToast("error", "Failed to submit guess. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  // Handle wait for make guess contract function receipt
  const { isSuccess: hasWaitedForGuess, isError: hasWaitError } = useWaitForTransactionReceipt({ hash });

  // Handle refetch after makeGuess contract function has waited
  const handleHasWaited = useCallback(async () => {
    if (!hash) {
      return;
    }
    if (hasWaitError) {
      showToast("error", "Transaction failed while waiting for receipt.");
      setIsLoading(false);
      return;
    }
    if (hasWaitedForGuess) {
      try {
        setGuess("");
        await Promise.all([
          refetchPlayerGuesses(),
          refetchHasPlayerGuessedCorrectly(),
          refetchLetterStatusesData(),
          refetchAllowance(),
          refetchBalance()
        ]);
      } catch (err: unknown) {
        console.error(err);
        showToast("error", "Transaction failed while waiting for receipt.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [
    hasWaitError,
    hasWaitedForGuess,
    hash,
    refetchAllowance,
    refetchBalance,
    refetchHasPlayerGuessedCorrectly,
    refetchLetterStatusesData,
    refetchPlayerGuesses,
    setGuess
  ]);

  useEffect(() => {
    handleHasWaited();
  }, [handleHasWaited]);

  return {
    handleSubmitGuess,
    refetchPlayerGuesses,
    refetchHasPlayerGuessedCorrectly,
    refetchLetterStatusesData,
    playerGuessesArray,
    letterStatusesArray,
    hasPlayerGuessedCorrectly,
    hasPlayerReachedGuessLimit,
    hasWaitedForGuess,
    isLoadingWordSubmit: isLoading,
    isLoadingWordStatus: isLoadingPlayerGuesses || isLoadingHasPlayerGuessedCorrectly || isLoadingLetterStatusesData
  };
};
