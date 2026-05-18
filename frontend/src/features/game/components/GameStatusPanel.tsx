import { Alert } from "@mui/joy";

type GameStatusPanelProps = {
  message?: string;
};

export const GameStatusPanel = ({ message }: GameStatusPanelProps) => {
  if (!message) {
    return null;
  }

  return (
    <Alert color="warning" variant="soft" sx={{ width: "100%" }}>
      {message}
    </Alert>
  );
};
