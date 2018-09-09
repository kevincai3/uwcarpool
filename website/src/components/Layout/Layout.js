import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Layout.css';
import Header from '../Header/Header.js';
import Footer from '../Footer';
import Base from '../Base/Base.js';

class Layout extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <Base>
        <div className={s.container}>
          <Header />
          {this.props.children}
          <Footer />
        </div>
      </Base>
    );
  }
}

export default withStyles(s)(Layout);
