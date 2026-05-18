import { LetterStatusesByGuess } from "../types";

export const getLetterStatusesForKeyboard = (guessesArray: string[], statusesArray: LetterStatusesByGuess) => {
  const letterStatuses = {} as { [key: string]: number };

  guessesArray.forEach((guess, guessIndex) => {
    const statuses = statusesArray[guessIndex]?.data || [];

    guess.split("").forEach((letter, letterIndex) => {
      const currentStatus = statuses[letterIndex];
      if (currentStatus >= (letterStatuses[letter] || 0)) {
        letterStatuses[letter] = currentStatus;
      }
    });
  });

  return letterStatuses;
};
