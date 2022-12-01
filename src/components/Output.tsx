import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import { Paper } from "@mui/material";
import ReactJson from "react-json-view";

import { DecoderResult } from "../decoders/types";
import { useState } from "react";
import { BigNumber } from "ethers";

Object.defineProperties(BigNumber.prototype, {
  toJSON: {
    value: function (this: BigNumber) {
      return this.toHexString();
    },
  },
});

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const tabs: Record<
  string,
  {
    label: string;
    order: number;
    render: (
      result: DecoderResult,
      value: number,
      index: number
    ) => JSX.Element;
  }
> = {
  result: {
    label: "Result",
    order: 0,
    render: (result: DecoderResult, value: number, index: number) => {
      return (
        <TabPanel value={value} index={index}>
          <ReactJson
            src={JSON.parse(JSON.stringify(result.data))}
            name={result.type}
            style={{ overflowWrap: "anywhere" }}
          />
        </TabPanel>
      );
    },
  },
  error: {
    label: "Error",
    order: 0,
    render: (result: DecoderResult, value: number, index: number) => {
      return (
        <TabPanel value={value} index={index}>
          <Alert severity="error" style={{ overflowWrap: "anywhere" }}>
            {result.error}
          </Alert>
        </TabPanel>
      );
    },
  },
  input: {
    label: "Input",
    order: 1,
    render: (result: DecoderResult, value: number, index: number) => {
      return (
        <TabPanel
          value={value}
          index={index}
          style={{ overflowWrap: "anywhere" }}
        >
          {result.input}
        </TabPanel>
      );
    },
  },
};

function DecoderOutput(params: { result: DecoderResult; fields: string[] }) {
  const { result, fields } = params;
  const [value, setValue] = useState(0);

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
  };

  const _tabs = fields
    .filter((f) => !!tabs[f])
    .map((t) => tabs[t])
    .sort((a, b) => a.order - b.order);
  return (
    <Paper sx={{ padding: 2, marginTop: 3 }} elevation={3}>
      <Typography variant="body1">
        <b>Decoder:</b> {result.type}
      </Typography>
      <Tabs value={value} onChange={handleChange}>
        {_tabs.map((t) => {
          return <Tab label={t.label} />;
        })}
      </Tabs>
      {_tabs.map((t) => t.render(result, value, t.order))}
    </Paper>
  );
}

function Output({ data }: { data: DecoderResult[] }) {
  const okResults = data.filter((r) => !r.error);
  return (
    <Box sx={{ width: "100%" }}>
      {okResults?.length
        ? okResults.map((r) => (
            <DecoderOutput result={r} fields={["result", "input"]} />
          ))
        : data.map((r) => (
            <DecoderOutput result={r} fields={["error", "input"]} />
          ))}
    </Box>
  );
}

export default Output;
