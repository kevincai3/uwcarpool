import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';

import s from './SortBar.css';

import { SORT_OPTIONS } from '../../utils/constants.js';
import SelectButton from '../../components/Buttons/Buttons.js';

function createTriangle(order) {
  switch(order) {
    case 1:
      return <div className={classNames(s.triangle, s.triangle_down)} />
    case 2:
      return <div className={classNames(s.triangle, s.triangle_up)} />
    default:
      return null;
  }
}

class SortBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.CONSTS = {
      options: SORT_OPTIONS.map(option =>
        (<div className={s.option_container}>{option.label}{createTriangle(option.order)}</div>)
      )
    };
  }

  render() {
    const { selected, onUpdate} = this.props;
    return (
      <div className={s.container}>
        <span className={s.sort_by}>Sort By:</span>
        <SelectButton
          options={this.CONSTS.options}
          selected={selected}
          type="line"
          onUpdate={onUpdate}
          className={s.select_button}
        />
      </div>
    )
  }
}

export default withStyles(s)(SortBar);
