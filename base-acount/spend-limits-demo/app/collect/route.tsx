import { NextRequest, NextResponse } from "next/server";
import { getPublicClient, getSpenderWalletClient } from "../../lib/spender";
import { getSpenderBundlerClient } from "../../lib/smartSpender";
import {
  spendPermissionManagerAbi,
  spendPermissionManagerAddress,
} from "../../lib/abi/SpendPermissionManager";

export async function POST(request: NextRequest) {
  const spenderBundlerClient = await getSpenderWalletClient();
  const publicClient = await getPublicClient();
  try {
    const body = await request.json();
    const { spendPermission, signature } = body;

    // transact with EOA or Smart Wallet, make sure to update NEXT_PUBLIC_SPENDER_ADDRESS variable in accordance with choice
    const { success, transactionHash } = await transactSmartWallet(
      spendPermission,
      signature
    );
    // const { success, transactionHash } = await transactEOA(
    //   spendPermission,
    //   signature
    // );

    return NextResponse.json({
      status: success ? "success" : "failure",
      transactionHash: transactionHash,
      transactionUrl: `https://sepolia.basescan.org/tx/${transactionHash}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

async function transactEOA(spendPermission: any, signature: any) {
  const spenderBundlerClient = await getSpenderWalletClient();
  const publicClient = await getPublicClient();

  const approvalTxnHash = await spenderBundlerClient.writeContract({
    address: spendPermissionManagerAddress,
    abi: spendPermissionManagerAbi,
    functionName: "approveWithSignature",
    args: [spendPermission, signature],
  });

  const approvalReceipt = await publicClient.waitForTransactionReceipt({
    hash: approvalTxnHash,
  });

  const spendTxnHash = await spenderBundlerClient.writeContract({
    address: spendPermissionManagerAddress,
    abi: spendPermissionManagerAbi,
    functionName: "spend",
    args: [spendPermission, "1"],
  });

  const spendReceipt = await publicClient.waitForTransactionReceipt({
    hash: spendTxnHash,
  });

  return {
    success: spendReceipt.status == "success",
    transactionHash: spendReceipt.transactionHash,
  };
}

async function transactSmartWallet(spendPermission: any, signature: any) {
  const spenderBundlerClient = await getSpenderBundlerClient();
  const userOpHash = await spenderBundlerClient.sendUserOperation({
    calls: [
      {
        abi: spendPermissionManagerAbi,
        functionName: "approveWithSignature",
        to: spendPermissionManagerAddress,
        args: [spendPermission, signature],
      },
      {
        abi: spendPermissionManagerAbi,
        functionName: "spend",
        to: spendPermissionManagerAddress,
        args: [spendPermission, BigInt(1)], // spend 1 wei
      },
    ],
  });

  const userOpReceipt = await spenderBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  return {
    success: userOpReceipt.success,
    transactionHash: userOpReceipt.receipt.transactionHash,
  };
}
