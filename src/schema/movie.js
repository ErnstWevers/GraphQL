import { makeExecutableSchema } from 'graphql-tools';
import http from 'request-promise-json';

const MOVIE_DB_API_KEY = process.env.MOVIE_DB_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

const typeDefs = `
  type Movie {
    id: ID
    imdb_id: String
    title: String
    tagline: String
    release_date: String
  }

  type Person {
    name: String
  }

  union SearchResult = Person | Movie

  type Query {
    movies: [Movie]
    person(id: String): Person
    movie(id: String, imdb_id: String): Movie
  }
`;

const resolvers = {
  Query: {
    movie: async (obj, args, context, info) => {
      if (args.id) {
        return http
          .get(`https://api.themoviedb.org/3/movie/${args.id}?api_key=${MOVIE_DB_API_KEY}&language=en-US`)
      }
      if (args.imdb_id) {
        const results = await http
          .get(`https://api.themoviedb.org/3/find/${args.imdb_id}?api_key=${MOVIE_DB_API_KEY}&language=en-US&external_source=imdb_id`)

        if (results.movie_results.length > 0) {
          const movieId = results.movie_results[0].id
          return http
            .get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${MOVIE_DB_API_KEY}&language=en-US`)
        }
      }
    },
    person: async (obj, args, context, info) => {
      if(args.id){
        return http
          .get(`https://api.themoviedb.org/3/person/${args.id}?api_key=${MOVIE_DB_API_KEY}&language=en-US`)
      }
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;