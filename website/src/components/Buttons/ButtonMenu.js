import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './ButtonMenu.css';

class ButtonMenu extends React.PureComponent {
  static propTypes = {
    Element: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
    text: PropTypes.string,
    passThrough: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
   }
  }

  handleClickedOutside = (e) => {
    if (this.node.contains(e.target)) {
      return;
    }
    if (this.state.expanded == true) {
      this.setState({expanded: false});
    }
  }

  toggleMenu = (e) => {
    if (e.detail != 0) {
      this.setState({
        expanded: !this.state.expanded,
      });
    }
  }

  toggleOpen = (open) => {
    if (!this.props.keepOpen) {
      this.setState({
        expanded: open,
      })
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickedOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickedOutside);
  }

  render() {
    const { Element, passThrough, text, type } = this.props;
    const { expanded } = this.state;
    return (
      <div className={s.container} ref={node => this.node = node}>
        <button
          className={classNames("button", s.button, {
            [s.button_selected]: expanded,
            [s.button_type]: type === 'button',
            [s.line_type]: type === 'line',
          })}
          onClick={this.toggleMenu}
          type=""
        >{text}</button>
        { expanded == true ?
            (<div className={s.menu_container}>
              <div className={s.outer_triangle}>
                <div className={s.inner_triangle} />
              </div>
              <div className={s.element_wrapper}>
                <Element {...passThrough} toggleOpen={this.toggleOpen}/>
              </div>
            </div>) :
            null
        }
      </div>
    )
  }
}

export default withStyles(s)(ButtonMenu);
