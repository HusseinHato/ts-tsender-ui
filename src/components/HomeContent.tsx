"use client";

import AirDropForm from "./AirDropForm";
import { useAccount } from "wagmi";

export default function HomeContent() {
    const {isConnected} = useAccount();

    return (
        <div>
            {
                isConnected ?
                <AirDropForm />
                :
                <div>
                    Please Connect Wallet...
                </div>
            }
        </div>
    )
}