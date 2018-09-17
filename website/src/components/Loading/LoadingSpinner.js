import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';

import s from './LoadingSpinner.css';

const validStrings = [
  'spin',
  'bar',
]

class LoadingSpinner extends React.PureComponent {
  static propTypes = {
    type: PropTypes.string,
  }

  static defaultProps = {
    type: 'spin'
  }

  constructor(props) {
    super(props);
  }

  render() {
    let { type } = this.props
    if (validStrings.indexOf(type) === -1) {
      type = validStrings[0]
    }
    return <div className={`${type}loader`} />
  }
}

export default withStyles(s)(LoadingSpinner);
