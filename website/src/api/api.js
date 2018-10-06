import express from 'express';
import logDb from '../data/db/logdb.js';
import { COOKIE_NAME } from '../logger.js';

const router = express.Router();

function isStringOrUndefined(s) {
  return s === undefined || s === null || typeof(s) === 'string';
}

function isObjectOrUndefined(o) {
  return o === undefined || o === null || typeof(o) === 'object';
}

router.post('/feedback', (req, res) => {
  const { name, email, message } = req.body.data;
  if (!(isStringOrUndefined(name) && isStringOrUndefined(email) && isStringOrUndefined(message))) {
    console.log(`Recieved invalid feedback: ${req.body.data}`);
    res.sendStatus(400);
    return;
  }
  logDb('feedback').insert({
    user: req.cookies[COOKIE_NAME],
    name,
    email,
    message
  })
    .then(() => res.sendStatus(200))
    .catch(err => console.error(err));
});

router.post('/reportpost', (req, res) => {
  const { key, fbId, query, options } = req.body.data;
  if (!(isStringOrUndefined(key) && isStringOrUndefined(fbId) && isStringOrUndefined(query) && isObjectOrUndefined(options))) {
    console.log(`Recieved invalid report: ${req.body.data}`);
    res.sendStatus(400);
    return;
  }
  const trip_id = key.substring(0, key.indexOf('-'));
  logDb('reported').insert({
    user: req.cookies[COOKIE_NAME],
    trip_id,
    fbId,
    data: {
      key,
      fbId,
      query,
      options,
    },
  })
    .then(() => res.sendStatus(200))
    .catch(err => console.error(err));
})

export default router;
