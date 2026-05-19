import { Box, Stack } from "@mui/joy";
import { motion } from "framer-motion";
import { getVisibleGuessRows } from "../lib/guessGrid";
import { WORD_LENGTH } from "../lib/gameRules";
import { getLetterStatusBackgroundColor } from "../lib/letterStatus";
import { LetterStatusesByGuess } from "../types";

type GameGuessGridProps = {
  guess: string;
  playerGuessesArray: string[];
  letterStatusesArray: LetterStatusesByGuess;
};

export const GameGuessGrid = ({
  guess,
  playerGuessesArray,
  letterStatusesArray,
}: GameGuessGridProps) => {
  return (
    <Stack component="section" sx={{ gap: 1, width: "100%", maxWidth: 360 }}>
      {getVisibleGuessRows(guess, playerGuessesArray).map(
        (rowGuess: string, rowIndex: number) => (
          <Stack
            key={rowIndex}
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${WORD_LENGTH}, minmax(0, 1fr))`,
              gap: 1,
            }}
          >
            {Array.from(rowGuess).map((letter, colIndex) => {
              const isCurrentRow = rowIndex === playerGuessesArray.length;
              const backgroundColor = getLetterStatusBackgroundColor(
                rowIndex,
                colIndex,
                letterStatusesArray,
              );
              return (
                <Box
                  key={colIndex}
                  component={motion.div}
                  initial={{ scale: 1 }}
                  animate={
                    isCurrentRow && letter.trim() && { scale: [1, 1.1, 1] }
                  }
                  transition={{ duration: 0.1 }}
                  sx={{
                    color: "#F8F8ED",
                    backgroundColor,
                    aspectRatio: "1 / 1",
                    width: "100%",
                    border: "1px solid",
                    borderColor: "neutral.700",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: { xs: 28, sm: 32 },
                    fontWeight: "bold",
                  }}
                >
                  {letter.trim().toUpperCase()}
                </Box>
              );
            })}
          </Stack>
        ),
      )}
    </Stack>
  );
};
