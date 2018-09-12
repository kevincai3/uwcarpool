import knex from "knex"
import moment from 'moment';
import db from "./db.js";

function findPosts(postType, fromLoc, toLoc, date, groups) {
  console.log(postType, fromLoc, toLoc, date, groups)
  let query = db("groups").with('trips', db.raw('select * from trips join groups on trips.post_id = groups.post_id'))
    .join('trips', 'trips.group_id', '=', 'groups.group_id')
    .join('posts', 'posts.post_id', '=', 'groups.post_id')
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

  if (groups) {}
  console.log(query.toString());

  return query.select([
    'posts.post_id',
    'posts.message',
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
