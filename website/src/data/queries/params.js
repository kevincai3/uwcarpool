import {
  GraphQLString as StringType,
} from 'graphql';
import md5 from 'md5';
import moment from 'moment';

import ParamType from '../types/ParamType.js';
import { fetchQuery } from '../../pythonClient.js';
import { logRequest, COOKIE_NAME } from '../../logger.js';

function processParam(strQuery, results) {
  return {
    ...results,
    id: md5(strQuery),
    postType: results.posttype,
  };
}

const params = {
  type: ParamType,
  args: {
    strQuery: { type: StringType },
  },
  resolve({ request }, params) {
    const { strQuery } = params;
    logRequest(request.cookies[COOKIE_NAME], 3, params);
    return fetchQuery(strQuery)
      .then(results => processParam(strQuery, results));
  }
}

export default params;
