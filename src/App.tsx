import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link as RLink,
} from "react-router-dom";

import Decoder from "./components/Decoder";

function App() {
  return (
    <>
      <Router>
        <div>
          <AppBar position="static">
            <Toolbar>
              <div style={{ flex: "auto" }}>
                <RLink
                  to="/"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <Typography variant="h4" component="span">
                    EVM Decoder
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
                  <GitHubIcon fontSize="medium" style={{ color: "white" }} />
                </IconButton>
              </Link>
            </Toolbar>
          </AppBar>
          <Container style={{ marginTop: 40 }}>
            <Routes>
              <Route path="/" element={<Decoder />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </>
  );
}

export default App;
