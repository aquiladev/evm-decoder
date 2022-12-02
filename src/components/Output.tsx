import { useState } from "react";
import { BigNumber } from "ethers";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import { Paper } from "@mui/material";
import ReactJson from "react-json-view";

import { NETWORKS } from "../services";

import {
  DecoderResult,
  FragmentData,
  RawTxData,
  TxData,
} from "../decoders/types";

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
    render: (result: DecoderResult) => JSX.Element;
  }
> = {
  tx: {
    label: "Tx",
    order: 0,
    render: (result: DecoderResult) => {
      const { tx } = result.data as TxData;
      const network = NETWORKS.find((n) => n.chainId === tx.chainId);
      return (
        <>
          <Typography variant="body1" style={{ padding: "0 0 6px 0" }}>
            <b>Network:</b> {network?.name}
          </Typography>
          <ReactJson
            src={JSON.parse(JSON.stringify(tx))}
            name="tx"
            style={{ overflowWrap: "anywhere" }}
          />
        </>
      );
    },
  },
  rawTx: {
    label: "Tx",
    order: 0,
    render: (result: DecoderResult) => {
      const { tx } = result.data as RawTxData;
      return (
        <ReactJson
          src={JSON.parse(JSON.stringify(tx))}
          name="tx"
          style={{ overflowWrap: "anywhere" }}
        />
      );
    },
  },
  txFragment: {
    label: "Data",
    order: 1,
    render: (result: DecoderResult) => {
      const { fragment } = result.data as RawTxData;
      if (fragment) {
        if (fragment.error) {
          return (
            <Alert severity="error" style={{ overflowWrap: "anywhere" }}>
              {fragment.error}
            </Alert>
          );
        } else {
          const fragmentData = fragment.data as FragmentData;
          return (
            <>
              <Typography variant="body1" style={{ padding: "0 0 6px 0" }}>
                <b>Selector:</b> {fragmentData.selector}
              </Typography>
              <Typography variant="body1" style={{ padding: "6px 0" }}>
                <b>Signature:</b> {fragmentData.signature}
              </Typography>
              <ReactJson
                src={JSON.parse(JSON.stringify(fragmentData.args))}
                name="data"
                style={{ overflowWrap: "anywhere", marginTop: 10 }}
              />
            </>
          );
        }
      } else {
        return (
          <Alert severity="info" style={{ overflowWrap: "anywhere" }}>
            Transaction has no data
          </Alert>
        );
      }
    },
  },
  txFragmentMeta: {
    label: "Meta",
    order: 2,
    render: (result: DecoderResult) => {
      const { fragment } = result.data as RawTxData;
      if (
        fragment &&
        fragment.data &&
        (fragment.data as FragmentData).metaTx &&
        (fragment.data as FragmentData).metaTx?.data
      ) {
        const fragmentData = fragment.data as FragmentData;
        const metaData = fragmentData.metaTx?.data as FragmentData;
        return (
          <>
            <Typography variant="body1" style={{ padding: "0 0 6px 0" }}>
              <b>Selector:</b> {metaData.selector}
            </Typography>
            <Typography variant="body1" style={{ padding: "6px 0" }}>
              <b>Signature:</b> {metaData.signature}
            </Typography>
            <ReactJson
              src={JSON.parse(JSON.stringify(metaData.args))}
              name="data"
              style={{ overflowWrap: "anywhere", marginTop: 10 }}
            />
          </>
        );
      } else {
        return (
          <Alert severity="info" style={{ overflowWrap: "anywhere" }}>
            No meta-tx detected
          </Alert>
        );
      }
    },
  },
  fragment: {
    label: "Data",
    order: 1,
    render: (result: DecoderResult) => {
      const fragmentData = result.data as FragmentData;
      return (
        <>
          <Typography variant="body1" style={{ padding: "0 0 6px 0" }}>
            <b>Selector:</b> {fragmentData.selector}
          </Typography>
          <Typography variant="body1" style={{ padding: "6px 0" }}>
            <b>Signature:</b> {fragmentData.signature}
          </Typography>
          <ReactJson
            src={JSON.parse(JSON.stringify(fragmentData.args))}
            name="data"
            style={{ overflowWrap: "anywhere", marginTop: 10 }}
          />
        </>
      );
    },
  },
  fragmentMeta: {
    label: "Meta",
    order: 2,
    render: (result: DecoderResult) => {
      const { metaTx } = result.data as FragmentData;
      if (metaTx) {
        const metaData = metaTx.data as FragmentData;
        return (
          <>
            <Typography variant="body1" style={{ padding: "0 0 6px 0" }}>
              <b>Selector:</b> {metaData.selector}
            </Typography>
            <Typography variant="body1" style={{ padding: "6px 0" }}>
              <b>Signature:</b> {metaData.signature}
            </Typography>
            <ReactJson
              src={JSON.parse(JSON.stringify(metaData.args))}
              name="data"
              style={{ overflowWrap: "anywhere", marginTop: 10 }}
            />
          </>
        );
      } else {
        return (
          <Alert severity="info" style={{ overflowWrap: "anywhere" }}>
            No meta-tx detected
          </Alert>
        );
      }
    },
  },
  error: {
    label: "Error",
    order: 3,
    render: (result: DecoderResult) => {
      return (
        <Alert severity="error" style={{ overflowWrap: "anywhere" }}>
          {result.error}
        </Alert>
      );
    },
  },
  input: {
    label: "Input",
    order: 4,
    render: (result: DecoderResult) => {
      return <>{result.input}</>;
    },
  },
};

const _decoderTabs: Record<string, string[]> = {
  Error: ["error", "input"],
  TxHash: ["tx", "txFragment", "txFragmentMeta", "input"],
  RawTx: ["rawTx", "txFragment", "txFragmentMeta", "input"],
  Fragment: ["fragment", "fragmentMeta", "input"],
};

function DecoderOutput(params: { result: DecoderResult; error: boolean }) {
  const { result, error } = params;
  const [value, setValue] = useState(0);

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
  };

  const _tabs = (error ? _decoderTabs["Error"] : _decoderTabs[result.type])
    .filter((f) => !!tabs[f])
    .map((t) => tabs[t])
    .sort((a, b) => a.order - b.order);

  return (
    <Paper sx={{ padding: 2, marginTop: 3 }} elevation={3}>
      <Typography variant="body1">
        <b>Decoder:</b> {result.type}
      </Typography>
      <Tabs value={value} onChange={handleChange}>
        {_tabs.map((t, i) => {
          return <Tab label={t.label} value={i} key={t.label} />;
        })}
      </Tabs>
      {_tabs.map((t, i) => {
        return (
          <TabPanel
            value={value}
            index={i}
            key={result.type}
            style={{ overflowWrap: "anywhere" }}
          >
            {t.render(result)}
          </TabPanel>
        );
      })}
    </Paper>
  );
}

function Output({ results }: { results: DecoderResult[] }) {
  const okResults = results.filter((r) => !r.error);
  const _results = okResults?.length ? okResults : results;
  return (
    <Box sx={{ width: "100%" }}>
      {_results.map((r) => (
        <DecoderOutput key={r.type} result={r} error={!okResults?.length} />
      ))}
    </Box>
  );
}

export default Output;
