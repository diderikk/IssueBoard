import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { client } from "./util/GraphQLClient";
import { ApolloProvider } from "@apollo/client";
import { SnackBarProvider } from "./context/SnackBarContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <ApolloProvider client={client}>
        <SnackBarProvider>
          <App />
        </SnackBarProvider>
      </ApolloProvider>
    </DndProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
