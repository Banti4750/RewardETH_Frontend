import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./config";

// Components
import Navbar from "./component/Navbar";
import Unstake from "./component/Unstake";

import Hero from "./component/Hero";

const queryClient = new QueryClient();

function App() {
    return (
        <Router>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <div className="h-screen w-full bg-gradient-to-b from-black via-indigo-950 to-orange-950 overflow-hidden relative">
                        {/* Background Elements */}
                        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-yellow-600 rounded-full mix-blend-screen filter blur-3xl opacity-15" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-amber-500 to-red-600 rounded-full blur-xl opacity-40 sun-orb" />

                        {/* Atmospheric Particles */}
                        <div className="absolute inset-0 opacity-70 atmospheric-particles"
                            style={{
                                backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
                                backgroundSize: "30px 30px"
                            }}
                        />

                        {/* Soft Accent Clouds */}
                        <div className="absolute top-40 left-20 w-96 h-20 bg-pink-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: "8s" }} />
                        <div className="absolute top-60 right-40 w-80 h-16 bg-purple-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: "12s" }} />

                        {/* Sunbeam Effect */}
                        <div className="sunbeam">
                            <div className="sunbeam-effect"></div>
                        </div>

                        {/* Navigation Bar */}
                        <Navbar />

                        {/* Hero Section (Only on Home Page) */}
                        <Routes>
                            {/* <Route path="/" element={} /> */}
                            <Route path="/" element={<Hero />} />
                            <Route path="/unstake" element={<Unstake />} />
                        </Routes>
                    </div>
                </QueryClientProvider>
            </WagmiProvider>
        </Router>
    );
}

export default App;
