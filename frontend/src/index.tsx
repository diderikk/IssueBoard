import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { client } from "./apollo-client";
import { ApolloProvider } from "@apollo/client";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
