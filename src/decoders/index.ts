import { utils } from "ethers";
import type {Reader} from '@ethersproject/abi/lib/coders/abstract-coder';
import {StringCoder} from '@ethersproject/abi/lib/coders/string';

import { DecoderResult } from "./types";
// import * as error from "./error";
import * as rawtx from "./rawtx";
import * as fragment from "./fragment";

StringCoder.prototype.decode = (reader: Reader) => {
  return utils.toUtf8String(
    reader.readBytes(reader.readValue().toNumber(), true),
    utils.Utf8ErrorFuncs.replace,
  );
};

export function decode(
  data: string,
  params: Record<string, any> = {}
): Promise<DecoderResult[]> {
  const decoders = [rawtx, fragment];
  return Promise.all(decoders.map((x) => x.decode(data, params)));
}
