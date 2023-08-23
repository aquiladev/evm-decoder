import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import ReactGA from "react-ga4";

import { decode } from "../decoders";
import { DecoderResult } from "../decoders/types";
import Output from "./Output";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function Decoder() {
  let query = useQuery();

  const [abi, setAbi] = useState(
    '["function transferFrom(address from, address to, uint amount)"]'
  );
  const [autoLookup, setAutoLookup] = useState<boolean>(true);
  const [source, setSource] = useState<string>(query.get("source") || "");
  const [result, setResult] = useState<DecoderResult[]>();

  const handleDecode = async () => {
    ReactGA.event({
      category: "decode",
      action: "decode",
    });
    const res = await decode(source!, { abi });
    console.log("RESULT", res);
    setResult(res);
  };

  return (
    <>
      <TextField
        label="Source (raw tx, tx hash, error, calldata)"
        multiline
        rows={2}
        value={source}
        onChange={(event: any) => {
          setSource(event.target.value);
        }}
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
            onChange={(event: any) => {
              setAbi(event.target.value);
            }}
            fullWidth
            style={{ paddingBottom: 20 }}
          />
        </>
      )}
      <div>
        <FormControl>
          <Button variant="contained" onClick={handleDecode} disabled={!source}>
            Decode
          </Button>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={autoLookup}
              onChange={(event: any) => {
                setAutoLookup(event.target.checked);
              }}
            />
          }
          label="Signature auto-lookup"
          style={{ marginLeft: 20 }}
        />
      </div>
      {result && <Output results={result!} />}
      <hr style={{ margin: "20px 0" }} />
      <Box>
        <Typography variant="h6">Features:</Typography>
        <ul>
          <li>
            Decoding{" "}
            <a href="https://eips.ethereum.org/EIPS/eip-1559">EIP-1559</a> and{" "}
            <a href="https://eips.ethereum.org/EIPS/eip-2930">EIP-2930</a>{" "}
            transactions
          </li>
          <li>Decoding transaction's input</li>
          <li>
            Detecting and decoding meta-transaction in transaction's input
          </li>
          <li>
            Transaction lookup in networks: Ethereum Mainnet, Goerli, Polygon
            and Mumbai
          </li>
        </ul>
      </Box>
    </>
  );
}

export default Decoder;
