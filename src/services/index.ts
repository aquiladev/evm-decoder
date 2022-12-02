// import * as bd4byte from "./4byte";
import { providers } from "ethers";
import { Network } from "../decoders/types";
import * as bdSamczsun from "./samczsun";

export async function getSignature(sighash: string) {
  const getters = [bdSamczsun];
  let sig = await Promise.any(getters.map((x) => x.get(sighash)));
  if (sig) {
    sig = sig.startsWith("function") ? sig : `function ${sig}`;
  }
  return sig;
}

export const NETWORKS: Array<Network> = [
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    explorer: 'https://etherscan.io',
    rpc: 'https://cloudflare-eth.com',
  },
  {
    chainId: 5,
    name: 'Goerli',
    explorer: 'https://goerli.etherscan.io',
    rpc: 'https://eth-goerli.public.blastapi.io'
  },
  {
    chainId: 137,
    name: 'Polygon Mainnet',
    explorer: 'https://polygonscan.com',
    rpc: 'https://polygon-rpc.com'
  },
  {
    chainId: 80001,
    name: 'Mumbai',
    explorer: 'https://mumbai.polygonscan.com',
    rpc: 'https://matic-mumbai.chainstacklabs.com'
  }
]

export async function getNetTx(txHash: string) {
  const requests = Object.entries(NETWORKS).map(([, network]) => {
    const provider = new providers.JsonRpcProvider(network.rpc);
    return provider.getTransaction(txHash);
  })
  return (await Promise.all(requests)).find(r => !!r)
}
