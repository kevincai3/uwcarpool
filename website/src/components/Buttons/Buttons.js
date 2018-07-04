import React from 'react';
import classNames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Buttons.css';

class SelectMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: props.selected }
  }

  render() {
    const { selected } = this.state;
    const { options } = this.props;
    const selectItems = options.map((item, index) =>
      <div key={index} className={classNames(s.select_element, {
        [s.selected]: index == selected,
      })}>{item}</div>
    )
    return (
      <div className={s.select_container}>
        {selectItems}
      </div>
    );
  }
}

class SelectButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      selected: props.selected,
    }
  }

  handleClickedOutside = (event) => {
    if (this.state.expanded == true) {
      this.setState({expanded: false});
    }
  }

  selectedOption = (index) => {
    this.setState({selected: index});
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickedOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickedOutside);
  }

  render() {
    const { options } = this.props;
    const { expanded, selected } = this.state;
    return (
      <div className={s.container}>
        <div className={classNames("button", s.button, {
          [s.button_selected]: expanded,
        })}>
          {options[selected]}
        </div>
        <SelectMenu {...this.props} />
      </div>
    )
  }
}

export default withStyles(s)(SelectButton);
