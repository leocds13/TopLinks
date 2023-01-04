import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { apolloClient } from "../libs/apollo";
import { Layout } from "../components/Layout";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<ApolloProvider client={apolloClient}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ApolloProvider>
		</UserProvider>
	);
}
