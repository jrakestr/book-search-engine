import { ApolloClient, InMemoryCache, HttpLink, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Auth from './auth';

// Create a custom HTTP link that points to the GraphQL endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Auth middleware - adds token from Auth to headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = Auth.loggedIn() ? Auth.getToken() : '';
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client; 