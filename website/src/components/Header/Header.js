/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import className from 'classnames';
import s from './Header.css';
import Link from '../Link';

class Header extends React.PureComponent {
  static propTypes = {
    isLanding: PropTypes.bool,
  }

  render() {
    const isLanding = this.props.isLanding || false

    return (
      <div className={s.root}>
        <div className={className(s.container, {[s.container_colored]: !this.props.isLanding})}>
          <div className={s.left_column}>
            <Link className={s.highlight} to="/">UWCarpool<span className={s.super}>beta</span></Link>
          </div>
          <div className={s.right_column}>
            <Link className={s.highlight} to="/about">About</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
