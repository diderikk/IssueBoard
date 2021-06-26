import  {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from '@apollo/client/link/context'

const httpLink = createHttpLink({
	uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token');

	return {
		headers: {
			...headers,
			Autorization: token ? `Bearer ${token}` : ""
		}
	}
});

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
});