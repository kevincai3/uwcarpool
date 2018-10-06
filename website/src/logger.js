import logDb from './data/db/logdb.js';

const COOKIE_NAME = 'uwcarpool-id';

function logRequest(token, type, data) {
  logDb('logs').insert({
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
