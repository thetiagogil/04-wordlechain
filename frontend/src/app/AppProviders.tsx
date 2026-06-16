import { CssBaseline, CssVarsProvider } from "@mui/joy";
import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { theme } from "../theme/theme";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <CssVarsProvider theme={theme} defaultMode="dark">
    <CssBaseline />
    <BrowserRouter>
      {children}
      <ToastContainer />
    </BrowserRouter>
  </CssVarsProvider>
);
