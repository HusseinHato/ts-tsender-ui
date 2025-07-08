"use client";

import { useState } from "react";
import InputField from "./ui/InputField";
import BevelButton from "./BevelButton";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { useChainId, useConfig, useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';
import { isAddress } from 'viem';

export default function AirDropForm() {
    const [tokenAddress, setTokenAddress] = useState<string>("");
    const [recipient, setRecipientAddress] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const account = useAccount();
    const chainId = useChainId();
    const config = useConfig();

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
        console.log("Current Chain ID:", chainId);
        console.log("TSender Address for this chain:", tSenderAddress);
        const approvedAmount = await getApprovedAmount(tSenderAddress)
        console.log("Approved Amount:", approvedAmount);
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
                label="Amount"
                placeholder="100,200,300,..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                large={true}
                type="text"
            />
            <BevelButton type="submit" onClick={handleSubmit}>
                Submit
            </BevelButton>
        </div>
    );
}