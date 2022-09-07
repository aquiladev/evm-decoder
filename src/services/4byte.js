/**
 * Ethereum Signature Database
 * https://www.4byte.directory/
 */

// /api/v1/signatures/?hex_signature=0xabcd1234
module.exports = {
  name: "4byte",
  get: async (sighash) => {
    const url = `https://www.4byte.directory/api/v1/signatures/?hex_signature=${sighash}`;
    const res = await fetch(url).then((response) => response.json());
    console.log("[4byte]", res);
    const { count, results } = res;
    if (count) {
      const sig = results[0];
      return sig?.text_signature;
    }
    return undefined;
  },
};
