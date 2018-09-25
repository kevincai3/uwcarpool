import fetch from 'node-fetch';
import { pythonPort } from './config.js';

const pythonUrl = `http://localhost:${pythonPort}/api/`

function fetchQuery(query) {
  return fetch(pythonUrl + 'parse', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  }).then(res => res.json())
    .catch(error => console.log(error));
}

function runUpdates() {
  return fetch(pythonUrl + 'updatetables', {
    method: 'post',
  }).then(res => res.json())
    .catch(error => console.log(error));
}

export {
  fetchQuery,
  runUpdates,
};
