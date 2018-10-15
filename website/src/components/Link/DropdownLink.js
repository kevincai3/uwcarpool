import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';

import s from './DropdownLink.css';

class DropdownLink extends React.PureComponent {
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

  toggleDropdown = () => {
    this.setState({expanded: !this.state.expanded});
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickedOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickedOutside);
  }

  render() {
    const { linkElements } = this.props;
    const { expanded } = this.state;
    const triangle = (
      <div className={classNames(s.triangle, expanded ? s.triangle_up : s.triangle_down)} onClick={this.toggleDropdown} />
    )
    const dropdown = (
      <div className={s.dropdown_container}>
        { linkElements.slice(1).map(linkElement => (
          <div className={s.dropdown_item}>
            {linkElement}
          </div>)) }
      </div>
    )
    if (linkElements.length === 0) {
      return null;
    }
    return (
      <div className={s.container} ref={node => this.node = node}>
        <div className={s.base}>
          { linkElements[0] }
          { (linkElements.length > 1) && triangle }
        </div>
        { expanded && dropdown }
      </div>
    );
  }
}

export default withStyles(s)(DropdownLink);
