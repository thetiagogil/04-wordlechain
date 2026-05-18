import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { WagmiProvider } from "wagmi";
import { env } from "../lib/env";
import { supportedChains } from "../lib/contracts/chains";
import { theme } from "../theme/theme";

const rainbowkitConfig = getDefaultConfig({
  appName: "Wordlechain",
  projectId: env.PUBLIC_PROJECT_ID,
  chains: supportedChains
});

const queryClient = new QueryClient();

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <WagmiProvider config={rainbowkitConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <CssVarsProvider theme={theme} defaultMode="dark">
          <CssBaseline />
          <BrowserRouter>
            {children}
            <ToastContainer />
          </BrowserRouter>
        </CssVarsProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
