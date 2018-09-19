import {
  GraphQLString as StringType,
  GraphQLList as ListType,
} from 'graphql';

import PostType from '../types/PostType.js';
import { findPosts } from '../db/queries.js';
import { groupBy, uniqBy } from 'lodash';
import moment from 'moment';

function buildPost(rawPosts) {
  const newestPost = rawPosts.sort((postA, postB) => postA.posttime - postB.posttime)[0];
  const groups = uniqBy(rawPosts.map(post => ({
    postLink: post.fbid,
    name: post.source,
  })),
    group => group.source
  );
  return {
    id: newestPost.trip_id + "-" + newestPost.posttime.toUTCString(),
    postType: newestPost.post_type,
    fromLoc: newestPost.from_loc,
    toLoc: newestPost.to_loc,
    body: newestPost.clean_message,
    date: moment(newestPost.date).format(),
    time: newestPost.time,
    groups,
  }
}

function processPosts(rawPosts) {
  const groupedPosts = groupBy(rawPosts, 'trip_id');
  const processedPosts = Object.values(groupedPosts).map(buildPost);
  return processedPosts;
}

const posts = {
  type: new ListType(PostType),
  args: {
    postType: { type: StringType },
    fromLoc: { type: StringType },
    toLoc: { type: StringType },
    date: { type: StringType },
    groups: { type: new ListType(StringType) },
  },
  resolve(req, {postType, fromLoc, toLoc, date, groups}) {
    return findPosts(postType, fromLoc, toLoc, date, groups)
      .then(processPosts);
  },
};

export default posts;
