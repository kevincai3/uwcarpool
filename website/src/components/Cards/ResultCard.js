import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { sortBy } from 'lodash';

import { groupIDToURL } from '../../utils/mappings.js';
import { LEGEND } from '../../utils/constants.js';
import s from './ResultCard.css';
import Arrow from './Line.js';
import LoadingSpinner from '../Loading/LoadingSpinner.js';
import DropdownLink from '../Link/DropdownLink.js';

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
      groups: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
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
      type, start, end, defaultText, date, time, groups, message, fbId, postDate
    } = this.props.data;
    const sortedGroups = sortBy(groups, group => LEGEND[group.id].order);
    const availableGroups = sortedGroups.map(group => group.id);
    const { reportPost } = this.props;
    const { willOverflow, reportState } = this.state;
    const startText = start === "" ? defaultText : start;
    const endText = end === "" ? defaultText : end;
    const dateText = date === "" ? "------- --" : moment(date).format('MMMM D');
    const timeText = time === "" ? "-- : --" : moment.tz(time, "HH:mm:ss", 'utc').tz('America/Toronto').format('h:mm A');

    const reportLink = (
      <span className={classNames(s.report_button)} style={{position: 'relative', marginRight: 2}}>
        { reportState !== 2 &&
            <a style={{opacity: reportState === 1 ? 0 : 1}} disabled={reportState === 1} onClick={this.handleReport}>Report Post</a> }
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
          {
            availableGroups.map(groupID => <div style={{backgroundColor: LEGEND[groupID].color}} className={s.type_bar} key={groupID} />)
          }
          
        </div>
        <div className={s.body}>
          <div className={s.header}>
            <i className={classNames(`fas ${ type == 1 ? 'fa-car' : 'fa-binoculars' }`, s.pad_right, s.icon)} />
            <div className={s.left_header}>
              <span className={classNames(s.pad_right, s.cap)}>{startText}</span>
              <Arrow className={classNames(s.pad_right, s.arrow)} />
              <span className={s.cap}>{endText}</span>
            </div>
            <div className={s.right_header}>
              <span>{dateText}{/*, {timeText}*/}</span>
            </div>
          </div>
          <div className={s.message}>
            {message}
            <div className={s.info_bar}>
              <span>Posted on {moment(postDate).format("MMM D")}</span>
            </div>
          </div>
          <div className={s.footer}>
            <div className={s.left_footer}>
              {/*<span className={s.more_lines}>{5} more lines</span> */}
              <div className={s.view_on}>View On: </div>
              <DropdownLink linkElements={
                sortedGroups.map(group => {
                  const id = group.id;
                  return (
                    <a
                      href={`http://${groupIDToURL(id)}/permalink/${group.postLink}`}
                      className={s.link}
                      target="_blank">
                      <div
                        className={s.badge}
                        style={{
                        backgroundColor: LEGEND[id].color,
                      }}/>
                      {LEGEND[id].shortform}
                    </a>
                  )
                })
              }
              / >
            </div>
            <div className={s.right_footer}>
              { reportLink }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(ResultCard);
