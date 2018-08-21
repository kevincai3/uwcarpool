import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';

import s from './Search.css';

import Autocomplete from 'react-autocomplete';
import SelectButton from '../../components/Buttons/Buttons.js';
import DateButton from '../../components/Buttons/DateButton.js';
import ResultsPane from '../../components/ResultsPane/ResultsPane.js';

const TYPES = ['Any Type', 'Driving', 'Looking'];
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
]

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "",
    }
  }

  updateQuery = (event) => {
    this.setState({query: event.target.value});
  }

  render() {
    const placeholderText = "Looking for ride from blah to blah";
    const query = this.state.query;
    let value = "";
    return (
      <div>
        <div className={s.top_container}>
          <div>
            <input type="text" className={classNames("searchbar", s.searchbar)} placeholder={placeholderText} value={query} onChange={this.updateQuery} />
            <button className={classNames("button", s.button)} type="input">Search</button>
          </div>
          <div className={s.filter_row}>
            <SelectButton options={TYPES} selected={[1]} />
            <SelectButton options={LOCATIONS} selected={[1]} />
            <span className={s.label}>to</span>
            <SelectButton options={LOCATIONS} selected={[1]} />
            <span className={s.vertical_line} />
            <DateButton />
            <SelectButton options={TIMES} selected={[1]} />
            <span className={s.vertical_line} />
            <SelectButton options={GROUPS} selected={[1, 2]} selectMultiple={true} allText="All Groups"/>
          </div>
        </div>
        <div className={s.horizontal_line} />
        <ResultsPane />
      </div>
    );
  }
}

export default withStyles(s)(Search);
