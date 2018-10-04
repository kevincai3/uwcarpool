import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Collapse.css';
import classNames from 'classnames';

import Plus from './Plus.js';
import Minus from './Minus.js';

class Collapse extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    }
  }

  toggleExpanded = () => {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    const { title, body } = this.props;
    const { expanded } = this.state;
    const left_colomn_css = classNames(
      s.left_column,
      expanded ? s.left_column_expanded : null
    )
    return (
      <div className={s.container}>
        <div className={s.header_row} onClick={this.toggleExpanded}>
          <div className={left_colomn_css}>{ title }</div>
          <div className={s.right_column}>{ expanded ? <Minus /> : <Plus /> }</div>
        </div>
        { expanded ? (<div className={s.content}>{ body }</div>) : null }
      </div>
    );
  }
}

class CollapseList extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { items } = this.props;
    return (
      <div className={s.list_container}>
        <div className={s.line} />
        { items.map((item, index) => (
          <div>
            <Collapse key={index} title={item.title} body={item.body} />
            <div className={s.line} />
          </div>
          )) }
      </div>
    )
  }
}

export default withStyles(s)(CollapseList)
