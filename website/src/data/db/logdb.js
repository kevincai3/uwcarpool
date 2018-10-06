import { logDb as logDbConfig } from '../../config.js';
import Knex from 'knex';

const db = Knex({
  client: 'pg',
  connection: {
    host: logDbConfig.host,
    user: logDbConfig.user,
    password: logDbConfig.password,
    database: logDbConfig.database,
  }
});

export default db;
