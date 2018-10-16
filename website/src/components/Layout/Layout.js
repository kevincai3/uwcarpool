import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Layout.css';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
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
          <div className={s.content}>
            {this.props.children}
          </div>
          <Footer />
        </div>
      </Base>
    );
  }
}

export default withStyles(s)(Layout);
