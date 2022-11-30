import { utils } from "ethers";
import { arrayify } from "ethers/lib/utils";
import type { Reader } from "@ethersproject/abi/lib/coders/abstract-coder";
import { StringCoder } from "@ethersproject/abi/lib/coders/string";
import { Coder } from "@ethersproject/abi/lib/coders/abstract-coder";

import { getSignature } from "../services";
import { DecoderResult } from "./types";

export class CustormStringCoder extends StringCoder {
  decode(reader: Reader): any {
    return utils.toUtf8String(
      reader.readBytes(reader.readValue().toNumber(), true),
      utils.Utf8ErrorFuncs.replace
    );
  }
}

export class CustomAbiCoder extends utils.AbiCoder {
  _getCoder(param: utils.ParamType): Coder {
    if (param.baseType === "string") {
      return new CustormStringCoder(param.name);
    }
    return super._getCoder(param);
  }
}

export async function decode(data: string, params: Record<string, any>) {
  const result: DecoderResult = { type: "Fragment", input: data };

  let iface = {} as utils.Interface;

  let fragment = {} as utils.FunctionFragment;
  try {
    const { abi } = params;
    const funcs = JSON.parse(abi || "[]");
    const sighash = data!.substring(0, 10);

    const sig = await getSignature(sighash);
    if (sig) {
      funcs.push(sig);
    }

    iface = new utils.Interface(funcs);
    fragment = iface.getFunction(sighash);
    let args: utils.Result;
    if (fragment.type === "function") {
      const abiCoder = new CustomAbiCoder();
      args = abiCoder.decode(
        fragment.inputs.map((i) => i.type),
        arrayify(data).slice(4)
      );
    } else if (fragment.type === "error") {
      args = iface.decodeErrorResult(fragment, data!);
    } else {
      throw new Error(`Unsupported fragment type ${fragment.type}`);
    }

    result.data = {
      type: fragment.type,
      selector: `${sig} - ${sighash}`,
      args,
    };
  } catch (err: any) {
    result.error = err.message;
  }

  return result;
}
