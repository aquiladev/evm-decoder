import { TypedTransaction } from "@ethereumjs/tx";
import { providers, utils } from "ethers";

export type Network = {
  chainId: number;
  name: string;
  explorer: string;
  rpc: string
}

export interface FragmentData {
  type: string;
  selector: string;
  signature: string;
  args: utils.Result;
  metaTx?: DecoderResult;
}

export interface RawTxData {
  tx: TypedTransaction;
  fragment?: DecoderResult;
}

export interface TxData {
  tx: providers.TransactionResponse;
  fragment?: DecoderResult;
}

export type DecoderResult = {
  type: string;
  input: string;
  error?: string;
  data?: TxData
  | RawTxData
  | FragmentData
  | utils.Result;
};
