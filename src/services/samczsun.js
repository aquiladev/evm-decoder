/**
 * Ethereum Signature Database
 * https://sig.eth.samczsun.com/
 */

// /api/v1/signatures?all=false&function=0x9508b1c4
module.exports = {
  get: async (sighash) => {
    const url = `https://sig.eth.samczsun.com/api/v1/signatures?all=false&function=${sighash}`;
    const res = await fetch(url).then((response) => response.json());
    console.log("[samczsun]", res);
    const { ok, result } = res;
    if (ok) {
      const sig = result.function[sighash][0];
      return sig?.name;
    }
    return undefined;
  },
};
