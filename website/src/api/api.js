import express from 'express';
import logDb from '../data/db/logdb.js';
import { COOKIE_NAME } from '../logger.js';

const router = express.Router();

function isStringOrUndefined(s) {
  return s === undefined || s === null || typeof(s) ==='string';
}

router.post('/feedback', (req, res) => {
  const { name, email, message } = req.body.data;
  if (!(isStringOrUndefined(name) && isStringOrUndefined(email) && isStringOrUndefined(message))) {
    console.log(`Recieved invalid feedback: \nname: ${name}\nemail: ${email}\nmessage: ${message}`);
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

export default router;
