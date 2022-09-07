import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { utils } from "ethers";

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
      <Typography variant="h5" component="span">
        Decode error
      </Typography>
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
        Decode
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

export default DecodeError;
