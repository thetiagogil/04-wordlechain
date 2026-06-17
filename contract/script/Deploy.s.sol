// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";

import "../contracts/WordleToken.sol";
import "../contracts/WordleGame.sol";

contract Deploy is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the WordleToken contract
        WordleToken token = new WordleToken();
        console.log("Wordle Token deployed at:", address(token));

        // Deploy the WordleGame contract
        WordleGame game = new WordleGame(address(token));
        console.log("Wordle Game deployed at:", address(game));

        // Set an initial word
        string memory firstWord = "MANGO";
        game.setWord(firstWord);
        console.log("Initial word set to:", firstWord);

        // Stop broadcasting transactions
        vm.stopBroadcast();
    }
}
