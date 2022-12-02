import { TransactionFactory } from "@ethereumjs/tx";
import { toBuffer } from "ethereumjs-util";

import { DecoderResult } from "./types";
import { decode as fragmentDecode } from './fragment'

export async function decode(
  data: string,
  _: Record<string, any>
): Promise<DecoderResult> {
  const result: DecoderResult = { type: "RawTx", input: data };
  try {
    const txData = toBuffer(data);
    const tx = TransactionFactory.fromSerializedData(txData);
    const _data = `0x${tx.data.toString('hex')}`;
    result.data = {
      tx,
      fragment: _data === '0x' ? undefined : await fragmentDecode(_data, {})
    };
  } catch (err: any) {
    result.error = err?.message;
  }
  return result;
}
