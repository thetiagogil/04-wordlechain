// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/WordleToken.sol";

contract WordleTokenTest is Test {
    WordleToken public token;
    address public owner;
    address public spender;

    // Function to setup the tests
    function setUp() public {
        token = new WordleToken();
        owner = address(this);
        spender = address(0x123);
    }

    // Test minting tokens
    function testMintTokens() public {
        // Mint once and check balance
        vm.prank(owner);
        token.mintTokens();

        uint256 balance = token.balanceOf(owner);
        assertEq(balance, 10 ether, "Owner should have 10 tokens after minting");

        // Mint until max and check balance
        for (uint256 i = 1; i < 10; i++) {
            vm.prank(owner);
            token.mintTokens();
        }

        uint256 maxBalance = token.balanceOf(owner);
        assertEq(maxBalance, 100 ether, "Owner should have 100 tokens after minting max");

        // Attempt to mint beyond the limit (should fail)
        vm.prank(owner);
        vm.expectRevert("Minting exceeds max limit of 100 tokens per address");
        token.mintTokens();
    }

    // Test the approve and allowance functionality of the WordleToken contract
    function testApproveAndAllowanceFunctions() public {
        // Simulate transactions from the spender address
        vm.prank(spender);

        // Approve the owner to spend tokens
        bool success = token.approve(owner, 10 ether);

        // Assert that the approval was successful
        assertTrue(success, "Approval should succeed");

        // Check the allowance for the owner (set by the spender)
        uint256 allowance = token.allowance(spender, owner);

        // Assert that the allowance matches the approved amount
        assertEq(allowance, 10 ether, "Allowance should match approved amount");
    }
}
