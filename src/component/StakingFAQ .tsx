

const StakingFAQ = () => {
    return (

        <div className="container  mx-auto max-w-4xl">
            <div className="bg-white/10  backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4  text-center">How Staking Works</h3>
                <ul className="space-y-4">
                    <li className="flex items-start">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm mr-3">1</span>
                        <span className="text-white/80">Connect your Ethereum wallet.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm mr-3">2</span>
                        <span className="text-white/80">Choose the amount of ETH to stake.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm mr-3">3</span>
                        <span className="text-white/80">Earn TRUMP tokens as staking rewards.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm mr-3">4</span>
                        <span className="text-white/80">Unstake anytime & claim rewards instantly.</span>
                    </li>
                </ul>
            </div>
        </div>

    );
};


export default StakingFAQ;