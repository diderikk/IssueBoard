import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { IssueBoardResultType } from "../types/IssueBoardResultType.type";
import { IssueLabelResultType } from "../types/IssueLabelResultTyoe.type";
import { readToken, writeToken } from "./readAndWriteToken";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors && graphQLErrors[0]) {
      const message = graphQLErrors[0].message;

      if (message.startsWith("new_token: ")) {
        const token = message.replace("new_token: ", "");
        const oldHeaders = operation.getContext().headers;
        operation.setContext({
          headers: {
            ...oldHeaders,
            Authorization: token,
          },
        });
        writeToken(client, token);
        return forward(operation);
      }
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);
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
