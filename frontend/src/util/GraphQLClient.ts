import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
  NextLink,
  Operation,
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

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    counter++;
    if(counter % 2 === 0) return;
    fetchNewAccessToken({ operation, forward });
  }
});

const fetchNewAccessToken = async (obj: { operation: Operation, forward: NextLink }) => {
  const response = await fetch(uri + "/access_token", {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 200) {
    const oldHeaders = obj.operation.getContext().headers;
    response.json().then((data) => {
      const token = data.access_token;
      if (!token) return false;
      obj.operation.setContext({
        headers: {
          ...oldHeaders,
          Authorization: token,
        },
      });
      writeToken(client, token);
      obj.forward(obj.operation);
      return true;
    });
  }
  return false;
};

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
