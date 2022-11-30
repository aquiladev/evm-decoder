import { TransactionFactory } from "@ethereumjs/tx";
import { toBuffer } from "ethereumjs-util";

import { DecoderResult } from "./types";

export async function decode(
  data: string,
  _: Record<string, any>
): Promise<DecoderResult> {
  const result: DecoderResult = { type: "RawTx", input: data };
  try {
    const txData = toBuffer(data);
    result.data = TransactionFactory.fromSerializedData(txData);
  } catch (err: any) {
    result.error = err?.message;
  }
  return result;
}
