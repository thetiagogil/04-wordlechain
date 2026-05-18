import { RefetchFn } from "../types";
import { useGameReads } from "./useGameReads";
import { useSubmitGuess } from "./useSubmitGuess";

type UseGameStateProps = {
  guess: string;
  setGuess: (value: string) => void;
  refetchBalance: RefetchFn;
  refetchAllowance: RefetchFn;
};

export const useGameState = ({ guess, setGuess, refetchBalance, refetchAllowance }: UseGameStateProps) => {
  const gameReads = useGameReads();
  const submitGuess = useSubmitGuess({
    guess,
    setGuess,
    refetchBalance,
    refetchAllowance,
    refetchPlayerGuesses: gameReads.refetchPlayerGuesses,
    refetchHasPlayerGuessedCorrectly: gameReads.refetchHasPlayerGuessedCorrectly,
    refetchLetterStatusesData: gameReads.refetchLetterStatusesData,
    hasPlayerGuessedCorrectly: gameReads.hasPlayerGuessedCorrectly,
    hasPlayerReachedGuessLimit: gameReads.hasPlayerReachedGuessLimit
  });

  return {
    ...gameReads,
    ...submitGuess
  };
};
