export const WordleGameABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "GUESS_FEE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "MAX_ATTEMPTS",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "admin",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getHasPlayerGuessedCorrectly",
    inputs: [
      {
        name: "player",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getLetterStatuses",
    inputs: [
      {
        name: "player",
        type: "address",
        internalType: "address"
      },
      {
        name: "guessIndex",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "uint8[5]",
        internalType: "uint8[5]"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getPlayerGuesses",
    inputs: [
      {
        name: "player",
        type: "address",
        internalType: "address"
      }
    ],
    outputs: [
      {
        name: "",
        type: "string[]",
        internalType: "string[]"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "makeGuess",
    inputs: [
      {
        name: "playerGuess",
        type: "string",
        internalType: "string"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "setWord",
    inputs: [
      {
        name: "_word",
        type: "string",
        internalType: "string"
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "wordId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256"
      }
    ],
    stateMutability: "view"
  }
] as const;
