import { colors } from "../../../theme/colors";
import { LetterStatusesByGuess } from "../types";

export const LETTER_STATUS = {
  incorrect: 0,
  misplaced: 1,
  correct: 2
} as const;

export const LETTER_BG_COLORS: { [key: number]: string } = {
  [LETTER_STATUS.correct]: colors.main.green,
  [LETTER_STATUS.misplaced]: colors.main.yellow,
  [LETTER_STATUS.incorrect]: colors.main.grey
};

export const getLetterStatusBackgroundColor = (
  rowIndex: number,
  colIndex: number,
  letterStatusesArray: LetterStatusesByGuess
) => {
  const status = letterStatusesArray[rowIndex]?.data?.[colIndex];
  return status !== undefined ? LETTER_BG_COLORS[status] : "transparent";
};
