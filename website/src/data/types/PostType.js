import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as ListType,
} from'graphql';

import GroupType from './GroupTypes.js';

const PostType = new ObjectType({
  name: 'Post',
  fields: {
    id: { type: new NonNull(ID) },
    postType: { type: StringType },
    fromLoc: { type: StringType },
    toLoc: { type: StringType },
    body: { type: StringType },
    date: { type: StringType },
    time: { type: StringType },
    postDate: { type: StringType },
    groups: { type: new NonNull(new ListType(new NonNull(GroupType))) }
  },
})

export default PostType;
