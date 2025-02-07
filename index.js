// Install dependencies first:
// npm install express express-graphql graphql

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Define GraphQL schema
const schema = buildSchema(`
  type Query {
    hello: String
    getUser(id: ID!): User
    users: [User]
  }

  type User {
    id: ID!
    name: String
    email: String
  }
`);

// Generate 1k sample data
const usersData = Array.from({ length: 1000 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `User${i + 1}`,
  email: `user${i + 1}@example.com`
}));

// Define resolvers
const root = {
  hello: () => 'Hello, world!',
  getUser: ({ id }) => usersData.find(user => user.id === id),
  users: () => usersData
};

// Create Express server
const app = express();

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL UI
}));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`GraphQL API server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});
