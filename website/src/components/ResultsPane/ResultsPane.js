import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { filter, intersection } from 'lodash';

import s from './ResultsPane.css';

import { mapPostData } from '../../utils/mappings.js';
import ResultCard from '../Cards/ResultCard.js';
import LoadingSpinner from '../Loading/LoadingSpinner.js';
import { CANONICAL_TYPES, CANONICAL_LOCATIONS, CANONICAL_GROUPS, LEGEND } from '../../utils/constants.js';

class LegendRow extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, color } = this.props;
    return (
      <div className={s.legend_row}>
        <div style={{backgroundColor: color}} className={classNames(s.color_square)}></div>
        <span>{text}</span>
      </div>
    )
  }
}

function transformToID(groups) {
  if (groups.length == 0) {
    return CANONICAL_GROUPS;
  } else {
    return groups.map(groupIndex => CANONICAL_GROUPS[groupIndex]);
  }
}

function isValidPost(post, groups) {
  const postGroups = post.groups.map(group => group.name);
  return (intersection(groups, postGroups)).length > 0;
}

class ResultsPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: 10,
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
      this.setState({
        visible: Math.min(this.state.visible + 10, this.props.posts.length),
      });
    }
  }

  render() {
    const { posts, reportPost } = this.props;
    const { visible } = this.state;
    const validGroups = transformToID(this.props.params.groups);
    const validPosts = filter(posts, post => isValidPost(post, validGroups));
    return (
      <div className={s.results_container}>
        <div className={s.legend}>
          <div className={s.legend_header}>Ridesharing Groups</div>
          {validGroups.map(row => <LegendRow key={row} text={LEGEND[row].label} color={LEGEND[row].color} />)}
        </div>
        <div className={s.results}>
          <div style={{marginBottom: "20px"}}>
            {validPosts.length} Result{validPosts.length == 1 ? '' : 's'} Found
          </div>

          <div>
            { validPosts.slice(0, visible).map(post => (
                <ResultCard reportPost={reportPost} key={post.id} data={mapPostData(post)}/>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

const GraphQLWrapper = (props) => {
  if (!('date' in props.params)) {
    return <LoadingSpinner />;
  }
  const dateParam = props.params.date === null ? "" : props.params.date.format('Y-MM-DD');
  return (
    <Query
      query={gql`
        query Posts($postType: String, $fromLoc: String, $toLoc: String, $date: String){
          posts(postType: $postType, fromLoc: $fromLoc, toLoc: $toLoc, date: $date) {
            id
            postType
            fromLoc
            toLoc
            body
            date
            time
            groups {
              name
              postLink
            }
          }
        }`
      }
      variables={{
        postType: CANONICAL_TYPES[props.params.type[0]],
        fromLoc: CANONICAL_LOCATIONS[props.params.fromLoc[0]],
        toLoc: CANONICAL_LOCATIONS[props.params.toLoc[0]],
        date: dateParam,
      }}
    >
      {({loading, error, data}) => {
        if (loading) return <LoadingSpinner />;
        if (error) return <p>Error</p>;

        return <ResultsPane { ...props } posts={data.posts}/>;
      }}
    </Query>
  )
}

export default withStyles(s)(GraphQLWrapper);
