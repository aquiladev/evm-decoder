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
    rpc: 'https://1rpc.io/eth',
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
    chainId: 250,
    name: 'Fantom Opera',
    explorer: 'https://ftmscan.com',
    rpc: 'https://1rpc.io/ftm'
  },
  {
    chainId: 80001,
    name: 'Mumbai',
    explorer: 'https://mumbai.polygonscan.com',
    rpc: 'https://polygon-mumbai.blockpi.network/v1/rpc/public'
  }
]

export async function lookupTx(txHash: string) {
  const requests = Object.entries(NETWORKS).map(([, network]) => {
    const provider = new providers.JsonRpcProvider(network.rpc);
    return provider.getTransaction(txHash);
  })
  return (await Promise.all(requests)).find(r => !!r)
}

export function getProvider(chainId: number) {
  const network = NETWORKS.find(n => n.chainId === chainId);
  if (!network) {
    throw new Error(`Network ${chainId} not found`);
  }
  return new providers.JsonRpcProvider(network.rpc);
}
