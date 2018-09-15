import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';

import { groupIDToURL } from '../../utils/mappings.js'
import s from './ResultCard.css';
import arrowUrl from '../../../public/Line 5.svg';

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
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      willOverflow: false,
    }
  }

  render() {
    const {
      type, start, end, defaultText, date, time, groups, message, fbId
    } = this.props.data;
    const { willOverflow } = this.state;
    const startText = start === "" ? defaultText : start;
    const endText = end === "" ? defaultText : end;
    const dateText = date === "" ? "------- --" : moment(date).format('MMMM D');
    const timeText = time === "" ? "-- : --" : moment(time, "HH:mm:ss").format('h:mm A');
    return (
      <div className={s.container}>
        <div className={s.vertical_bar}>
          <div className={classNames(s.type_bar)} />
        </div>
        <div className={s.body}>
          <div className={s.header}>
            <div className={s.left_header}>
              <i className={classNames(`fas ${ type == 1 ? 'fa-car' : 'fa-binoculars' }`, s.pad_right, s.icon)} />
              <span className={classNames(s.pad_right, s.cap)}>{startText}</span>
              <img className={classNames(s.pad_right, s.arrow)} src={arrowUrl} />
              <span className={s.cap}>{endText}</span>
            </div>
            <div className={s.right_header}>
              <span>{dateText}, {timeText}</span>
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
              {/*<a className={s.pad_right}>Report Post</a>*/}
              <a href={`http://${groupIDToURL(groups[0])}/permalink/${fbId}`} target="_blank">See on Facebook</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(ResultCard);
