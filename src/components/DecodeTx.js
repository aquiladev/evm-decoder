import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { TransactionFactory } from "@ethereumjs/tx";
import { toBuffer } from "ethereumjs-util";

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
      <Typography variant="h5" component="span">
        Decode serialized transaction
      </Typography>
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

export default DecodeTx;
