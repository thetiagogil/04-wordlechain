import { useCallback, useEffect, useMemo, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { WordleTokenABI } from "../abis/WordleToken.abi";
import { useChainAddress } from "../utils/chains";
import { showToast } from "../utils/toast";

export const useApproveTokens = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { address: playerAddress } = useAccount();
  const { tokenAddress, gameAddress } = useChainAddress();
  const { writeContractAsync } = useWriteContract();

  // Handle check allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    abi: WordleTokenABI,
    address: tokenAddress,
    functionName: "allowance",
    args: [playerAddress as `0x${string}`, gameAddress]
  });

  const allowance = allowanceData ? Number(formatEther(allowanceData)) : 0;
  const hasAllowance = useMemo(() => {
    return allowance ? allowance > 0 : false;
  }, [allowance]);

  // Handle approve tokens
  const handleApproveTokens = async () => {
    setIsLoading(true);
    try {
      const response = await writeContractAsync({
        abi: WordleTokenABI,
        address: tokenAddress,
        functionName: "approve",
        args: [gameAddress, BigInt(5 * 10 ** 18)]
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
