import { GameAdminPanel } from "../../../features/admin/components/GameAdminPanel";
import { GameGuessGrid } from "../../../features/game/components/GameGuessGrid";
import { GameKeyboard } from "../../../features/game/components/GameKeyboard";
import { GameStatusPanel } from "../../../features/game/components/GameStatusPanel";
import { MintButton } from "../../../features/token/components/MintButton";
import { TokenApprovalCard } from "../../../features/token/components/TokenApprovalCard";
import { WalletConnectButton } from "../../../features/wallet/components/WalletConnectButton";
import { useGamePageState } from "../hooks/useGamePageState";

export const GamePageContent = () => {
  const {
    allowance,
    balance,
    contractAddresses,
    guess,
    handleApproveTokens,
    handleMintTokens,
    handleSetWord,
    handleSubmitGuess,
    hasAllowance,
    hasBalance,
    hasPlayerGuessedCorrectly,
    hasPlayerReachedGuessLimit,
    isAdmin,
    isDisabled,
    isLoadingNewWord,
    isLoadingToken,
    isLoadingWordSubmit,
    isMinting,
    letterStatusesArray,
    playerGuessesArray,
    setGuess,
  } = useGamePageState();

  return (
    <>
      <WalletConnectButton />
      <GameStatusPanel message={contractAddresses.message} />
      <GameGuessGrid
        guess={guess}
        playerGuessesArray={playerGuessesArray}
        letterStatusesArray={letterStatusesArray}
      />
      {isAdmin && (
        <GameAdminPanel
          handleSetWord={handleSetWord}
          isLoadingNewWord={isLoadingNewWord}
          isDisabled={isDisabled}
        />
      )}
      <MintButton
        handleMintTokens={handleMintTokens}
        balance={balance}
        hasBalance={hasBalance}
        isMinting={isMinting}
        isDisabled={isDisabled}
      />
      <TokenApprovalCard
        handleApproveTokens={handleApproveTokens}
        allowance={allowance}
        hasAllowance={hasAllowance}
        isLoadingToken={isLoadingToken}
        isDisabled={isDisabled || !hasBalance}
      />
      <GameKeyboard
        guess={guess}
        setGuess={setGuess}
        handleSubmitGuess={handleSubmitGuess}
        allowance={allowance}
        hasPlayerGuessedCorrectly={hasPlayerGuessedCorrectly}
        hasPlayerReachedGuessLimit={hasPlayerReachedGuessLimit}
        playerGuessesArray={playerGuessesArray}
        letterStatusesArray={letterStatusesArray}
        isLoadingWordSubmit={isLoadingWordSubmit}
        isDisabled={isDisabled || !hasBalance || !hasAllowance}
      />
    </>
  );
};
