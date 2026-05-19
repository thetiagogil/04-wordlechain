import { useCallback, useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleGameABI } from "../../../lib/contracts/wordle-game.abi";
import { useContractAddresses } from "../../../lib/contracts/useContractAddresses";
import { showToast } from "../../../lib/toast";
import { isValidGuessWord, normalizeWord } from "../lib/wordValidation";
import { RefetchFn } from "../types";

type UseSubmitGuessProps = {
  guess: string;
  setGuess: (value: string) => void;
  refetchBalance: RefetchFn;
  refetchAllowance: RefetchFn;
  refetchPlayerGuesses: RefetchFn;
  refetchHasPlayerGuessedCorrectly: RefetchFn;
  refetchLetterStatusesData: RefetchFn;
  hasPlayerGuessedCorrectly: boolean;
  hasPlayerReachedGuessLimit: boolean;
};

export const useSubmitGuess = ({
  guess,
  setGuess,
  refetchBalance,
  refetchAllowance,
  refetchPlayerGuesses,
  refetchHasPlayerGuessedCorrectly,
  refetchLetterStatusesData,
  hasPlayerGuessedCorrectly,
  hasPlayerReachedGuessLimit,
}: UseSubmitGuessProps) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { gameAddress, message: contractAddressMessage } =
    useContractAddresses();
  const { writeContractAsync } = useWriteContract();

  const handleSubmitGuess = useCallback(
    async (allowance: number) => {
      if (!gameAddress) {
        showToast(
          "error",
          contractAddressMessage || "Game contract address is not configured.",
        );
        return;
      }
      if (!isValidGuessWord(guess)) {
        showToast("error", "Guess must be 5 letters.");
        return;
      }
      if (allowance <= 0) {
        showToast("error", "You need allowance to play the game.");
        return;
      }
      if (hasPlayerGuessedCorrectly) {
        showToast("error", "You have already guessed correctly!");
        return;
      }
      if (hasPlayerReachedGuessLimit) {
        showToast(
          "error",
          "You already reached the limit play tries for this word!",
        );
        return;
      }

      setIsLoading(true);
      try {
        const response = await writeContractAsync({
          address: gameAddress,
          abi: WordleGameABI,
          functionName: "makeGuess",
          args: [normalizeWord(guess)],
        });
        setHash(response);
      } catch (err: unknown) {
        showToast("error", "Failed to submit guess. Please try again.");
        console.error(err);
        setIsLoading(false);
      }
    },
    [
      contractAddressMessage,
      gameAddress,
      guess,
      hasPlayerGuessedCorrectly,
      hasPlayerReachedGuessLimit,
      writeContractAsync,
    ],
  );

  const { isSuccess: hasWaitedForGuess, isError: hasWaitError } =
    useWaitForTransactionReceipt({ hash });

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
          refetchBalance(),
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
    setGuess,
  ]);

  useEffect(() => {
    handleHasWaited();
  }, [handleHasWaited]);

  return {
    handleSubmitGuess,
    hasWaitedForGuess,
    isLoadingWordSubmit: isLoading,
  };
};
