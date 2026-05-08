import { Button, Stack } from "@mui/joy";
import { useCallback, useEffect, useMemo } from "react";
import { LETTER_BG_COLORS } from "../../utils/get-letter-bg-colors";

type GameKeyboardProps = {
  guess: string;
  setGuess: (value: string | ((value: string) => string)) => void;
  handleSubmitGuess: (allowance: number) => void;
  allowance: number;
  hasPlayerGuessedCorrectly: boolean;
  hasPlayerReachedGuessLimit: boolean;
  playerGuessesArray: string[];
  letterStatusesArray: { data: number[] }[];
  isLoadingWordSubmit: boolean;
  isDisabled: boolean;
};

export const GameKeyboard = ({
  guess,
  setGuess,
  handleSubmitGuess,
  allowance,
  hasPlayerGuessedCorrectly,
  hasPlayerReachedGuessLimit,
  playerGuessesArray,
  letterStatusesArray,
  isLoadingWordSubmit,
  isDisabled
}: GameKeyboardProps) => {
  const ROW1 = "QWERTYUIOP".split("");
  const ROW2 = "ASDFGHJKL".split("");
  const ROW3 = "ZXCVBNM".split("");
  const lettersSize = { width: { xs: 32, md: 40 }, height: 55, p: { xs: 1, sm: "auto" } };
  const actionsSize = { width: { xs: 52, md: 62 }, height: 55 };
  const isKeyboardDisabled = isDisabled || hasPlayerGuessedCorrectly || hasPlayerReachedGuessLimit;

  const handleOnLetterClick = useCallback(
    (letter: string) => {
      if (guess.length < 5) setGuess(prev => prev + letter);
    },
    [guess.length, setGuess]
  );

  const handleDelete = useCallback(() => {
    if (guess.length > 0) setGuess(prev => prev.slice(0, -1));
  }, [guess.length, setGuess]);

  const handleOnGuessSubmit = useCallback(() => {
    if (guess.length === 5) {
      handleSubmitGuess(allowance);
    }
  }, [allowance, guess.length, handleSubmitGuess]);

  // Handle showing letter statuses for virtual keyboard
  const getLetterStatusesForKeyboard = (guessesArray: string[], statusesArray: { data: number[] }[]) => {
    const letterStatuses = {} as { [key: string]: number };

    // Iterate over each guess
    guessesArray.forEach((guess, guessIndex) => {
      const statuses = statusesArray[guessIndex]?.data || [];
      // Iterate over each guess letter
      guess.split("").forEach((letter, letterIndex) => {
        const currentStatus = statuses[letterIndex];
        // Add letter with corresponding status to the new array
        if (currentStatus >= (letterStatuses[letter] || 0)) {
          letterStatuses[letter] = currentStatus;
        }
      });
    });

    return letterStatuses;
  };

  const useLetterStatusesForKeyboard = useMemo(() => {
    return getLetterStatusesForKeyboard(playerGuessesArray, letterStatusesArray);
  }, [playerGuessesArray, letterStatusesArray]);

  // Handle virtual keyboard button
  const letterButton = (letter: string) => {
    const bgcolor = LETTER_BG_COLORS[useLetterStatusesForKeyboard[letter]] || "neutral.700";

    return (
      <Button
        key={letter}
        onClick={() => handleOnLetterClick(letter)}
        color="neutral"
        disabled={isKeyboardDisabled}
        sx={{
          ...lettersSize,
          bgcolor,
          fontWeight: "bold",
          ":hover": { bgcolor, borderColor: "white" }
        }}
      >
        {letter}
      </Button>
    );
  };

  // Handle physical keyboard support
  useEffect(() => {
    const handleOnKeyClick = (event: KeyboardEvent) => {
      if (isKeyboardDisabled) return;
      if (document.activeElement && document.activeElement.tagName === "INPUT") return;

      const key = event.key.toUpperCase();
      const isKeyValid = key.length === 1 && key >= "A" && key <= "Z" && guess.length < 5;
      if (key === "BACKSPACE") {
        handleDelete();
      } else if (key === "ENTER") {
        handleOnGuessSubmit();
      } else if (isKeyValid) {
        setGuess(prev => prev + key);
      }
    };

    window.addEventListener("keydown", handleOnKeyClick);

    return () => {
      window.removeEventListener("keydown", handleOnKeyClick);
    };
  }, [guess.length, handleDelete, handleOnGuessSubmit, isKeyboardDisabled, setGuess]);

  return (
    <Stack component="section" sx={{ justifyContent: "center", gap: 0.5, width: "100%" }}>
      <Stack sx={{ justifyContent: "center", flexDirection: "row", gap: 0.5 }}>
        {ROW1.map(letter => letterButton(letter))}
      </Stack>
      <Stack sx={{ justifyContent: "center", flexDirection: "row", gap: 0.5 }}>
        {ROW2.map(letter => letterButton(letter))}
      </Stack>
      <Stack sx={{ justifyContent: "center", flexDirection: "row", gap: 0.5 }}>
        <Button
          onClick={handleDelete}
          color="neutral"
          disabled={isKeyboardDisabled || guess.length <= 0}
          sx={actionsSize}
        >
          Delete
        </Button>
        {ROW3.map(letter => letterButton(letter))}
        <Button
          onClick={handleOnGuessSubmit}
          color="neutral"
          disabled={isKeyboardDisabled || guess.length < 5}
          loading={isLoadingWordSubmit}
          sx={{ ...actionsSize }}
        >
          Enter
        </Button>
      </Stack>
    </Stack>
  );
};
