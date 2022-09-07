import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { utils } from "ethers";

import { getSignature } from "./../services";

function DecodeFunction() {
  const [abi, setAbi] = useState(
    '["function transferFrom(address from, address to, uint amount)"]'
  );
  const [info, setInfo] = useState();
  const [data, setData] = useState();
  const [result, setResult] = useState();
  const [autoLookup, setAutoLookup] = React.useState(true);

  const handleChangeABI = (event) => {
    setResult();
    setAbi(event.target.value);
  };

  const handleChangeData = (event) => {
    setResult();
    setData(event.target.value);
  };

  const handleAutoLookup = (event) => {
    setAutoLookup(event.target.checked);
  };

  const handleDecodeData = async () => {
    setInfo();
    try {
      const funcs = JSON.parse(abi || "[]");
      const sighash = data.substring(0, 10);

      const sig = await getSignature(sighash);
      console.log("RESULT", sig);
      if (sig) {
        setInfo(`Function signature found automatically [${sighash} - ${sig}]`);
        funcs.push(sig);
      }

      const iface = new utils.Interface(funcs);
      const fragment = iface.getFunction(sighash);
      const _res = iface.decodeFunctionData(fragment, data);
      setResult(JSON.stringify(_res, null, 2));
    } catch (err) {
      setResult("ERROR: " + err.message);
    }
  };

  return (
    <>
      <Typography variant="h5" component="span">
        Decode function
      </Typography>
      <TextField
        label="Data"
        multiline
        rows={4}
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
            value={abi}
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
      {info && (
        <Alert severity="info" style={{ marginTop: 20 }}>
          {info}
        </Alert>
      )}
      {result && (
        <div
          style={{
            overflowY: "scroll",
            border: "1px dashed grey",
            padding: "0 13px",
            marginTop: 20,
          }}
        >
          <pre>{result}</pre>
        </div>
      )}
    </>
  );
}

export default DecodeFunction;
