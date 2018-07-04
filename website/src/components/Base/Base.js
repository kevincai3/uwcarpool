// Base class to import global css styles

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import normalizeCss from 'normalize.css';
import globalCss from '../global.css';

class Base extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return this.props.children;
  }
}

export default withStyles(normalizeCss, globalCss)(Base);
