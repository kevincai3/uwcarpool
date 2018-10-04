/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import s from './Footer.css';
import Link from '../Link';

class Footer extends React.PureComponent {
  render() {
    return (
      <div className={s.root}>
        <hr className={s.line} />
        <div className={s.container}>
          <Link className={s.link} to="/about">FAQ</Link>
          <i className={classNames("fas fa-circle", s.dot)}/>
          <a href="mailto:uwaterloocarpool@gmail.com">Email Us</a>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Footer);
