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

function App() {
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
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Decode Ethereum serialized transaction
          </Typography>
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
      </Container>
    </div>
  );
}

export default App;
