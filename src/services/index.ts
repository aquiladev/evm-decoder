// import * as bd4byte from "./4byte";
import * as bdSamczsun from "./samczsun";

export async function getSignature(sighash: string) {
  const getters = [bdSamczsun];
  let sig = await Promise.any(getters.map((x) => x.get(sighash)));
  if (sig) {
    sig = sig.startsWith("function") ? sig : `function ${sig}`;
  }
  return sig;
}
