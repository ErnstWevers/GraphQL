import { makeExecutableSchema } from 'graphql-tools';

const movies = [
  { id: 1, title: 'Indiana Jones'},
  { id: 2, title: 'Back to the future'},
  { id: 3, title: 'Independence day'},
  { id: 4, title: 'Tootsie'},
];

const typeDefs = `
  type Movie {
    id: ID!
    title: String!
    tagline: String
    release_date : String
  }

  type Query {
    movies: [Movie]
  }
`;

const resolvers = {
  Query: {
    movies: () =>   movies,
  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;