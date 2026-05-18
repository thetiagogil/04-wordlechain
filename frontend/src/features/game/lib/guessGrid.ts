import { NUMBER_OF_GUESSES, WORD_LENGTH } from "./gameRules";

export const getVisibleGuessRows = (guess: string, playerGuesses: string[]) => {
  const guessesToShow = [...playerGuesses];

  if (guessesToShow.length < NUMBER_OF_GUESSES) {
    guessesToShow.push(guess.padEnd(WORD_LENGTH, " "));
  }

  while (guessesToShow.length < NUMBER_OF_GUESSES) {
    guessesToShow.push("".padEnd(WORD_LENGTH, " "));
  }

  return guessesToShow;
};
