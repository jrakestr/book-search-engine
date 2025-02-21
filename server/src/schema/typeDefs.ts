// server/src/schema/typeDefs.ts
const typeDefs = `#graphql
  type Book {
    bookId: String!
    authors: [String]!
    title: String!
    description: String!
    image: String
    link: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]!
  }

  input BookInput {
    bookId: String!
    authors: [String]!
    title: String!
    description: String!
    image: String
    link: String
  }

  type Query {
    me: User
  }
  
  type Mutation {
    addUser(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;