import { uniq } from 'lodash';
import moment from 'moment';

import { CANONICAL_TYPES, CANONICAL_LOCATIONS } from './constants.js';

function mapPostData(postData) {
  return {
    key: postData.id,
    type: postData.postType === 'd' ? 1 : 0,
    start: postData.fromLoc,
    end: postData.toLoc,
    date: postData.date || '',
    time: postData.time || '',
    message: postData.body,
    postDate: postData.postDate,
    groups: postData.groups.map(group => ({
      postLink: group.postLink,
      id: group.name,
    })),
    fbId: postData.groups[0].postLink,
  }
}

function mapGroupToID(groupName) {
  const mapping = {
    'open_waterloo': '1',
    'closed_waterloo': '2',
    'closed_laurier': '3',
  }
  return mapping[groupName] || "";
}

function groupIDToURL(groupId) {
  const base = 'facebook.com/groups/';
  const mapping = {
    'open_waterloo': '225049564330328',
    'closed_waterloo': '372772186164295',
    'closed_laurier': '372772186164295',
  }
  return base + (mapping[groupId] || "");
}

function paramsToPosition(params) {
  const defaultValues = {
    type: [0],
    fromLoc: [0],
    toLoc: [0],
    date: moment(),
    time: [0],
    groups: []
  }
  if (params.postType) {
    defaultValues.type = [Math.max(CANONICAL_TYPES.indexOf(params.postType), 0)]
  }
  if (params.fromLoc) {
    defaultValues.fromLoc = [Math.max(CANONICAL_LOCATIONS.indexOf(params.fromLoc), 0)]
  }
  if (params.toLoc) {
    defaultValues.toLoc = [Math.max(CANONICAL_LOCATIONS.indexOf(params.toLoc), 0)]
  }
  if (params.date) {
    defaultValues.date = moment(params.date);
  }
  return defaultValues;
}

export {
  mapPostData,
  mapGroupToID,
  groupIDToURL,
  paramsToPosition,
};
