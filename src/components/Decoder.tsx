import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import { decode } from "../decoders";
import { DecoderResult } from "../decoders/types";
import Output from "./Output";

function Decoder() {
  const [abi, setAbi] = useState(
    '["function transferFrom(address from, address to, uint amount)"]'
  );
  const [autoLookup, setAutoLookup] = useState<boolean>(true);
  const [data, setData] = useState<string>();
  const [result, setResult] = useState<DecoderResult[]>();

  const handleChangeData = (event: any) => {
    setData(event.target.value);
  };

  const handleChangeABI = (event: any) => {
    setAbi(event.target.value);
  };

  const handleAutoLookup = (event: any) => {
    setAutoLookup(event.target.checked);
  };

  const handleDecodeData = async () => {
    const res = await decode(data!, { abi });
    console.log("RESULT", res);
    setResult(res);
  };

  return (
    <>
      <TextField
        label="Data (raw tx, tx hash, error, calldata)"
        multiline
        rows={3}
        value={data}
        onChange={handleChangeData}
        fullWidth
        style={{ paddingBottom: 20 }}
      />
      {!autoLookup && (
        <>
          <div style={{ float: "right" }}>
            Inrerface{" "}
            <a href="https://docs.ethers.io/v5/api/utils/abi/interface/#Interface--creating">
              exemple
            </a>
          </div>
          <TextField
            label="Interface"
            multiline
            rows={2}
            // value={abi}
            defaultValue={abi}
            onChange={handleChangeABI}
            fullWidth
            style={{ paddingBottom: 20 }}
          />
        </>
      )}
      <div>
        <FormControl>
          <Button
            variant="contained"
            onClick={handleDecodeData}
            disabled={!data}
          >
            Decode
          </Button>
        </FormControl>
        <FormControlLabel
          control={<Switch checked={autoLookup} onChange={handleAutoLookup} />}
          label="Signature auto-lookup"
          style={{ marginLeft: 20 }}
        />
      </div>
      {result && <Output results={result!} />}
      <Box style={{ marginTop: 20 }}>
        <Typography variant="h6">Features:</Typography>
        <p>
          # The dApp supports{" "}
          <a href="https://eips.ethereum.org/EIPS/eip-1559">EIP-1559</a> and{" "}
          <a href="https://eips.ethereum.org/EIPS/eip-2930">EIP-2930</a>{" "}
          transactions
        </p>
      </Box>
    </>
  );
}

export default Decoder;
