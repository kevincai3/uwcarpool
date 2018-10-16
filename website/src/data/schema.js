import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import posts from './queries/posts.js';
import params from './queries/params.js';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      posts,
      params,
    },
  }),
});

export default schema;
