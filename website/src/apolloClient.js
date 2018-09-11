import ApolloClient from 'apollo-boost';
import fetch from 'node-fetch';

const client = new ApolloClient({
  uri: '/graphql',
  fetch: fetch,
});

export default client
