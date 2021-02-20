import "milligram";
import "../css/app.scss";

// import {Socket} from "phoenix"
// import socket from "./socket"

import "phoenix_html";
import React from "react";
import ReactDOM from "react-dom";
import App from './Hangman';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
