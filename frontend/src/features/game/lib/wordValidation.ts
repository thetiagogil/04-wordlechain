import { WORD_LENGTH } from "./gameRules";

const WORD_PATTERN = /^[A-Z]+$/;

export const normalizeWord = (word: string) => word.trim().toUpperCase();

export const isValidGuessWord = (word: string) => {
  const normalizedWord = normalizeWord(word);
  return (
    normalizedWord.length === WORD_LENGTH && WORD_PATTERN.test(normalizedWord)
  );
};
