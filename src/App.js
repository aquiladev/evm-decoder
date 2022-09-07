import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link as RLink,
} from "react-router-dom";

import DecodeTx from "./components/DecodeTx";
import DecodeError from "./components/DecodeError";
import DecodeFunction from "./components/DecodeFunction";

function App() {
  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <div style={{ flex: "auto" }}>
              <RLink to="/" style={{ color: "white", textDecoration: "none" }}>
                <Typography variant="h4" component="span">
                  Ethereum decoder
                </Typography>
              </RLink>
              <RLink
                to="/function-decode"
                style={{
                  color: "white",
                  textDecoration: "none",
                  marginLeft: 30,
                }}
              >
                <Typography variant="h6" component="span">
                  Function
                </Typography>
              </RLink>
              <RLink
                to="/error-decode"
                style={{
                  color: "white",
                  textDecoration: "none",
                  marginLeft: 30,
                }}
              >
                <Typography variant="h6" component="span">
                  Error
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

export default App;
