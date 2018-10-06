import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Collapse.css';
import classNames from 'classnames';
import { Spring, Transition } from 'react-spring';

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
    return (
      <div className={s.container}>
        <div className={s.header_row} onClick={this.toggleExpanded}>
          <Spring to={{
            fontSize: expanded ? '1.5rem' : '1.25rem',
          }}
        >
          {(styles => <div className={s.left_column} style={styles}>{ title }</div>)}
        </Spring>
        <div className={s.right_column}>
          <Transition
            from={{opacity: 0, position: 'absolute', transform: 'rotate(-180deg)'}}
            enter={{opacity: 1, transform: 'rotate(0deg)'}}
            leave={{opacity: 0, transform: 'rotate(180deg)'}}
          >
            {expanded
                ? (styles => <Minus style={styles} />)
                : (styles => <Plus style={styles} /> )
            }
          </Transition>
        </div>
      </div>
      <Spring to={{
        height: expanded ? 'auto' : 0,
        paddingTop: expanded ? 15 : 0,
        paddingBottom: expanded ? 15 : 0,
        opacity: expanded ? 1 : 0,
      }}>
      {(styles => {
        return <div className={s.content} style={{...styles}}>{ body }</div> })
      }
      </Spring>
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
      <div>
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
