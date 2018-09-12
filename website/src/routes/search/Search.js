import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';

import s from './Search.css';

import Autocomplete from 'react-autocomplete';
import { TYPES, LOCATIONS, TIMES, GROUPS }  from '../../utils/constants.js';
import SelectButton from '../../components/Buttons/Buttons.js';
import DateButton from '../../components/Buttons/DateButton.js';
import ResultsPane from '../../components/ResultsPane/ResultsPane.js';

class Search extends React.PureComponent {
  static propTypes = {
    query: PropTypes.string
  }

  constructor(props) {
    super(props)
    // Initializes default state
    this.state = {
      query: this.props.query || "",
      searchBar: this.props.query || "",
      options: {
        type: [0],
        fromLoc: [0],
        toLoc: [0],
        date: moment(),
        time: [0],
        groups: [],
      }
    }
  }

  updateQuery = () => {
    this.setState({query: this.state.searchBar});
  }

  updateSearchBar = (event) => {
    this.setState({searchBar: event.target.value});
  }

  updateOption = (optionKey, value) => {
    this.setState({
      options: {
        ...this.state.options,
        [optionKey]: value,
      },
    });
  }

  render() {
    const placeholderText = "Looking for ride from blah to blah";
    const { query, searchBar, options } = this.state;
    return (
      <div className={s.container}>
        <div className={s.top_container}>
          <div>
            <input type="text" className={classNames("searchbar", s.searchbar)} placeholder={placeholderText} value={searchBar} onChange={this.updateSearchBar} />
            <button className={classNames("button", s.button)} type="input" onClick={this.updateQuery}>Search</button>
          </div>
          <div className={s.filter_row}>
            <SelectButton options={TYPES} selected={options.type} onUpdate={(newVal) => this.updateOption('type', newVal)} />
            <SelectButton options={LOCATIONS} selected={options.fromLoc} onUpdate={(newVal) => this.updateOption('fromLoc', newVal)} />
            <span className={s.label}>to</span>
            <SelectButton options={LOCATIONS} selected={options.toLoc} onUpdate={(newVal) => this.updateOption('toLoc', newVal)} />
            <span className={s.vertical_line} />
            <DateButton date={options.date} onUpdate={(newVal) => this.updateOption('date', newVal)} />
            <SelectButton options={TIMES} selected={options.time} onUpdate={(newVal) => this.updateOption('time', newVal)} />
            <span className={s.vertical_line} />
            <SelectButton options={GROUPS} selected={options.groups} selectMultiple={true} allText="All Groups" onUpdate={(newVal) => this.updateOption('groups', newVal)} />
          </div>
        </div>
        <div className={s.horizontal_line} />
        <ResultsPane params={this.state.options} query={this.state.query}/>
      </div>
    );
  }
}

export default withStyles(s)(Search);
