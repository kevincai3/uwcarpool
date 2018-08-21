import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';

import s from './ResultsPane.css';

import ResultCard from '../Cards/ResultCard.js'

class LegendRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, color } = this.props;
    return (
      <div className={s.legend_row}>
        <div className={classNames(s.color_square)}></div>
        <span style={{verticalAlign: 'middle'}}>{text}</span>
      </div>
    )
  }
}

class ResultsPane extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={s.results_container}>
        <div className={s.legend}>
          <div className={s.legend_header}>Ridesharing Groups</div>
          {[1].map(row => <LegendRow text={"University of Waterloo Carpool"} color={""} />)}
        </div>
        <div className={s.results}>
          <div style={{marginBottom: "20px"}}>4 Results Found</div>
          <ResultCard data={{
            id: 123,
            type: 1,
            start: "Mississauga",
            end: "Waterloo",
            date: "June 12",
            time: "10:00 AM",
            message: "sjdkal\n jskaldsd\n j29klasjd\n k2jqljsidk\n",
            fbId: "9210i30912i319231",
            groups: [1, 2],
          }}/>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(ResultsPane);
