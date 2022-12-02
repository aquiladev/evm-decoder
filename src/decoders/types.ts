import { TypedTransaction } from "@ethereumjs/tx";
import { utils } from "ethers";

export interface FragmentData {
  type: string;
  selector: string;
  signature: string;
  args: utils.Result;
  metaTx?: DecoderResult;
}

export interface TxData {
  tx: TypedTransaction;
  fragment?: DecoderResult;
}

export type DecoderResult = {
  type: string;
  input: string;
  error?: string;
  data?: TxData | FragmentData | utils.Result;
};
