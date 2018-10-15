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

const CANONICAL_GROUPS = [
  'open_waterloo',
  'closed_waterloo',
  'closed_laurier',
]

const LEGEND = {
  'open_waterloo': {
    label: 'University of Waterloo Rideshare (Public)',
    color: '#0D995B',
    shortform: 'Waterloo Open',
  },
  'closed_waterloo': {
    label: 'Rideshare Wilfrid Laurier (Need admin approval)',
    color: '#DA0C0C',
    shortform: 'Waterloo Closed',
  },
  'closed_laurier': {
    label: 'University of Waterloo Carpool (Need @edu.uwaterloo.ca email)',
    color: '#7C0CEE',
    shortform: 'Laurier Closed',
  }
};

export {
  TYPES,
  CANONICAL_TYPES,
  LOCATIONS,
  CANONICAL_LOCATIONS,
  TIMES,
  GROUPS,
  CANONICAL_GROUPS,
  LEGEND,
};
