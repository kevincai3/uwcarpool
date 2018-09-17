import React from 'react';
import classNames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isString, range } from 'lodash';

import UnstyledDatePicker from 'react-datepicker';
import datePickerStyles from 'react-datepicker/dist/react-datepicker.css';
import datePickerOverride from './DatePickerOverride.css';

import ButtonMenu from './ButtonMenu.js'
import s from './DateButton.css'

const DatePicker = withStyles(datePickerStyles, datePickerOverride)(UnstyledDatePicker);

class DateMenu extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {date, onChange, setAllDate} = this.props;
    const isAllDates = date === null
    const validDates = range(0, 8).map(offset => moment().add(offset, "days"));
    return (
      <div className={s.container}>
        <DatePicker
          selected={date || moment()}
          onChange={onChange}
          includeDates={validDates}
          startDate={isAllDates ? validDates[0] : null}
          endDate={isAllDates ? validDates[7] : null}
          inline />
        <button
          className={
            classNames('react-datepicker__today-button',
              s.all_dates_button)}
          onClick={setAllDate}
          type="">Any Date</button>
      </div>
    )
  }
}

class DateButton extends React.PureComponent {
  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      date: props.date,
    }
  }

  updateDate = (newDate) => {
    this.setState({
      date: newDate,
    });
    this.props.onUpdate(newDate);
  }

  setAllDate = () => {
    this.setState({
      date: null,
    })
    this.props.onUpdate(null);
  }

  render() {
    const { date, isAllDates } = this.state;
    return (
      <ButtonMenu
        Element={DateMenu}
        passThrough={{
          date,
          onChange: this.updateDate,
          setAllDate: () => this.setAllDate(),
        }}
        text={date === null ? "All Days" : date.format("MMMM D")}
      />
    )
  }
}

export default withStyles(s)(DateButton);
