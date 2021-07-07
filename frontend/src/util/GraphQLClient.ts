import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { IssueBoardResultType } from "../types/IssueBoardResultType.type";
import { IssueLabelResultType } from "../types/IssueLabelResultTyoe.type";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

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

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
});
