import { Button, Stack } from "@mui/joy";
import { showToast } from "../../../lib/toast";
import { getColorTransparency } from "../../../shared/lib/getColorTransparency";
import { colors } from "../../../theme/colors";

type TokenApprovalCardProps = {
  handleApproveTokens: () => void;
  allowance: number;
  hasAllowance: boolean;
  isLoadingToken: boolean;
  isDisabled: boolean;
};

export const TokenApprovalCard = ({
  handleApproveTokens,
  allowance,
  hasAllowance,
  isLoadingToken,
  isDisabled,
}: TokenApprovalCardProps) => {
  const handleCheckAllowance = async () => {
    showToast("info", `Your allowance is: ${allowance} TKN.`);
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
        onClick={handleApproveTokens}
        disabled={isDisabled || hasAllowance}
        loading={isLoadingToken}
        sx={{
          bgcolor: getColorTransparency(colors.main.green, 70),
          "&:hover": { bgcolor: "main.green" },
        }}
      >
        {hasAllowance ? "Approved" : "Approve Tokens"}
      </Button>
      <Button
        fullWidth
        onClick={handleCheckAllowance}
        color="neutral"
        disabled={isDisabled}
      >
        Check Allowance
      </Button>
    </Stack>
  );
};
