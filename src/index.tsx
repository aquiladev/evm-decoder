import React from "react";
import ReactDOM from "react-dom/client";
import ReactGA from "react-ga4";

import "./polyfill";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactGA.initialize("397923646");
ReactGA.send({
  hitType: "pageview",
  page: window.location.pathname + window.location.search,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
