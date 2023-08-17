import { lookupTx } from "../services";

import { DecoderResult } from "./types";
import { decode as fragmentDecode } from './fragment'

export async function decode(
  source: string,
  params: Record<string, any>
): Promise<DecoderResult> {
  const result: DecoderResult = { type: "TxHash", source };
  // TODO: validate hash hex
  if (source.length === 66) {
    try {
      const tx = await lookupTx(source);
      if (!tx) {
        throw new Error('Tx not found')
      }

      result.data = {
        tx,
        fragment: tx.data === '0x' ?
          undefined :
          await fragmentDecode(tx.data, params)
      };
    } catch (err: any) {
      result.error = err?.message;
    }
    return result;
  }

  result.error = 'Tx hash has invalid format';
  return result;
}
