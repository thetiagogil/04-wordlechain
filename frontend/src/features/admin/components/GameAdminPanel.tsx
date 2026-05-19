import { Button, Input, Stack } from "@mui/joy";
import { useState } from "react";
import { isValidGuessWord, normalizeWord } from "../../game/lib/wordValidation";

type GameAdminPanelProps = {
  handleSetWord: (word: string) => void;
  isLoadingNewWord: boolean;
  isDisabled: boolean;
};

export const GameAdminPanel = ({
  handleSetWord,
  isLoadingNewWord,
  isDisabled,
}: GameAdminPanelProps) => {
  const [word, setWord] = useState<string>("");

  const handleOnButtonClick = () => {
    if (isValidGuessWord(word)) {
      handleSetWord(word);
      setWord("");
    }
  };

  return (
    <Stack
      component="section"
      sx={{ flexDirection: "row", gap: 1, width: "100%" }}
    >
      <Input
        placeholder="Enter a 5 letter word..."
        value={word}
        onChange={(e) => setWord(normalizeWord(e.target.value))}
        disabled={isDisabled}
        sx={{ width: "60%" }}
      />
      <Button
        onClick={handleOnButtonClick}
        color="neutral"
        loading={isLoadingNewWord}
        disabled={isDisabled || !isValidGuessWord(word)}
        sx={{ width: "40%" }}
      >
        Set New Word
      </Button>
    </Stack>
  );
};
