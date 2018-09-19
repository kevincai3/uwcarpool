import knex from "knex"
import moment from 'moment';
import db from "./db.js";

function findPosts(postType, fromLoc, toLoc, date, groups) {
  let query = db('posts')
    .join('derived_posts', 'posts.post_id', '=', 'derived_posts.post_id')
    .join('groups', 'posts.post_id', '=', 'groups.post_id')
    .join('trips', 'groups.group_id', '=', 'trips.trip_id')
    .where('trips.date', '>=', '2018-06-28'/*db.fn.now()*/)

  if (postType) {
    query = query.where('trips.post_type', postType);
  }

  if (fromLoc) {
    query = query.where('trips.from_loc', fromLoc);
  }

  if (toLoc) {
    query = query.where('trips.to_loc', toLoc);
  }

  if (date) {
    query = query.where('trips.date', '>', moment(date).subtract('1', 'days').format('YYYY-MM-DD')).where('trips.date', '<', moment(date).add('1', 'days').format('YYYY-MM-DD'));
  }

  query = query.where('posts.source', '=', 'open_waterloo');

  return query.select([
    'posts.post_id',
    'derived_posts.clean_message',
    'posts.source',
    'posts.fbid',
    'posts.posttime',
    'trips.trip_id',
    'trips.from_loc',
    'trips.to_loc',
    'trips.date',
    'trips.time',
    'trips.post_type',
  ]);
}

export {
  findPosts,
};
