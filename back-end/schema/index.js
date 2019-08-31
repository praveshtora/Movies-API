const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    movies : [Movie]!
  }
  type Mutation {
    createUser(username: String, password: String): User!
    login(username: String, password: String): User!
  }
  type Movie {
    scoutbase_rating: String
    title: String!
    year: Int!
    rating: Int!
    actors: [Actor]
  }
  type Actor {
    name: String!
    birthday: String!
    country: String!
    directors: [Director]
  }
  type Director {
    name: String!
    birthday: String!
    country: String!
  }
  type User {
    token: String
    user : UserDetail
  }
  type UserDetail {
    name: String!
    password: String!
    id: String!
  }
`);

module.exports = schema;
