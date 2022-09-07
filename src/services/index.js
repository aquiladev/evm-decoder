import * as bd4byte from "./4byte";
import * as bdSamczsun from "./samczsun";

export async function getSignature(sighash) {
  const getters = [bd4byte.get, bdSamczsun.get];
  let sig = await Promise.any(getters.map((x) => x(sighash)));
  if (sig) {
    sig = sig.startsWith("function") ? sig : `function ${sig}`;
  }
  return sig;
}
