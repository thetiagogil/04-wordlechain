import { Button, Stack } from "@mui/joy";
import { useMemo } from "react";
import { useGameKeyboardControls } from "../hooks/useGameKeyboardControls";
import { WORD_LENGTH } from "../lib/gameRules";
import { getLetterStatusesForKeyboard } from "../lib/keyboardLetterStatuses";
import { KEYBOARD_BOTTOM_ROW, KEYBOARD_MIDDLE_ROW, KEYBOARD_TOP_ROW } from "../lib/keyboardLayout";
import { LETTER_BG_COLORS } from "../lib/letterStatus";
import { LetterStatusesByGuess } from "../types";

const keyboardRowSx = {
  display: "grid",
  justifyContent: "center",
  gap: 0.5,
  width: "100%"
};

const letterButtonSx = {
  "--Button-paddingInline": "0px",
  width: "100%",
  minWidth: 0,
  height: { xs: 54, sm: 55 },
  p: 0,
  overflow: "hidden",
  fontSize: { xs: 12, sm: 14 },
  fontWeight: "bold"
};

const actionButtonSx = {
  ...letterButtonSx,
  fontSize: { xs: 10, sm: 13 },
  whiteSpace: "nowrap"
};

type GameKeyboardProps = {
  guess: string;
  setGuess: (value: string | ((value: string) => string)) => void;
  handleSubmitGuess: (allowance: number) => void;
  allowance: number;
  hasPlayerGuessedCorrectly: boolean;
  hasPlayerReachedGuessLimit: boolean;
  playerGuessesArray: string[];
  letterStatusesArray: LetterStatusesByGuess;
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
  const isKeyboardDisabled = isDisabled || hasPlayerGuessedCorrectly || hasPlayerReachedGuessLimit;
  const { handleDelete, handleOnGuessSubmit, handleOnLetterClick } = useGameKeyboardControls({
    allowance,
    guess,
    handleSubmitGuess,
    isKeyboardDisabled,
    setGuess
  });

  const letterStatusesForKeyboard = useMemo(() => {
    return getLetterStatusesForKeyboard(playerGuessesArray, letterStatusesArray);
  }, [playerGuessesArray, letterStatusesArray]);

  const letterButton = (letter: string) => {
    const bgcolor = LETTER_BG_COLORS[letterStatusesForKeyboard[letter]] || "neutral.700";

    return (
      <Button
        key={letter}
        onClick={() => handleOnLetterClick(letter)}
        color="neutral"
        disabled={isKeyboardDisabled}
        sx={{
          ...letterButtonSx,
          bgcolor,
          ":hover": { bgcolor, borderColor: "white" }
        }}
      >
        {letter}
      </Button>
    );
  };

  return (
    <Stack component="section" sx={{ justifyContent: "center", gap: 0.5, width: "100%" }}>
      <Stack sx={{ ...keyboardRowSx, gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }}>
        {KEYBOARD_TOP_ROW.map(letter => letterButton(letter))}
      </Stack>
      <Stack sx={{ ...keyboardRowSx, gridTemplateColumns: "repeat(9, minmax(0, 1fr))", px: { xs: 1.5, sm: 2 } }}>
        {KEYBOARD_MIDDLE_ROW.map(letter => letterButton(letter))}
      </Stack>
      <Stack sx={{ ...keyboardRowSx, gridTemplateColumns: "1.35fr repeat(7, minmax(0, 1fr)) 1.35fr" }}>
        <Button
          onClick={handleDelete}
          color="neutral"
          disabled={isKeyboardDisabled || guess.length <= 0}
          sx={actionButtonSx}
        >
          Delete
        </Button>
        {KEYBOARD_BOTTOM_ROW.map(letter => letterButton(letter))}
        <Button
          onClick={handleOnGuessSubmit}
          color="neutral"
          disabled={isKeyboardDisabled || guess.length < WORD_LENGTH}
          loading={isLoadingWordSubmit}
          sx={actionButtonSx}
        >
          Enter
        </Button>
      </Stack>
    </Stack>
  );
};
