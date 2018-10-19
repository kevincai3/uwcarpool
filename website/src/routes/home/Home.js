import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import s from './Home.css';

import history from '../../history.js'
import Base from '../../components/Base/Base.js'
import Header from '../../components/Header/Header.js';
import Link from '../../components/Link/Link.js';

class Home extends React.PureComponent {
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
    history.push(`/search?q=${query.trim()}`)
  }

  render() {
    const placeholderText = "i.e. Waterloo to Toronto Tomorrow";
    const query = this.state.query;
    const sliderSettings = {
      slidesToShow: 1,
      slidesToScroll: 1,
      vertical: true,
      arrows: false,
      autoplay: true,
      draggable: false,
      pauseOnHover: false,
      slide: 'span',
      swipe: false,
      touchMove: false,
    }
    return (
      <Base>
        <div className={s.root}>
          <Header isLanding={true} />
          <div className={s.image} />
          <div className={s.text}>
            <span>Find your next Waterloo carpool!</span>
          </div>
          <form className={s.input_form} onSubmit={this.search}>
            <input type="text" className={classNames("searchbar", s.searchbar)} placeholder={placeholderText} value={query} onChange={this.updateQuery} />
            <input className={classNames("button", s.button)} type="submit" value="Search" />
            <button className={classNames("button", s.explore_button)}>Explore</button>
          </form>
        </div>
      </Base>
    );
  }
}

export default withStyles(s)(Home);
