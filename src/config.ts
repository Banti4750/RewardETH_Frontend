import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    metaMask(),
  ],
  transports: {
    [sepolia.id]: http(),
  }
});