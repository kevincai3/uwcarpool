const TYPES = ['Any Type', 'Driving', 'Looking'];
const CANONICAL_TYPES = ['', 'd', 's'];

const LOCATIONS = [
  'Any Where',
  'Waterloo',
  'Toronto',
  'Markham',
  'Scarborough',
  'Mississauga',
  'North York',
  'Fairview',
  'Pearson',
  'Brampton',
  'London',
  'Ottawa',
  'Vaughan',
  'Kitchener',
  'Hamilton',
  'Etobicoke',
  'Oakville',
  'Guelph',
  'Kingston',
  'Richmond Hill',
  'Newmarket',
  'Thornhill',
  'Bayview',
]

const CANONICAL_LOCATIONS = LOCATIONS.map(location => {
  if (location === 'Any Where') {
    return '';
  } else {
    return location.toLowerCase().replace(/ /g, '');
  }
})

const TIMES = [
  'Any Time',
  '12:00 PM',
  '1:00 AM',
  '2:00 AM',
  '3:00 AM',
  '4:00 AM',
  '5:00 AM',
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  '11:00 PM',
];

const GROUPS = [
  'Waterloo Open',
  'Waterloo Closed',
  'Laurier Closed',
];

export {
  TYPES,
  CANONICAL_TYPES,
  LOCATIONS,
  CANONICAL_LOCATIONS,
  TIMES,
  GROUPS,
};
