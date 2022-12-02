import { DecoderResult } from "./types";
// import * as error from "./error";
import * as rawtx from "./rawtx";
import * as fragment from "./fragment";
import * as txhash from "./txhash";

export function decode(
  data: string,
  params: Record<string, any> = {}
): Promise<DecoderResult[]> {
  const decoders = [fragment, rawtx, txhash];
  return Promise.all(decoders.map((x) => x.decode(data, params)));
}
