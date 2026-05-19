import { Button, Stack } from "@mui/joy";
import { showToast } from "../../../lib/toast";
import { getColorTransparency } from "../../../shared/lib/getColorTransparency";
import { colors } from "../../../theme/colors";

type HomeMintProps = {
  handleMintTokens: () => void;
  balance: number;
  hasBalance: boolean;
  isMinting: boolean;
  isDisabled: boolean;
};

export const MintButton = ({
  handleMintTokens,
  balance,
  hasBalance,
  isMinting,
  isDisabled,
}: HomeMintProps) => {
  const handleCheckAllowance = async () => {
    showToast("info", `Your balance is: ${balance} TKN.`);
  };
  return (
    <Stack
      component="section"
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 1,
        width: "100%",
      }}
    >
      <Button
        fullWidth
        onClick={handleMintTokens}
        disabled={isDisabled || hasBalance}
        loading={isMinting}
        sx={{
          bgcolor: getColorTransparency(colors.main.purple, 70),
          "&:hover": { bgcolor: "main.purple" },
        }}
      >
        {hasBalance ? "Minted" : "Mint"}
      </Button>
      <Button
        fullWidth
        onClick={handleCheckAllowance}
        color="neutral"
        disabled={isDisabled}
      >
        Check Balance
      </Button>
    </Stack>
  );
};
