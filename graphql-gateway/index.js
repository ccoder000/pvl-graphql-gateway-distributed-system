import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import axios from "axios";

// URLs of backend services
const USER_SERVICE_URL = "http://user-service:8081";
const PRODUCT_SERVICE_URL = "http://product-service:8082";

// -------------------- GraphQL Schema --------------------
const typeDefs = `#graphql
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
    users: [User!]!
    user(id: ID!): User
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String!, email: String!): User
    deleteUser(id: ID!): Boolean

    createProduct(name: String!, price: Float!): Product
    updateProduct(id: ID!, name: String!, price: Float!): Product
    deleteProduct(id: ID!): Boolean
  }
`;

// -------------------- Resolvers --------------------
const resolvers = {
  Query: {
    users: async () => {
      const res = await axios.get(`${USER_SERVICE_URL}/users`);
      return res.data;
    },
    user: async (_, { id }) => {
      const res = await axios.get(`${USER_SERVICE_URL}/users/${id}`);
      return res.data;
    },
    products: async () => {
      const res = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
      return res.data;
    },
    product: async (_, { id }) => {
      const res = await axios.get(`${PRODUCT_SERVICE_URL}/products/${id}`);
      return res.data;
    },
  },

  Mutation: {
    // ---------- USER CRUD ----------
    createUser: async (_, { name, email }) => {
      const res = await axios.post(
        `${USER_SERVICE_URL}/users`,
        { name, email },                   // proper JSON body
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    },
    updateUser: async (_, { id, name, email }) => {
      const res = await axios.put(
        `${USER_SERVICE_URL}/users/${id}`,
        { name, email },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    },
    deleteUser: async (_, { id }) => {
      await axios.delete(`${USER_SERVICE_URL}/users/${id}`);
      return true;
    },

    // ---------- PRODUCT CRUD ----------
    createProduct: async (_, { name, price }) => {
      const res = await axios.post(
        `${PRODUCT_SERVICE_URL}/products`,
        { name, price },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    },
    updateProduct: async (_, { id, name, price }) => {
      const res = await axios.put(
        `${PRODUCT_SERVICE_URL}/products/${id}`,
        { name, price },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    },
    deleteProduct: async (_, { id }) => {
      await axios.delete(`${PRODUCT_SERVICE_URL}/products/${id}`);
      return true;
    },
  },
};

// -------------------- Start Apollo Server --------------------
const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 GraphQL Gateway ready at ${url}`);