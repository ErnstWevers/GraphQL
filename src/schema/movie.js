import { makeExecutableSchema } from 'graphql-tools';
import http from 'request-promise-json';

const MOVIEDBAPIKEY = process.env.MOVIEDBAPIKEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

const typeDefs = `
  type Movie {
    id: ID
    imdb_id: String
    title: String
    tagline: String
    release_date: String
    poster_path: String
    runtime: String
  }

  type Query {
    movies(title: String): [Movie]
    movie(id: String, imdb_id: String): Movie
    cast(id:String): Movie
    test : String
  }

  type Cast {
    id: ID
    cast: [Person]
    crew: [Person]
  }

  type Person {
    id: ID
    name: String
  }
`;

const resolvers = {
  Query: {
    movie: async (obj, args, context, info) => {
      if (args.id) {
        console.log(`fetching movie with id: ${args.id}`)
        return http
          .get(`https://api.themoviedb.org/3/movie/${args.id}?api_key=${MOVIEDBAPIKEY}&language=en-US`)
      }
      if (args.imdb_id) {
        console.log(`fetching movie with imdb_id: ${args.imdb_id}`)
        const results = await http
          .get(`https://api.themoviedb.org/3/find/${args.imdb_id}?api_key=${MOVIEDBAPIKEY}&language=en-US&external_source=imdb_id`)
      }
    },
    cast: async (obj, args, context, info) => {
      if(args.id){
        console.log(`getting cast for movie with id: ${args.id}`);
        const response = await http
          .get(`https://api.themoviedb.org/3/movie/${args.id}?api_key=${MOVIEDBAPIKEY}&language=en-US`)
          console.log(response);
      }
    },
    movies: async (obj, args, context, info) => {
      if(args.title) {
        console.log(`searching for "${args.title}"`)
        const response = await http
          .get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIEDBAPIKEY}&language=en-US&page=1&include_adult=false&query=${args.title}`)
        return response.results
      }
    },
    cast: async (obj, args, context, info) => {
      if(args.id){
        const response = await http
          .get(`https://api.themoviedb.org/3/movie/${args.id}?api_key=${MOVIEDBAPIKEY}&language=en-US`)
        return response
      }
    },
    //approach this API endpointURL with a post the correct header
    //one option for this is to use import gql from 'graphql-tag'
    //curl -X POST -H "Content-Type: application/json" -d '{"query":"{test}"}' http://localhost:4000/graphql
    test: async (obj, args, context, info) => {
      return "Greetings Testman!"
    }
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;