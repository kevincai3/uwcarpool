import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import s from './Home.css';

import history from '../../history.js'
import Base from '../../components/Base/Base.js'
import Header from '../../components/Header/Header.js';
import Link from '../../components/Link';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "",
    }
  }

  updateQuery = (event) => {
    this.setState({query: event.target.value});
  }

  search = (event) => {
    event.preventDefault();
    const query = this.state.query;
    if (query.trim() != "") {
      history.push(`/?q=${query}`)
    }
  }

  render() {
    const placeholderText = "Looking for ride from bk to sauga around 6pm tomorrow";
    const query = this.state.query;
    const search = this.search;
    return (
      <Base>
        <div className={s.root}>
          <Header isLanding={true} />
          <div className={s.image} />
          <div className={s.text}>Ride from Waterloo to Mississauga</div>
          <form className={s.input_form}>
            <input type="text" className={classNames("searchbar", s.searchbar)} placeholder={placeholderText} value={query} onChange={this.updateQuery} />
            <button className={classNames("button", s.button)} type="input" onClick={search}>Search</button>
          </form>
        </div>
      </Base>
    );
  }
}

export default withStyles(s)(Home);
