import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://graphql-gateway:4000",
  cache: new InMemoryCache(),
});

export default client;