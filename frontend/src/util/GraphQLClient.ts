import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { IssueBoardResultType } from "../types/IssueBoardResultType.type";
import { IssueLabelResultType } from "../types/IssueLabelResultTyoe.type";
import { readToken, writeToken } from "./readAndWriteToken";

const uri = "https://issueboard-gr75g3sfyq-lz.a.run.app";

const httpLink = createHttpLink({
  uri: uri + "/graphql",
  // uri: "http://localhost:4000/graphql",
  credentials: "include",
});

let counter = 0;

const errorLink = onError(({ operation, forward }) => {
  counter++;
  if (counter % 2 === 0) return;
  return new Observable(observer => {
    fetch(uri + "/access_token", {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          const token = data.access_token;
          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              Authorization: token,
            },
          });
          writeToken(client, token);

          const subscriber = {
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          };

          forward(operation).subscribe(subscriber);
        });
      }
    });
  });
});

const authLink = setContext((_, { headers }) => {
  const token = readToken(client);

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    IssueBoard: {
      fields: {
        issueLabels: {
          merge: (
            existing: IssueLabelResultType[],
            incoming: IssueLabelResultType[]
          ) => [...incoming],
        },
      },
    },
    Query: {
      fields: {
        notGroupIssueBoards: {
          merge: (
            existing: IssueBoardResultType[],
            incoming: IssueBoardResultType[]
          ) => [...incoming],
        },
      },
    },
  },
});

cache.writeQuery({
  query: gql(`query WriteToken {
		token
	}`),
  data: {
    token: "",
  },
});

export const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: cache,
});
