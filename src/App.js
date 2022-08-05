import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import Box from "@mui/material/Box";
import { TransactionFactory } from "@ethereumjs/tx";
import { toBuffer } from "ethereumjs-util";
import { utils } from "ethers";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link as RLink,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <div style={{ flex: "auto" }}>
              <RLink to="/" style={{ color: "white", textDecoration: "none" }}>
                <Typography variant="h5" component="span">
                  Decode Ethereum serialized transaction
                </Typography>
              </RLink>
              <RLink
                to="/error-decode"
                style={{
                  color: "white",
                  textDecoration: "none",
                  marginLeft: 20,
                }}
              >
                <Typography variant="h6" component="span">
                  Decode error
                </Typography>
              </RLink>
              <RLink
                to="/function-decode"
                style={{
                  color: "white",
                  textDecoration: "none",
                  marginLeft: 20,
                }}
              >
                <Typography variant="h6" component="span">
                  Decode function
                </Typography>
              </RLink>
            </div>
            <Link
              href="//github.com/aquiladev/decode-eth-tx"
              target="_blank"
              rel="noopener"
            >
              <IconButton
                color="default"
                aria-label="GitHub repo"
                component="span"
              >
                <GitHubIcon fontSize="default" style={{ color: "white" }} />
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>
        <Container style={{ marginTop: 20 }}>
          <Switch>
            <Route exact path="/">
              <DecodeTx />
            </Route>
            <Route path="/error-decode">
              <DecodeError />
            </Route>
            <Route exect path="/function-decode">
              <DecodeFunction />
            </Route>
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

function DecodeTx() {
  const [error, setError] = useState();
  const [txn, setTxn] = useState();
  const [text, setText] = useState();

  const handleChange = (event) => {
    setError();
    setTxn();
    setText(event.target.value);
  };

  const handleDecode = () => {
    try {
      if (!text) return;
      const txData = toBuffer(text);
      const f = TransactionFactory.fromSerializedData(txData);
      setTxn(JSON.stringify(f.toJSON(), null, 2));
    } catch (err) {
      setError(err?.message);
    }
  };

  return (
    <>
      <TextField
        label="Raw Txn"
        multiline
        rows={4}
        value={text}
        onChange={handleChange}
        fullWidth
        style={{ paddingBottom: 20 }}
      />
      <Button variant="contained" onClick={handleDecode} disabled={!text}>
        Decode
      </Button>
      {txn && (
        <div
          style={{
            overflowY: "scroll",
            border: "1px dashed grey",
            padding: "0 13px",
            marginTop: 20,
          }}
        >
          <pre>{txn}</pre>
        </div>
      )}
      {error && (
        <Alert severity="error" style={{ marginTop: 20 }}>
          {error}
        </Alert>
      )}
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

function DecodeError() {
  const [errorMsg, setErrorMsg] = useState();
  const [errorText, setErrorText] = useState();

  const handleChangeError = (event) => {
    setErrorText();
    setErrorMsg(event.target.value);
  };

  const handleDecodeError = () => {
    if (errorMsg.startsWith("0x08c379a0")) {
      const abiCoder = new utils.AbiCoder();
      setErrorText(
        abiCoder.decode(["string"], errorMsg.replace("0x08c379a0", "0x"))
      );
    } else {
      setErrorText("== NOT POSSIBLE TO DECODE ==");
    }
  };

  return (
    <>
      <TextField
        label="Error"
        multiline
        rows={4}
        value={errorMsg}
        onChange={handleChangeError}
        fullWidth
        style={{ paddingBottom: 20 }}
      />
      <Button
        variant="contained"
        onClick={handleDecodeError}
        disabled={!errorMsg}
      >
        Decode Error
      </Button>
      {errorText && (
        <div
          style={{
            overflowY: "scroll",
            border: "1px dashed grey",
            padding: "0 13px",
            marginTop: 20,
          }}
        >
          <pre>{errorText}</pre>
        </div>
      )}
    </>
  );
}

function DecodeFunction() {
  const [abi, setAbi] = useState(
    '["function transferFrom(address from, address to, uint amount)"]'
  );
  const [data, setData] = useState();
  const [result, setResult] = useState();

  const handleChangeABI = (event) => {
    setResult();
    setAbi(event.target.value);
  };

  const handleChangeData = (event) => {
    setResult();
    setData(event.target.value);
  };

  const handleDecodeData = () => {
    try {
      const iface = new utils.Interface(JSON.parse(abi));
      const selector = data.substring(0, 10);

      const fragment = iface.getFunction(selector);
      const _res = iface.decodeFunctionData(fragment, data);
      setResult(JSON.stringify(_res, null, 2));
    } catch (err) {
      setResult("ERROR: " + err.message);
    }
  };

  return (
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
        rows={4}
        value={abi}
        defaultValue={abi}
        onChange={handleChangeABI}
        fullWidth
        style={{ paddingBottom: 20 }}
      />
      <TextField
        label="Data"
        multiline
        rows={4}
        value={data}
        onChange={handleChangeData}
        fullWidth
        style={{ paddingBottom: 20 }}
      />
      <Button variant="contained" onClick={handleDecodeData} disabled={!data}>
        Decode Function
      </Button>
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

export default App;
