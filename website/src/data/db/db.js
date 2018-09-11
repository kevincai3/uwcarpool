import Knex from 'knex';
import { db as dbConfig } from '../../config.js';

const knex = Knex({
  client: 'pg',
  connection: {
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
  }
});

export default knex;
