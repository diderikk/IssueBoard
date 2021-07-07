import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { IssueBoardResultType } from "../types/IssueBoardResultType.type";
import { IssueLabelResultType } from "../types/IssueLabelResultTyoe.type";
import { readToken } from "./readAndWriteToken";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = readToken(client);
  console.log(token);

  return {
    headers: {
      ...headers,
      Autorization: token ? `Bearer ${token}` : "",
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
  link: authLink.concat(httpLink),
  cache: cache,
});
