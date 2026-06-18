import { Box, CircularProgress, Typography } from "@mui/joy";

export const RouteLoadingFallback = () => {
  return (
    <Box
      aria-live="polite"
      role="status"
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress size="sm" />
      <Typography level="body-sm" textColor="text.tertiary">
        Loading game...
      </Typography>
    </Box>
  );
};
