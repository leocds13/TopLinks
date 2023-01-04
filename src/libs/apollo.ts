import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";

export const apolloClient = new ApolloClient({
	uri: `${
		process.env.NEXT_SERVER_URL ?? "http://localhost:3000"
	}/api/graphql`,
	cache: new InMemoryCache(),
});
