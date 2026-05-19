import { extendTheme } from "@mui/joy/styles";
import { colors } from "./colors";

declare module "@mui/joy/styles" {
  interface Palette {
    main: typeof colors.main;
  }
}

export const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        main: colors.main,
        background: {
          body: colors.background,
        },
      },
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.neutral[700],
          border: "1px solid",
          borderRadius: "2px",
          borderColor: theme.vars.palette.neutral[600],
          transition: "0.3s",
          ":hover": {
            borderColor: "white",
          },
        }),
      },
    },
    JoyInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: "1px solid",
          borderRadius: "2px",
          borderColor: theme.vars.palette.neutral[600],
          transition: "0.3s",
          ":hover": {
            borderColor: "white",
          },
        }),
      },
    },
  },
});
