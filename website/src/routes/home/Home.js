import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import s from './Home.css';
import Slide from 'react-slick';

import history from '../../history.js'
import Base from '../../components/Base/Base.js'
import Header from '../../components/Header/Header.js';
import Link from '../../components/Link';
import phrases from './phrases.js';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "",
    }
  }

  componentDidMount() { }

  componentWillUnmount() { }

  updateQuery = (event) => {
    this.setState({query: event.target.value});
  }

  search = (event) => {
    event.preventDefault();
    const query = this.state.query;
    if (query.trim() != "") {
      history.push(`/search?q=${query}`)
    }
  }

  render() {
    const placeholderText = "Looking for ride from bk to sauga around 6pm tomorrow";
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
    const destination = (
      <span className={s.destination}>
        <Slide {...sliderSettings}>
          { phrases.map((phrase) => <span className={s.phrase} key={phrase}>{phrase}</span>) }
        </Slide>
      </span>
    )
    return (
      <Base>
        <div className={s.root}>
          <Header isLanding={true} />
          <div className={s.image} />
          <div className={s.text}><span>Ride from Waterloo to </span>{destination}</div>
          <form className={s.input_form}>
            <input type="text" className={classNames("searchbar", s.searchbar)} placeholder={placeholderText} value={query} onChange={this.updateQuery} />
            <button className={classNames("button", s.button)} type="input" onClick={this.search}>Search</button>
          </form>
        </div>
      </Base>
    );
  }
}

export default withStyles(s)(Home);