import { useCallback, useEffect, useMemo, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleTokenABI } from "../../../lib/contracts/wordle-token.abi";
import { useContractAddresses } from "../../../lib/contracts/useContractAddresses";
import { showToast } from "../../../lib/toast";

const TOKEN_APPROVAL_AMOUNT = 5n * 10n ** 18n;

export const useApproveTokens = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { address: playerAddress } = useAccount();
  const { tokenAddress, gameAddress, message: contractAddressMessage } = useContractAddresses();
  const { writeContractAsync } = useWriteContract();
  const canReadAllowance = Boolean(playerAddress && tokenAddress && gameAddress);

  // Handle check allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    abi: WordleTokenABI,
    address: tokenAddress,
    functionName: "allowance",
    args: playerAddress && gameAddress ? [playerAddress, gameAddress] : undefined,
    query: { enabled: canReadAllowance }
  });

  const allowance = allowanceData ? Number(formatEther(allowanceData)) : 0;
  const hasAllowance = useMemo(() => {
    return allowance ? allowance > 0 : false;
  }, [allowance]);

  // Handle approve tokens
  const handleApproveTokens = async () => {
    if (!tokenAddress || !gameAddress) {
      showToast("error", contractAddressMessage || "Contract addresses are not configured.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await writeContractAsync({
        abi: WordleTokenABI,
        address: tokenAddress,
        functionName: "approve",
        args: [gameAddress, TOKEN_APPROVAL_AMOUNT]
      });
      setHash(response);
    } catch (err: unknown) {
      showToast("error", "Failed to approve tokens. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  // Handle wait for approve contract function receipt
  const { isSuccess: hasWaitedForApprove, isError: hasWaitError } = useWaitForTransactionReceipt({ hash });

  // Handle refetch after approve contract function has waited
  const handleHasWaited = useCallback(async () => {
    if (!hash) {
      return;
    }
    if (hasWaitError) {
      showToast("error", "Failed to approve tokens. Please try again.");
      setIsLoading(false);
    }
    if (hasWaitedForApprove) {
      try {
        await refetchAllowance();
        showToast("success", "Tokens approved successfully!");
      } catch (err: unknown) {
        console.error(err);
        showToast("error", "Transaction failed while waiting for receipt.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [hasWaitError, hasWaitedForApprove, hash, refetchAllowance]);

  useEffect(() => {
    handleHasWaited();
  }, [handleHasWaited]);

  return {
    handleApproveTokens,
    refetchAllowance,
    allowance,
    hasAllowance,
    isLoading
  };
};
