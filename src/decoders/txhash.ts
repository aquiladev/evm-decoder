import { getNetTx } from "../services";

import { DecoderResult } from "./types";
import { decode as fragmentDecode } from './fragment'

export async function decode(
  data: string,
  _: Record<string, any>
): Promise<DecoderResult> {
  const result: DecoderResult = { type: "TxHash", input: data };
  // TODO: validate hash hex
  if (data.length === 66) {
    try {
      const tx = await getNetTx(data);
      if (!tx) {
        throw new Error('Tx not found')
      }

      result.data = {
        tx,
        fragment: tx.data === '0x' ?
          undefined :
          await fragmentDecode(tx.data, {})
      };
    } catch (err: any) {
      result.error = err?.message;
    }
    return result;
  }

  result.error = 'Tx hash has invalid format';
  return result;
}
