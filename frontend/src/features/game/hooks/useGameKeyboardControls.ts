import { useCallback, useEffect } from "react";
import { WORD_LENGTH } from "../lib/gameRules";

type UseGameKeyboardControlsProps = {
  allowance: number;
  guess: string;
  handleSubmitGuess: (allowance: number) => void;
  isKeyboardDisabled: boolean;
  setGuess: (value: string | ((value: string) => string)) => void;
};

export const useGameKeyboardControls = ({
  allowance,
  guess,
  handleSubmitGuess,
  isKeyboardDisabled,
  setGuess,
}: UseGameKeyboardControlsProps) => {
  const handleOnLetterClick = useCallback(
    (letter: string) => {
      if (guess.length < WORD_LENGTH) {
        setGuess((prev) => prev + letter);
      }
    },
    [guess.length, setGuess],
  );

  const handleDelete = useCallback(() => {
    if (guess.length > 0) {
      setGuess((prev) => prev.slice(0, -1));
    }
  }, [guess.length, setGuess]);

  const handleOnGuessSubmit = useCallback(() => {
    if (guess.length === WORD_LENGTH) {
      handleSubmitGuess(allowance);
    }
  }, [allowance, guess.length, handleSubmitGuess]);

  useEffect(() => {
    const handleOnKeyClick = (event: KeyboardEvent) => {
      if (isKeyboardDisabled) return;
      if (document.activeElement && document.activeElement.tagName === "INPUT")
        return;

      const key = event.key.toUpperCase();
      const isKeyValid =
        key.length === 1 &&
        key >= "A" &&
        key <= "Z" &&
        guess.length < WORD_LENGTH;
      if (key === "BACKSPACE") {
        handleDelete();
      } else if (key === "ENTER") {
        handleOnGuessSubmit();
      } else if (isKeyValid) {
        setGuess((prev) => prev + key);
      }
    };

    window.addEventListener("keydown", handleOnKeyClick);

    return () => {
      window.removeEventListener("keydown", handleOnKeyClick);
    };
  }, [
    guess.length,
    handleDelete,
    handleOnGuessSubmit,
    isKeyboardDisabled,
    setGuess,
  ]);

  return {
    handleDelete,
    handleOnGuessSubmit,
    handleOnLetterClick,
  };
};
