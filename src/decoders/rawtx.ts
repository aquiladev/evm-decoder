import { TransactionFactory } from "@ethereumjs/tx";
import { toBuffer } from "ethereumjs-util";

import { DecoderResult } from "./types";
import { decode as fragmentDecode } from './fragment'

export async function decode(
  source: string,
  params: Record<string, any>
): Promise<DecoderResult> {
  const result: DecoderResult = { type: "RawTx", source };
  try {
    const sourceBuffer = toBuffer(source);
    const tx = TransactionFactory.fromSerializedData(sourceBuffer);
    const txData = `0x${tx.data.toString('hex')}`;
    result.data = {
      tx,
      fragment: txData === '0x' ? undefined : await fragmentDecode(txData, params)
    };
  } catch (err: any) {
    result.error = err?.message;
  }
  return result;
}
