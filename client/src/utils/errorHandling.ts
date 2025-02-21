const handleGraphQLError = (error: ApolloError) => {
  if (error.graphQLErrors) {
    // Handle specific GraphQL errors
    return error.graphQLErrors[0].message;
  }
  if (error.networkError) {
    // Handle network errors
    return 'Network error occurred';
  }
  return 'An unexpected error occurred';
}; 