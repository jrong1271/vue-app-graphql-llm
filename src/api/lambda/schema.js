// schema.js
import { gql } from 'graphql-tag'

const typeDefs = gql`
  type Todo {
    id: ID!
    label: String!
    checked: Boolean!
    created_at: String!
    updated_at: String!
  }
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

  type Query {
    todos: [Todo!]!
    todo(id: ID!): Todo
    users: [User]
    user(id: ID!): User
    products: [Product]
    product(id: ID!): Product
    userProducts: [UserProduct]
    userProduct(id: ID!): UserProduct
  }

  type Mutation {
    addTodo(label: String!): Todo!
    updateTodo(id: ID!, checked: Boolean!): Todo!
    deleteTodo(id: ID!): Todo!
    login(email: String!, password: String!): AuthPayload
    addUser(name: String!, email: String!, password: String!): User
    updatePassword(userId: ID!, currentPassword: String!, newPassword: String!): User
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`

export default typeDefs
