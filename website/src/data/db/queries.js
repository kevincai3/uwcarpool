import knex from "knex"
import moment from 'moment';
import db from "./db.js";

function findPosts(postType, fromLoc, toLoc, date, groups) {
  let query = db('classified_posts')
    .join('post_to_classified', 'classified_posts.classified_id', '=', 'post_to_classified.classified_id')
    .join('posts', 'post_to_classified.post_id', '=', 'posts.id')
    .where('classified_posts.date', '>=', db.fn.now())

  if (postType) {
    query = query.where('classified_posts.post_type', postType);
  }

  if (fromLoc) {
    query = query.where('classified_posts.from_loc', fromLoc);
  }

  if (toLoc) {
    query = query.where('classified_posts.to_loc', toLoc);
  }

  if (date) {
    query = query.where('classified_posts.date', '=', moment(date).format('YYYY-MM-DD'))
  }

  if (groups) {}

  return query.select([
    'posts.id',
    'posts.message',
    'posts.source',
    'posts.fbid',
    'posts.posttime',
    'classified_posts.classified_id',
    'classified_posts.from_loc',
    'classified_posts.to_loc',
    'classified_posts.date',
    'classified_posts.time',
    'classified_posts.post_type',
  ]);
}

export {
  findPosts,
};
