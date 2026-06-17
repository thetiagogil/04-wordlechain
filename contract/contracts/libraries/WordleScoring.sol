// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library WordleScoring {
    uint8 internal constant INCORRECT = 0;
    uint8 internal constant MISPLACED = 1;
    uint8 internal constant CORRECT = 2;
    uint8 internal constant WORD_LENGTH = 5;

    function score(bytes memory answer, bytes memory guess) internal pure returns (uint8[5] memory letterStatuses) {
        bool[5] memory matchedAnswerLetters;
        bool[5] memory matchedGuessLetters;

        for (uint8 i = 0; i < WORD_LENGTH; i++) {
            if (guess[i] == answer[i]) {
                letterStatuses[i] = CORRECT;
                matchedAnswerLetters[i] = true;
                matchedGuessLetters[i] = true;
            }
        }

        for (uint8 i = 0; i < WORD_LENGTH; i++) {
            if (matchedGuessLetters[i]) {
                continue;
            }

            for (uint8 j = 0; j < WORD_LENGTH; j++) {
                if (!matchedAnswerLetters[j] && guess[i] == answer[j]) {
                    letterStatuses[i] = MISPLACED;
                    matchedAnswerLetters[j] = true;
                    break;
                }
            }
        }
    }
}
