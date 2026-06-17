// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/WordleToken.sol";
import "../contracts/WordleGame.sol";

contract WordleGameTest is Test {
    WordleToken public token;
    WordleGame public game;

    address public admin;
    address public player;
    address public playerWithoutTokens;

    // Function to setup the tests
    function setUp() public {
        // Deploy the WordleToken contract and WordleGame contract
        token = new WordleToken();
        game = new WordleGame(address(token));

        // Set the admin and player addresses
        admin = address(this);
        player = address(0x123);
        playerWithoutTokens = address(0x456);

        // Mint tokens for the player and approve the game contract
        vm.prank(player);
        token.mintTokens();
        vm.prank(player);
        token.approve(address(game), type(uint256).max);

        // Set the initial word for the game
        game.setWord("MANGO");
    }

    // Test setting a word
    function testSetWord() public {
        // Player attempts to set a word (should fail)
        vm.prank(player);
        vm.expectRevert("Only the admin can perform this action");
        game.setWord("MANGO");

        // Admin attempts to set a word (should succeed)
        vm.prank(admin);
        game.setWord("MANGO");

        // Player attempts to guess the old word (should fail)
        vm.prank(player);
        game.makeGuess("APPLE");
        bool guessedCorrectly = game.getHasPlayerGuessedCorrectly(player);
        assertFalse(guessedCorrectly, "Player should not guess the old word correctly");

        // Player guesses the new word (should succeed)
        vm.prank(player);
        game.makeGuess("MANGO");
        guessedCorrectly = game.getHasPlayerGuessedCorrectly(player);
        assertTrue(guessedCorrectly, "Player should guess the new word correctly");
    }

    // Test making a guess without enough tokens
    function testMakeGuessWithoutEnoughTokens() public {
        // Check that the player without tokens has a balance of 0
        uint256 playerBalance = token.balanceOf(playerWithoutTokens);
        assertEq(playerBalance, 0, "The player's balance should be 0");

        // Player without tokens attempts to make a guess (should fail)
        vm.prank(playerWithoutTokens);
        vm.expectRevert("Player does not have enough tokens");
        game.makeGuess("MANGO");
    }

    // Test making an incorrect guess
    function testMakeIncorrectGuess() public {
        // Player makes an incorrect guess
        vm.prank(player);
        game.makeGuess("LEMON");

        // Check that the guess was incorrect
        bool guessedCorrectly = game.getHasPlayerGuessedCorrectly(player);
        assertFalse(guessedCorrectly, "Player should not guess correctly");
    }

    // Test making a correct guess
    function testMakeCorrectGuess() public {
        // Player makes a correct guess
        vm.prank(player);
        game.makeGuess("MANGO");

        // Check that the guess was correct
        bool guessedCorrectly = game.getHasPlayerGuessedCorrectly(player);
        assertTrue(guessedCorrectly, "Player should guess correctly");
    }

    // Test making a guess after exceeding the maximum attempts
    function testMakeGuessAfterMaxAttempts() public {
        // Player makes the maximum number of guesses
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(player);
            game.makeGuess("LEMON");
        }

        // Player attempts another guess after reaching max attempts (should fail)
        vm.prank(player);
        vm.expectRevert("Player has exceeded the maximum number of guesses");
        game.makeGuess("MANGO");
    }

    // Test making a guess with invalid lengths
    function testMakeGuessWithInvalidLength() public {
        // Player attempts to make a guess with less than 5 letters (should fail)
        vm.prank(player);
        vm.expectRevert("Guess must be 5 letters long");
        game.makeGuess("PEAR");

        // Player attempts to make a guess with more than 5 letters (should fail)
        vm.prank(player);
        vm.expectRevert("Guess must be 5 letters long");
        game.makeGuess("ORANGE");

        // Player attempts to make a guess with 5 letters (should succeed)
        vm.prank(player);
        game.makeGuess("MANGO");
    }

    // Test get letter statuses
    function testGetLetterStatuses() public {
        // Player makes a guess
        vm.prank(player);
        game.makeGuess("MELON");

        // Set expected statuses for the guess
        uint8[5] memory expectedStatuses = [2, 0, 0, 1, 1];

        // Get the letter statuses for the player's guess
        uint8[5] memory statuses = game.getLetterStatuses(player, 0);

        // Check that each status matches the expected statuses
        for (uint256 i = 0; i < 5; i++) {
            assertEq(statuses[i], expectedStatuses[i], "Letter status should match expected statuses");
        }
    }

    function testGetLetterStatusesWithDuplicateLetters() public {
        game.setWord("APPLE");

        vm.prank(player);
        game.makeGuess("ALLEY");

        uint8[5] memory expectedStatuses = [2, 1, 0, 1, 0];
        uint8[5] memory statuses = game.getLetterStatuses(player, 0);

        for (uint256 i = 0; i < 5; i++) {
            assertEq(statuses[i], expectedStatuses[i], "Duplicate-letter status should match expected statuses");
        }
    }

    // Test getting a player's guesses for a specific word
    function testGetPlayerGuesses() public {
        // Player makes multiple guesses
        vm.prank(player);
        game.makeGuess("LEMON");
        vm.prank(player);
        game.makeGuess("MELON");

        // Get all guesses made by the player
        string[] memory guesses = game.getPlayerGuesses(player);

        // Check the number and content of the guesses
        assertEq(guesses.length, 2, "Should return correct number of guesses");
        assertEq(guesses[0], "LEMON", "First guess should match");
        assertEq(guesses[1], "MELON", "Second guess should match");
    }

    // Test checking if a player has guessed correctly
    function testGetHasPlayerGuessedCorrectly() public {
        // Player makes an incorrect guess
        vm.prank(player);
        game.makeGuess("APPLE");

        // Check that the guess was incorrect
        bool guessedIncorrectly = game.getHasPlayerGuessedCorrectly(player);
        assertFalse(guessedIncorrectly, "Player shouldn't have already guessed correctly");

        // Player makes a correct guess
        vm.prank(player);
        game.makeGuess("MANGO");

        // Check that the guess was correct
        bool guessedCorrectly = game.getHasPlayerGuessedCorrectly(player);
        assertTrue(guessedCorrectly, "Player should have already guessed correctly");

        // Player attempts another guess after guessing correctly (should fail)
        vm.prank(player);
        vm.expectRevert("Player has already guessed correctly");
        game.makeGuess("LEMON");

        // Check that the correct guess status persists
        guessedCorrectly = game.getHasPlayerGuessedCorrectly(player);
        assertTrue(guessedCorrectly, "Correct guess status should persist");
    }

    // Test new game when a new word is set
    function testNewGame() public {
        // Player makes a correct guess with the current word
        vm.prank(player);
        game.makeGuess("MANGO");
        bool guessedCorrectly = game.getHasPlayerGuessedCorrectly(player);
        assertTrue(guessedCorrectly, "Player should have already guessed correctly");

        // Admin sets a new word
        vm.prank(admin);
        game.setWord("LEMON");

        // Check that the previous player guesses and game state do not persist
        string[] memory previousGuesses = game.getPlayerGuesses(player);
        assertEq(previousGuesses.length, 0, "Previous guesses should not persist for the new word");

        guessedCorrectly = game.getHasPlayerGuessedCorrectly(player);
        assertFalse(guessedCorrectly, "Previous game state should not persist for the new word");

        // Player guesses the new word correctly
        vm.prank(player);
        game.makeGuess("LEMON");
        guessedCorrectly = game.getHasPlayerGuessedCorrectly(player);
        assertTrue(guessedCorrectly, "Player should guess the new word correctly");
    }
}
