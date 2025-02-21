import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract } from "wagmi";
import { useState } from "react";
import { ABI } from "../abi";
import { formatEther } from "viem";

const CONTRACT_ADDRESS = "0x078d379431F6a0b375B63eFD7745C180217854b7";

const Navbar = () => {
    const { address, isConnected } = useAccount();
    const { writeContract, isPending: isClaiming } = useWriteContract();
    const [error, setError] = useState("");


    // ✅ Fetch rewards
    const { data: rewards, isLoading: isLoadingRewards, isError } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "getRewards",
        args: [address], // Pass user address if required
    });

    // ✅ Function to Claim Rewards
    const claimReward = async () => {
        setError("");


        if (!isConnected) {
            setError("Please connect your wallet first.");
            return;
        }

        try {
            await writeContract({
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: "claimRewards",
                args: [],
            });


        } catch (error) {
            console.error("Error claiming rewards:", error);
            //@ts-ignore
            setError(error.message || "Claiming rewards failed.");
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-10 py-4">
            <div className="container mx-auto px-4 md:px-32">
                <div className="bg-white/10 backdrop-blur-3xl sticky top-0 border border-white/20 shadow-xl rounded-2xl p-4 flex items-center justify-between">
                    <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text text-2xl font-bold">
                        StakeInSec
                    </h1>

                    <div className="flex items-center gap-6">
                        <a href="/" className="text-white/80 hover:text-white transition">Stake</a>
                        <a href="/unstake" className="text-white/80 hover:text-white transition">Unstake</a>

                        {/* Claim Rewards Button */}
                        {!address ? "" : <button
                            onClick={claimReward}
                            disabled={isClaiming}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 px-5 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-yellow-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isClaiming ? "Claiming..." : "Claim Rewards"}
                        </button>}

                        {/* Wallet Connection */}
                        {!isConnected ? <Connect /> : <Disconnect />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

function Connect() {
    const { connectors, connect } = useConnect();

    return (
        <div className="flex gap-2">
            {connectors.map((connector) => (
                <button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition"
                >
                    {connector.name}
                </button>
            ))}
        </div>
    );
}

function Disconnect() {
    const { disconnect } = useDisconnect();

    return (
        <button
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition"
            onClick={() => disconnect()}
        >
            Disconnect Wallet
        </button>
    );
}
