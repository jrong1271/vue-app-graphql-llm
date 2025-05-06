// schema.js
const { gql } = require('graphql-tag');

const typeDefs = gql`
  type UserProduct {
    id: ID!
    userId: Int
    productId: Int
    quantityOwned: Int!

    user: User
    product: Product
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
  }
  
  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    products: [Product]
    product(id: ID!): Product
    userProducts: [UserProduct]
    userProduct(id: ID!): UserProduct
    # login moved to mutation
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    addUser(name: String!, email: String!, password: String!): User
    updatePassword(userId: ID!, currentPassword: String!, newPassword: String!): User
  }
`;

module.exports = typeDefs;