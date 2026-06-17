// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract WordleToken is ERC20 {
    mapping(address => uint256) public mintedTokens;
    uint256 public constant AMOUNT_PER_MINT = 10 ether;
    uint256 public constant MAX_AMOUNT_PER_ADDRESS = 100 ether;

    // Constructor to initialize the token with a name, symbol and initial supply
    constructor() ERC20("WordleToken", "WTK") {}

    function mintTokens() external {
        require(
            mintedTokens[msg.sender] + AMOUNT_PER_MINT <= MAX_AMOUNT_PER_ADDRESS,
            "Minting exceeds max limit of 100 tokens per address"
        );

        mintedTokens[msg.sender] += AMOUNT_PER_MINT;

        _mint(msg.sender, AMOUNT_PER_MINT);
    }
}
