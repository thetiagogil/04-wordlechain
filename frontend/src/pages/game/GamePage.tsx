import { WalletProviders } from "../../features/wallet/components/WalletProviders";
import { MainContainer } from "../../shared/components/MainContainer";
import { GamePageContent } from "./_components/GamePageContent";

export const GamePage = () => (
  <WalletProviders>
    <MainContainer>
      <GamePageContent />
    </MainContainer>
  </WalletProviders>
);
