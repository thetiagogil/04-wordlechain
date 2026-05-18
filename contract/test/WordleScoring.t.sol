// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/libraries/WordleScoring.sol";

contract WordleScoringHarness {
	function score(
		string memory answer,
		string memory guess
	) external pure returns (uint8[5] memory) {
		return WordleScoring.score(bytes(answer), bytes(guess));
	}
}

contract WordleScoringTest is Test {
	WordleScoringHarness public scoring;

	function setUp() public {
		scoring = new WordleScoringHarness();
	}

	function testAllWrongLetters() public {
		uint8[5] memory statuses = scoring.score("MANGO", "BERRY");
		uint8[5] memory expectedStatuses = [0, 0, 0, 0, 0];

		assertStatuses(statuses, expectedStatuses);
	}

	function testAllCorrectLetters() public {
		uint8[5] memory statuses = scoring.score("MANGO", "MANGO");
		uint8[5] memory expectedStatuses = [2, 2, 2, 2, 2];

		assertStatuses(statuses, expectedStatuses);
	}

	function testAnswerDuplicateLetters() public {
		uint8[5] memory statuses = scoring.score("APPLE", "ALLEY");
		uint8[5] memory expectedStatuses = [2, 1, 0, 1, 0];

		assertStatuses(statuses, expectedStatuses);
	}

	function testGuessDuplicateLetters() public {
		uint8[5] memory statuses = scoring.score("MANGO", "MAMMA");
		uint8[5] memory expectedStatuses = [2, 2, 0, 0, 0];

		assertStatuses(statuses, expectedStatuses);
	}

	function testExactMatchConsumesBeforeMisplacedMatch() public {
		uint8[5] memory statuses = scoring.score("BANAL", "ANNAL");
		uint8[5] memory expectedStatuses = [1, 0, 2, 2, 2];

		assertStatuses(statuses, expectedStatuses);
	}

	function assertStatuses(
		uint8[5] memory statuses,
		uint8[5] memory expectedStatuses
	) internal pure {
		for (uint256 i = 0; i < 5; i++) {
			assert(statuses[i] == expectedStatuses[i]);
		}
	}
}
