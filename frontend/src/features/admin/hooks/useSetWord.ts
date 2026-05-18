import { useCallback, useEffect, useState } from "react";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleGameABI } from "../../../lib/contracts/wordle-game.abi";
import { useContractAddresses } from "../../../lib/contracts/useContractAddresses";
import { showToast } from "../../../lib/toast";
import { isValidGuessWord, normalizeWord } from "../../game/lib/wordValidation";
import { RefetchFn } from "../../game/types";

type UseSetWordProps = {
  refetchPlayerGuesses: RefetchFn;
  refetchHasPlayerGuessedCorrectly: RefetchFn;
  refetchLetterStatusesData: RefetchFn;
};

export const useSetWord = ({
  refetchPlayerGuesses,
  refetchHasPlayerGuessedCorrectly,
  refetchLetterStatusesData
}: UseSetWordProps) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { gameAddress, message: contractAddressMessage } = useContractAddresses();
  const { writeContractAsync } = useWriteContract();

  // Handle check admin address
  const { data: adminAddress } = useReadContract({
    abi: WordleGameABI,
    address: gameAddress,
    functionName: "admin",
    query: { enabled: Boolean(gameAddress) }
  });

  // Handle set new word by admin
  const handleSetWord = async (newWord: string) => {
    if (!gameAddress) {
      showToast("error", contractAddressMessage || "Game contract address is not configured.");
      return;
    }

    if (!isValidGuessWord(newWord)) {
      showToast("error", "Word must be 5 letters!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await writeContractAsync({
        address: gameAddress,
        abi: WordleGameABI,
        functionName: "setWord",
        args: [normalizeWord(newWord)]
      });
      setHash(response);
    } catch (err: unknown) {
      showToast("error", "Failed to set word. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  // Handle wait for make guess contract function receipt
  const { isSuccess: hasWaitedForWord, isError: hasWaitError } = useWaitForTransactionReceipt({ hash });

  // Handle refetch after setWord contract function has waited
  const handleHasWaited = useCallback(async () => {
    if (!hash) {
      return;
    }
    if (hasWaitError) {
      showToast("error", "Failed to set word. Please try again.");
      setIsLoading(false);
    }
    if (hasWaitedForWord) {
      try {
        await Promise.all([refetchPlayerGuesses(), refetchHasPlayerGuessedCorrectly(), refetchLetterStatusesData()]);
        showToast("success", "Word set successfully!");
      } catch (err: unknown) {
        console.error(err);
        showToast("error", "Transaction failed while waiting for receipt.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [
    hasWaitError,
    hasWaitedForWord,
    hash,
    refetchHasPlayerGuessedCorrectly,
    refetchLetterStatusesData,
    refetchPlayerGuesses
  ]);

  useEffect(() => {
    handleHasWaited();
  }, [handleHasWaited]);

  return {
    handleSetWord,
    adminAddress,
    hasWaitedForWord,
    isLoading
  };
};
