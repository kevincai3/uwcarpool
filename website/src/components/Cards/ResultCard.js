import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { groupIDToURL } from '../../utils/mappings.js'
import s from './ResultCard.css';
import arrowUrl from '../../../public/Line 5.svg';
import LoadingSpinner from '../Loading/LoadingSpinner.js';

class ResultCard extends React.PureComponent {
  static defaultProps = {
    defaultText: '----'
  }

  static propTypes = {
    data: PropTypes.shape({
      type: PropTypes.number.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      fbId: PropTypes.string.isRequired,
      groups: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }),
    reportPost: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      willOverflow: false,
      reportState: 0, // 0 -> Default, 1 -> Sending, 2 -> Complete
    }
  }

  handleReport = (e) => {
    console.log(e);
    e.preventDefault();
    const { key, fbId } = this.props.data;
    this.props.reportPost(key, fbId)
      .then(() => {
        if (this.state.reportState === 1) {
          this.setState({
            reportState: 2,
          })
        }
      })
      .catch(err => console.log(err));
    this.setState({
      reportState: 1,
    });
  }

  render() {
    const {
      type, start, end, defaultText, date, time, groups, message, fbId
    } = this.props.data;
    const { reportPost } = this.props;
    const { willOverflow, reportState } = this.state;
    const startText = start === "" ? defaultText : start;
    const endText = end === "" ? defaultText : end;
    const dateText = date === "" ? "------- --" : moment(date).format('MMMM D');
    const timeText = time === "" ? "-- : --" : moment.tz(time, "HH:mm:ss", 'utc').tz('America/Toronto').format('h:mm A');

    const reportLink = (
      <span style={{position: 'relative', marginRight: 10}}>
        { reportState !== 2 &&
            <a style={ reportState === 1 ? { opacity: 0 }: {} } disabled={reportState === 1} onClick={this.handleReport}>Report Post</a> }
            { reportState === 1 &&  <LoadingSpinner type='bar' styles={{
              margin: '0 auto',
              position: 'absolute',
              left: 35,
              top: -5,
            }}
        />}
        { reportState === 2 && <span className={s.reported_text}>Thanks for reporting!</span> }
      </span>
    )
    return (
      <div className={s.container}>
        <div className={s.vertical_bar}>
          <div className={classNames(s.type_bar)} />
        </div>
        <div className={s.body}>
          <div className={s.header}>
            <i className={classNames(`fas ${ type == 1 ? 'fa-car' : 'fa-binoculars' }`, s.pad_right, s.icon)} />
            <div className={s.left_header}>
              <span className={classNames(s.pad_right, s.cap)}>{startText}</span>
              <img className={classNames(s.pad_right, s.arrow)} src={arrowUrl} />
              <span className={s.cap}>{endText}</span>
            </div>
            <div className={s.right_header}>
              <span>{dateText}{/*, {timeText}*/}</span>
            </div>
          </div>
          <div className={s.message}>
            {message}
          </div>
          <div className={s.footer}>
            <div className={s.left_footer}>
              {/*<span className={s.more_lines}>{5} more lines</span> */}
            </div>
            <div className={s.right_footer}>
              { reportLink }
              <a href={`http://${groupIDToURL(groups[0])}/permalink/${fbId}`} target="_blank">See on Facebook</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(ResultCard);
