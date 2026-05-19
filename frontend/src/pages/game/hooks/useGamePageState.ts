import { useState } from "react";
import { useSetWord } from "../../../features/admin/hooks/useSetWord";
import { useGameState } from "../../../features/game/hooks/useGameState";
import { useApproveTokens } from "../../../features/token/hooks/useApproveTokens";
import { useMintTokens } from "../../../features/token/hooks/useMintTokens";
import { useWalletStatus } from "../../../features/wallet/hooks/useWalletStatus";
import { useContractAddresses } from "../../../lib/contracts/useContractAddresses";

export const useGamePageState = () => {
  const [guess, setGuess] = useState<string>("");

  const { address: playerAddress, isConnected } = useWalletStatus();
  const contractAddresses = useContractAddresses();
  const {
    handleMintTokens,
    balance,
    hasBalance,
    isLoading: isMinting,
    refetchBalance,
  } = useMintTokens();
  const {
    handleApproveTokens,
    refetchAllowance,
    allowance,
    hasAllowance,
    isLoading: isLoadingToken,
  } = useApproveTokens();
  const {
    handleSubmitGuess,
    refetchPlayerGuesses,
    refetchHasPlayerGuessedCorrectly,
    refetchLetterStatusesData,
    playerGuessesArray,
    letterStatusesArray,
    hasPlayerGuessedCorrectly,
    hasPlayerReachedGuessLimit,
    isLoadingWordSubmit,
    isLoadingWordStatus,
  } = useGameState({ guess, setGuess, refetchBalance, refetchAllowance });
  const {
    handleSetWord,
    adminAddress,
    isLoading: isLoadingNewWord,
  } = useSetWord({
    refetchPlayerGuesses,
    refetchHasPlayerGuessedCorrectly,
    refetchLetterStatusesData,
  });

  const isDisabled =
    !isConnected ||
    !contractAddresses.isReady ||
    isLoadingNewWord ||
    isLoadingToken ||
    isLoadingWordSubmit ||
    isLoadingWordStatus;
  const isAdmin = Boolean(
    isConnected &&
      playerAddress &&
      adminAddress &&
      playerAddress === adminAddress,
  );

  return {
    allowance,
    balance,
    contractAddresses,
    guess,
    handleApproveTokens,
    handleMintTokens,
    handleSetWord,
    handleSubmitGuess,
    hasAllowance,
    hasBalance,
    hasPlayerGuessedCorrectly,
    hasPlayerReachedGuessLimit,
    isAdmin,
    isDisabled,
    isLoadingNewWord,
    isLoadingToken,
    isLoadingWordSubmit,
    isMinting,
    letterStatusesArray,
    playerGuessesArray,
    setGuess,
  };
};
