import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { supportedChains } from "../../../lib/contracts/chains";
import { env } from "../../../lib/env";

const rainbowkitConfig = getDefaultConfig({
  appName: "Wordlechain",
  projectId: env.PUBLIC_PROJECT_ID,
  chains: supportedChains,
});

const queryClient = new QueryClient();

type WalletProvidersProps = {
  children: ReactNode;
};

export const WalletProviders = ({ children }: WalletProvidersProps) => (
  <WagmiProvider config={rainbowkitConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
