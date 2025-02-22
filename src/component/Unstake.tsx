import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { ABI } from '../abi';

const CONTRACT_ADDRESS = "0x078d379431F6a0b375B63eFD7745C180217854b7";

const Unstake = () => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string>('');
    const { address, isConnected } = useAccount();
    const { writeContract, isPending: isUnstaking } = useWriteContract();

    // Get user's staked balance
    const { data: stakedBalance, isLoading: isStakedLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "balanceOf", // Replace with correct contract function if needed
        args: [address],
        //@ts-ignore
        watch: true,
    });

    // Handle unstake
    const handleUnstake = async () => {
        setError('');

        if (!isConnected) {
            setError("Please connect your wallet first.");
            return;
        }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError("Invalid amount.");
            return;
        }
        //@ts-ignore
        if (Number(amount) > Number(formatEther(stakedBalance || 0))) {
            setError("Insufficient staked balance.");
            return;
        }

        try {
            const amountInWei = parseEther(amount);

            await writeContract({
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: "unstake",
                args: [amountInWei], // Unstaking amount
                //@ts-ignore
                watch: true,
            });


        } catch (e) {
            console.error("Error unstaking:", e);
            //@ts-ignore
            setError(e?.message || "Unstaking failed.");
        }
    };

    return (
        <div className="mt-40 max-w-md mx-auto bg-white/5 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 text-transparent bg-clip-text">Unstake ETH</h2>

            {/* Staked Balance */}
            <div className="mb-6 text-white/80">
                <p>Staked: {isStakedLoading ? "Loading..." : `${
                    //@ts-ignore
                    formatEther(stakedBalance || 0)} ETH`}</p>
            </div>

            {/* Unstaking Form */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="number"
                        placeholder="Amount to unstake"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring focus:ring-red-500/30 outline-none text-white"
                        step="0.01"
                        min="0"
                    />
                    <button
                        onClick={() => stakedBalance &&
                            //@ts-ignore
                            setAmount(formatEther(stakedBalance))}
                        disabled={!stakedBalance}
                        className="bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition text-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        MAX
                    </button>
                </div>

                {/* Error Message */}
                {error && <div className="mb-4 text-red-400">{error}</div>}

                {/* Unstake Button */}
                <button
                    onClick={handleUnstake}
                    disabled={isUnstaking || !amount || isNaN(Number(amount)) || Number(amount) <= 0}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-red-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUnstaking ? 'Unstaking...' : 'Unstake ETH'}
                </button>


            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 p-3 rounded-lg">
                    <h3 className="font-medium text-white mb-1">No Lock Period</h3>
                    <p className="text-white/70">Unstake Anytime</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                    <h3 className="font-medium text-white mb-1">3.6 TRUMP </h3>
                    <p className="text-white/70">per hour per ETH</p>
                </div>
            </div>
        </div>
    );
};

export default Unstake;
