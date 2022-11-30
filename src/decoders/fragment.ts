import { utils } from "ethers";

import { getSignature } from "../services";
import { DecoderResult } from "./types";

export async function decode(data: string, params: Record<string, any>) {
  const result: DecoderResult = { type: "Fragment", input: data };
  try {
    const { abi } = params;
    const funcs = JSON.parse(abi || "[]");
    const sighash = data!.substring(0, 10);

    const sig = await getSignature(sighash);
    if (sig) {
      funcs.push(sig);
    }

    const iface = new utils.Interface(funcs);
    const fragment = iface.getFunction(sighash);
    if (fragment.type === "function") {
      result.data = {
        type: "function",
        selector: `${sig} - ${sighash}`,
        args: iface.decodeFunctionData(fragment, data!),
      };
    } else if (fragment.type === "error") {
      result.data = {
        type: "error",
        selector: `${sig} - ${sighash}`,
        args: iface.decodeErrorResult(fragment, data!),
      };
    } else {
      result.error = `Unsupported fragment type ${fragment.type}`;
    }
  } catch (err: any) {
    result.error = err.message;
  }
  return result;
}
