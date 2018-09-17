import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from'graphql';

const ParamType = new ObjectType({
  name: 'Param',
  fields: {
    id: { type: new NonNull(ID) },
    postType: { type: StringType },
    fromLoc: { type: StringType },
    toLoc: { type: StringType },
    date: { type: StringType },
    time: { type: StringType },
  },
})

export default ParamType;
