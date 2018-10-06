import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import s from './FilterBar.css';

import SelectButton from '../../components/Buttons/Buttons.js';
import DateButton from '../../components/Buttons/DateButton.js';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.js';

import { TYPES, LOCATIONS, TIMES, GROUPS }  from '../../utils/constants.js';
import { paramsToPosition } from '../../utils/mappings.js';

class FilterBar extends React.PureComponent {
  static propTypes = {
    type: PropTypes.arrayOf(PropTypes.number),
    fromLoc: PropTypes.arrayOf(PropTypes.number),
    toLoc: PropTypes.arrayOf(PropTypes.number),
    date: PropTypes.object,
    time: PropTypes.arrayOf(PropTypes.number),
    groups: PropTypes.arrayOf(PropTypes.number),
    updateFunc: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
  }

  updateParent = () => {
    const { type, fromLoc, toLoc, date, groups } = this.props;
    this.props.updateFunc({
      type,
      fromLoc,
      toLoc,
      date,
      groups,
    })
  }

  componentDidMount() {
    this.updateParent();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(
      { ...this.props, updateFunc: undefined, date: (this.props.date != null) && this.props.date.format("Y-M-D") },
      { ...prevProps, updateFunc: undefined, date: (prevProps.date != null) && prevProps.date.format("Y-M-D") })) {
      this.updateParent();
    }
  }

  render() {
    const { type, fromLoc, toLoc, time, groups, updateFunc, date } = this.props;
    return (
      <div className={s.filter_row}>
        <SelectButton options={TYPES} selected={type} onUpdate={(newVal) => updateFunc({ type: newVal })} />
        <SelectButton options={LOCATIONS} selected={fromLoc} onUpdate={(newVal) => updateFunc({ fromLoc: newVal })} />
        <span className={s.label}>to</span>
        <SelectButton options={LOCATIONS} selected={toLoc} onUpdate={(newVal) => updateFunc({ toLoc: newVal })} />
        <span className={s.vertical_line} />
        <DateButton date={date} onUpdate={(newVal) => updateFunc({ date: newVal })} />
        {/*
        <SelectButton options={TIMES} selected={time} onUpdate={(newVal) => updateFunc({ time: newVal })} />
        <span className={s.vertical_line} />
        <SelectButton options={GROUPS} selected={groups} selectMultiple={true} allText="All Groups" onUpdate={(newVal) => updateFunc({ groups: newVal })} />
        */}
      </div>
    )
  }
}

const GraphQLWrapper = (props) => {
  return (
    <Query
      query={gql`
        query Params($strQuery: String) {
          params(strQuery: $strQuery) {
            postType
            fromLoc
            toLoc
            date
            time
          }
        }
      `}
      variables={{
        strQuery: props.strQuery
      }}
    >
      {({loading, error, data}) => {
        if (loading) return <LoadingSpinner type="bar" />;
        if (error) return <p>'Error'</p>;

        return <FilterBar {...paramsToPosition(data.params) } updateFunc={props.updateFunc} { ...props } />
      }}
    </Query>
  )
}

export default withStyles(s)(GraphQLWrapper);
