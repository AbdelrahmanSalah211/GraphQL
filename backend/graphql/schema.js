import gql from 'graphql-tag';

const typeDefs = gql`
  type Driver {
    id: ID!
    name: String!
    age: Int!
    cars: [Car!]!
  }

  type Car {
    id: ID!
    name: String!
    model: String!
    }

  type Query {
    drivers: [Driver!]!
    cars: [Car!]!
  }

  type Mutation {
    createCar(name: String!, model: String!): Car
    createDriver(name: String!, age: Int!, carIds: [ID!]!): Driver
  }
`

export default typeDefs;