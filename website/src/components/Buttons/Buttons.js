import React from 'react';
import classNames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { xor } from 'lodash';

import ButtonMenu from './ButtonMenu.js';
import s from './Buttons.css';

class SelectMenu extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { selected, options, clicked, keyUp, toggleOpen } = this.props;
    const selectItems = options.map((item, index) =>
      <div key={index}
        className={classNames(s.select_element, {
          [s.selected]: selected.includes(index),
        })} 
        onClick={() => {
          clicked(index);
          toggleOpen(false);
        }}
      >{item}</div>
    )
    return (
      <div className={s.select_container} onKeyUp={keyUp} tabIndex="0">
        {selectItems}
      </div>
    );
  }
}

class SelectButton extends React.PureComponent {
  static propTypes = {
    options: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    selectedMultiple: PropTypes.bool,
    allText: PropTypes.string,
    onUpdate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    selectMultiple: false,
    allText: "All",
  }

  constructor(props) {
    super(props);
  }

  selectedOption = (index) => {
    const selectedArr = this.props.selected;
    let newSelected = []
    if (this.props.selectMultiple) {
      newSelected = xor(this.props.selected, [index])
    } else {
      newSelected = [index]
    }
    this.props.onUpdate(newSelected);
  }

  processKeyUp(key) {
    if (key == "Enter") {
      this.setState({
        expanded: false,
        selected: this.state.highlighted,
        highlighted: 0,
      });
      return;
    } else {
      const maxLength = this.props.options.length;
      const operation = key == "ArrowDown" ? 1 : -1;
      const newHighlighted = (this.state.highlighted + operation + maxLength) % maxLength;
      this.setState({
        highlighted: newHighlighted
      })
    }
  }

  handleKeyUp = (e) => {
    return; // Disable for now
    switch (e.key) {
      case "Enter":
      case "ArrowDown":
      case "ArrowUp":
        if (this.state.expanded == false) {
          this.setState({
            expanded: true,
            highlighted: 0,
          })
          return;
        } else {
          this.processKeyUp(e.key);
        }
        break;
      case "Escape":
        this.setState({
          expanded: false,
          highlighted: 0,
        })
        break;
    }
    e.preventDefault();
  }

  render() {
    const { options, allText, selected } = this.props;
    const text = options.length === selected.length || selected.length === 0 ?
      allText :
      selected.map(index => options[index]).join(", ");

    return (
      <ButtonMenu
        Element={SelectMenu}
        passThrough={{
          options,
          selected,
          clicked: this.selectedOption,
          keyUp: this.handleKeyUp,
        }}
        text={text}
        keepOpen={this.props.selectMultiple}
        />
    )
  }
}

export default withStyles(s)(SelectButton);
