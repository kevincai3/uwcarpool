import { uniq } from 'lodash';

function mapPostData(postData) {
  return {
    key: postData.id,
    type: postData.postType === 'd' ? 1 : 0,
    start: postData.fromLoc,
    end: postData.toLoc,
    date: postData.date || '',
    time: postData.time || '',
    message: postData.body,
    groups: postData.groups.map(group => mapGroupToID(group.name)),
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
    '1': '225049564330328',
    '2': '372772186164295',
    '3': '372772186164295',
  }
  return base + (mapping[groupId] || "");
}

export {
  mapPostData,
  mapGroupToID,
  groupIDToURL,
};
