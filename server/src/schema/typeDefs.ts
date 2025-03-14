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

  type Auth {
    user: User
    token: String!
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
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;