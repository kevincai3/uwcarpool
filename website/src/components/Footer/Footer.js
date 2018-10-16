import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import s from './Footer.css';
import Link from '../Link/Link.js';

class Footer extends React.PureComponent {
  render() {
    return (
      <div className={s.root}>
        <hr className={s.line} />
        <div className={s.container}>
          <Link className={classNames(s.link, s.highlight)} to="/about">FAQ</Link>
          <i className={classNames("fas fa-circle", s.dot)}/>
          <a className={s.highlight} href="mailto:uwaterloocarpool@gmail.com">Email Us</a>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Footer);
