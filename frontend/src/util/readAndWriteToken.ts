import { ApolloClient, gql } from "@apollo/client";

export const readToken = (client: ApolloClient<object>): string => {
  const { token } = client.readQuery({
    query: gql(`query ReadToken {
		token
	}`),
  });

  return token;
};

export const writeToken = (client: ApolloClient<object>, token: string) => {

  client.writeQuery({
    query: gql(`query WriteToken {
		token
	}`),
    data: {
      token,
    },
  });
};
