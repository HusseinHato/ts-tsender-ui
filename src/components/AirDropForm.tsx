"use client";

import { useState, useMemo, useEffect } from "react";
import InputField from "./ui/InputField";
import BevelButton from "./BevelButton";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract, useReadContracts  } from 'wagmi';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { isAddress } from 'viem';
import { calculateTotal, calculateTotalWei } from "@/utils";
import { LoaderCircle } from 'lucide-react';

export default function AirDropForm() {
    const [tokenAddress, setTokenAddress] = useState<string>("");
    const [recipient, setRecipientAddress] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const account = useAccount();
    const chainId = useChainId();
    const config = useConfig();
    const total: number = useMemo(() => calculateTotal(amount), [amount]);
    const {data: hash, isPending, writeContractAsync } = useWriteContract();
    
    const { data:tokenDetails, isLoading } = useReadContracts({
            contracts: [
                {
                    address: tokenAddress as `0x${string}`,
                    abi: erc20Abi,
                    functionName: 'name',
                },
                {
                    address: tokenAddress as `0x${string}`,
                    abi: erc20Abi,
                    functionName: 'decimals'
                }
                
            ],
            query: {enabled: isAddress(tokenAddress)}
        })

    const tokenName = tokenDetails?.[0].result as string;
    const tokenDecimals = tokenDetails?.[1].result as number;
    const formattedTotalAmount = calculateTotalWei(total, tokenDecimals)
    
    
    useEffect(() => {
        const savedTokenAddress = localStorage.getItem("tokenAddress")
        if (savedTokenAddress) setTokenAddress(savedTokenAddress)

        const savedRecipient = localStorage.getItem("recipient")
        if (savedRecipient) setRecipientAddress(savedRecipient)

        const savedAmount = localStorage.getItem("amount")
        if (savedAmount) setAmount(savedAmount)
    }, [])

    useEffect(() => {
        localStorage.setItem("tokenAddress", tokenAddress)
    }, [tokenAddress])

    useEffect(() => {
        if (recipient) {
            localStorage.setItem("recipient", recipient)
        }
    }, [recipient])

    useEffect(() => {
        if (amount) {
            localStorage.setItem("amount", amount)
        }
    }, [amount])

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("No address found,Please use a supported chain")
            return 0
        }
        if (!tokenAddress || !isAddress(tokenAddress)) {
            alert("Please enter a valid token address.");
            return 0;
        }
        if (!account.address || !isAddress(account.address)) {
            alert("No valid wallet/account address found.");
            return 0;
        }

        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: 'allowance',
            args: [account.address, tSenderAddress as `0x${string}`]
        })

        return response as number
    }

    async function handleSubmit() {
        const tSenderAddress = chainsToTSender[chainId]?.tsender;
        const approvedAmount = await getApprovedAmount(tSenderAddress)

        if (approvedAmount < total) {
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)]
            })

            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash
            })

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: 'airdropERC20',
                args: [
                    tokenAddress,
                    recipient.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amount.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ]
            })

            // console.log("Approval Confirmed", approvalReceipt)
        } else {
            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: 'airdropERC20',
                args: [
                    tokenAddress,
                    recipient.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amount.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ]
            })
        }


    }

    return (
        <div className="p-4 space-y-4">
            <InputField 
                label="Token Address"
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                type="text"
            />
            <InputField 
                label="Recipient Address"
                placeholder="0x...,0x...,0x...,..."
                value={recipient}
                onChange={(e) => setRecipientAddress(e.target.value)}
                large={true}
                type="text"
            />
            <InputField 
                label="Amount (wei)"
                placeholder="100,200,300,..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                large={true}
                type="text"
            />
            <div className="flex flex-col">
                <strong>Token Name: {tokenName}</strong>
                <strong>Amount (wei): {total}</strong>
                <strong>Amount (token): {formattedTotalAmount}</strong>
            </div>
            <BevelButton type="submit" onClick={handleSubmit} disabled={isPending}>
                {isPending ? 
                    <p className="flex gap-2">
                        Pending <LoaderCircle className="animate-spin"/>
                    </p> : 
                    <p>
                        Submit
                    </p>
                }
            </BevelButton>
        </div>
    );
}