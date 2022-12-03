import { utils } from "ethers";

import { DecoderResult } from "./types";

const ERROR_PREFIX = "0x08c379a0";

export async function decode(
  source: string,
  _: Record<string, any>
): Promise<DecoderResult> {
  const result: DecoderResult = { type: "Error", source };
  try {
    if (source.startsWith(ERROR_PREFIX)) {
      const abiCoder = new utils.AbiCoder();
      result.data = abiCoder.decode(["string"], source.replace(ERROR_PREFIX, "0x"));
    } else {
      result.error = `There is no prefix ${ERROR_PREFIX}`;
    }
  } catch (err: any) {
    result.error = err?.message;
  }
  return result;
}
