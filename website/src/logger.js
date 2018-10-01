import Knex from 'knex';
import { logDb as logDbConfig } from './config.js';

const COOKIE_NAME = 'uwcarpool-id';

const db = Knex({
  client: 'pg',
  connection: {
    host: logDbConfig.host,
    user: logDbConfig.user,
    password: logDbConfig.password,
    database: logDbConfig.database,
  }
});

function logRequest(token, type, data) {
  db('logs').insert({
    user: token,
    type,
    data,
  }).catch(err => {
    console.error(err);
    console.error(`ERROR: Could not log to db - ${token}: ${type} ${data}}`);
  });
}

export {
  logRequest,
  COOKIE_NAME,
};
