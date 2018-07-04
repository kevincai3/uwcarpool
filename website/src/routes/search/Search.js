import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';

import s from './Search.css';

import Autocomplete from 'react-autocomplete';
import SelectButton from '../../components/Buttons/Buttons.js';

const OPTIONS = ['Any', 'Driving', 'Looking'];

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
      <div className={s.container}>
        <div>
          <input type="text" className={classNames("searchbar", s.searchbar)} placeholder={placeholderText} value={query} onChange={this.updateQuery} />
          <button className={classNames("button", s.button)} type="input">Search</button>
        </div>
        <div className={s.filter_row}>
          <SelectButton options={OPTIONS} selected={1} />
          <Autocomplete
            getItemValue={(item) => item.label}
            items={[
              { label: 'apple' },
              { label: 'banana' },
              { label: 'pear' }
            ]}
            renderItem={(item, isHighlighted) =>
                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                  {item.label}
                </div>
            }
            value={value}
            onChange={(e) => value = e.target.value}
            onSelect={(val) => value = val}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Search);
