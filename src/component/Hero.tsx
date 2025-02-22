import { useState, useEffect } from "react";
import { useAccount, useBalance, useWriteContract, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ABI } from "../abi";
import { FaEthereum, FaCoins, FaChartLine, FaClock } from "react-icons/fa";
import StakingFAQ from "./StakingFAQ ";

const CONTRACT_ADDRESS = "0x078d379431F6a0b375B63eFD7745C180217854b7";

const StakingSection = () => {
    const { address, isConnected } = useAccount();
    const [stakeAmount, setStakeAmount] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [estimatedRewards, setEstimatedRewards] = useState(null);

    const { data: balanceData } = useBalance({
        address,
    });

    const { data: stakedAmount } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "balanceOf",
        args: [address],
        //@ts-ignore
        enabled: isConnected && !!address,
        watch: true,
    });

    const { data: pendingRewards } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "getRewards",
        args: [address],
        //@ts-ignore
        enabled: isConnected && !!address,
        watch: true,
    });

    const { writeContract, isPending: isStaking } = useWriteContract();

    // Update estimated rewards when stake amount changes
    useEffect(() => {
        calculateRewards();
    }, [stakeAmount]);

    // Calculate estimated rewards
    const calculateRewards = () => {
        if (!stakeAmount || isNaN(Number(stakeAmount)) || Number(stakeAmount) <= 0) {
            setEstimatedRewards(null);
            return;
        }

        // 0.001 TRUMP tokens per second per ETH staked
        const rewardRate = 0.001;
        const ethAmount = Number(stakeAmount);

        // Calculate rewards for different time periods
        const hourlyRewards = ethAmount * rewardRate * 3600; // 3600 seconds in an hour
        const dailyRewards = hourlyRewards * 24;
        const weeklyRewards = dailyRewards * 7;
        const monthlyRewards = dailyRewards * 30;

        setEstimatedRewards({
            //@ts-ignore
            hourly: hourlyRewards.toFixed(3),
            daily: dailyRewards.toFixed(3),
            weekly: weeklyRewards.toFixed(3),
            monthly: monthlyRewards.toFixed(3)
        });
    };

    // Handle staking
    const handleStake = async () => {
        setError("");
        setSuccess("");

        if (!isConnected) {
            setError("Please connect your wallet first");
            return;
        }

        if (!stakeAmount || isNaN(Number(stakeAmount)) || Number(stakeAmount) <= 0) {
            setError("Please enter a valid amount to stake");
            return;
        }

        try {
            await writeContract({
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: "stake",
                value: parseEther(stakeAmount),
            });

            setSuccess(`Successfully staked ${stakeAmount} ETH!`);
            setStakeAmount("");
        } catch (err) {
            console.error("Staking error:", err);
            //@ts-ignore
            setError(err.message || "Failed to stake ETH. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen mt-8">
            <div className="container mx-auto">
                <div className="max-w-4xl mx-auto">
                    {/* <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                        Start Earning TRUMP Tokens
                    </h2> */}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Staking Form - Takes 3 columns */}
                        <div className="lg:col-span-3 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center">
                                <FaEthereum className="mr-2 text-purple-500" />
                                Stake Your ETH
                            </h3>

                            <div className="space-y-6">
                                {balanceData && (
                                    <div className="flex justify-between items-center text-white/80 text-sm">
                                        <span>Your Balance:</span>
                                        <span className="font-medium">{formatEther(balanceData.value)} ETH</span>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="stakeAmount" className="block mb-2 text-white/80 text-sm">
                                        Amount to Stake (ETH)
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="stakeAmount"
                                            type="number"
                                            placeholder="0.0"
                                            value={stakeAmount}
                                            onChange={(e) => {
                                                setStakeAmount(e.target.value);
                                                setError("");
                                            }}
                                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        {balanceData && (
                                            <button
                                                onClick={() => {
                                                    const maxAmount = Number(formatEther(balanceData.value)) - 0.01;
                                                    if (maxAmount > 0) {
                                                        setStakeAmount(maxAmount.toString());
                                                    }
                                                }}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-purple-400 hover:text-purple-300"
                                            >
                                                MAX
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm">
                                        {success}
                                    </div>
                                )}

                                <button
                                    onClick={handleStake}
                                    disabled={isStaking || !stakeAmount}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isStaking ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Staking...
                                        </>
                                    ) : "Stake ETH"}
                                </button>
                            </div>

                            {/* Current Staking Status */}
                            {isConnected && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <h4 className="text-lg font-medium mb-4 flex items-center">
                                        <FaChartLine className="mr-2 text-blue-400" />
                                        Your Staking Status
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-white/60 text-xs mb-1">Currently Staked</p>
                                            <p className="text-xl font-medium">

                                                {stakedAmount ?
                                                    //@ts-ignore
                                                    formatEther(stakedAmount) : "0"} ETH
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-white/60 text-xs mb-1">Pending Rewards</p>
                                            <p className="text-xl font-medium text-yellow-400">
                                                {pendingRewards ?
                                                    //@ts-ignore
                                                    formatEther(pendingRewards) : "0"} TRUMP
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Rewards Preview - Takes 2 columns */}
                        <div className="lg:col-span-2 space-y-6">
                            {estimatedRewards && (
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                                    <h3 className="text-xl font-bold mb-6 flex items-center">
                                        <FaCoins className="mr-2 text-yellow-500" />
                                        Estimated Rewards
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Hourly:</span>
                                            <span className="text-lg font-medium text-yellow-400">{
                                                //@ts-ignore
                                                estimatedRewards.hourly} TRUMP</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Daily:</span>
                                            <span className="text-lg font-medium text-yellow-400">{
                                                //@ts-ignore
                                                estimatedRewards.daily} TRUMP</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Weekly:</span>
                                            <span className="text-lg font-medium text-yellow-400">{
                                                //@ts-ignore
                                                estimatedRewards.weekly} TRUMP</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                            <span className="text-white/70">Monthly:</span>
                                            <span className="text-xl font-medium text-yellow-400">{
                                                //@ts-ignore
                                                estimatedRewards.monthly} TRUMP</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <FaClock className="mr-2 text-green-500" />
                                    Real-time Rewards
                                </h3>
                                <p className="text-white/80 mb-4 text-sm">
                                    Earn <span className="text-yellow-400 font-bold">0.001 TRUMP</span> tokens per second for every ETH staked.
                                </p>
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10 mt-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/70">Reward Rate:</span>
                                        <span className="font-medium text-green-400">
                                            3.6 TRUMP per hour per ETH
                                        </span>
                                    </div>
                                </div>

                            </div>
                            {estimatedRewards ? "" : <StakingFAQ />}

                        </div>
                    </div>
                </div>
            </div>
        // </div>
    );
};

export default StakingSection;