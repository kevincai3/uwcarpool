import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import history from '../../history.js';

import s from './Search.css';

import Autocomplete from 'react-autocomplete';
import ResultsPane from '../../components/ResultsPane/ResultsPane.js';
import FilterBar from '../../components/FilterBar/FilterBar.js';
import SortBar from '../../components/Sort/SortBar.js';
import { LOCATIONS, TIMES, TYPES } from '../../utils/constants.js';

class Search extends React.PureComponent {
  static propTypes = {
    query: PropTypes.object,
    path: PropTypes.string,

  }

  constructor(props) {
    super(props)
    // Initializes default state
    this.state = {
      query: this.props.query.q || "",
      searchBar: this.props.query.q || "",
      options: {},
      order: [0],
    }
  }

  updateQuery = (event) => {
    event.preventDefault();
    if (this.state.query === this.state.searchBar) {
      return;
    }
    history.push(`${this.props.path}?q=${encodeURI(this.state.searchBar)}`, null);
    this.setState({
      query: this.state.searchBar,
      options: {},
    });
  }

  updateSearchBar = (event) => {
    this.setState({searchBar: event.target.value});
  }

  updateOption = (options) => {
    this.setState({
      options: {
        ...this.state.options,
        ...options,
      },
    });
  }

  updateOrdering = (order) => {
    this.setState({order});
  }

  reportPost = (key, fbId) => {
    return this.props.fetch('/api/reportpost', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        data: {
          key,
          fbId,
          query: this.state.query,
          options: {
            ...this.state.options,
            fromLoc: LOCATIONS[this.state.options.fromLoc],
            toLoc: LOCATIONS[this.state.options.toLoc],
            type: TYPES[this.state.options.type],
          }
        }
      })
    })
  }

  render() {
    const placeholderText = "Search here...";
    const { query, searchBar, options, order } = this.state;
    return (
      <div className={s.container}>
        <div className={s.top_container}>
          <form className={s.form} onSubmit={this.updateQuery}>
            <input type="text" className={classNames("searchbar", s.searchbar)} placeholder={placeholderText} value={searchBar} onChange={this.updateSearchBar} />
            <input className={classNames("button", s.button)} type="submit" value="Search" />
          </form>
          <FilterBar strQuery={query} updateFunc={this.updateOption} {...this.state.options} />
        </div>
        <div className={s.horizontal_line} />
        <div className={s.results_container}>
          <SortBar selected={ order } onUpdate={this.updateOrdering} />
          <ResultsPane reportPost={this.reportPost} params={this.state.options} query={this.state.query} sortOrder={order[0]}/>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Search);
