import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const GroupType = new ObjectType({
  name: 'Groups',
  fields: {
    postLink: { type: new NonNull(StringType) },
    name: { type: new NonNull(StringType) },
  }
});

export default GroupType;
