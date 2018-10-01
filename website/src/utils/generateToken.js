import uuid from 'uuid/v4';

function generateToken(req) {
  return uuid();
}

export default generateToken;
