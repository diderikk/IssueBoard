import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { client } from "./util/GraphQLClient";
import { ApolloProvider } from "@apollo/client";
import { SnackBarProvider } from "./util/SnackBarContext";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <SnackBarProvider>
        <App />
      </SnackBarProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
