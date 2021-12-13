import React, { useState } from "react";
import { TransactionFactory } from "@ethereumjs/tx";
import { toBuffer } from "ethereumjs-util";

import "./App.css";

function App() {
  const [error, setError] = useState();
  const [tx, setTx] = useState();

  const handleChange = (event) => {
    const data = event.target.value;
    setError();
    setTx();
    try {
      if (!data) return;
      const txData = toBuffer(data);
      const f = TransactionFactory.fromSerializedData(txData);
      setTx(JSON.stringify(f.toJSON(), null, 2));
    } catch (err) {
      setError(err?.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">Decode raw tx</header>
      <textarea onChange={handleChange}>{tx}</textarea>
      <div>{tx && <pre>{tx}</pre>}</div>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default App;
