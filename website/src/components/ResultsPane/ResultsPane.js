import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { mapPostData } from '../../utils/mappings.js';

import s from './ResultsPane.css';

import ResultCard from '../Cards/ResultCard.js';
import LoadingSpinner from '../Loading/LoadingSpinner.js';
import { CANONICAL_TYPES, CANONICAL_LOCATIONS } from '../../utils/constants.js';

class LegendRow extends React.PureComponent {
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
    return (
      <div className={s.results_container}>
        <div className={s.legend}>
          <div className={s.legend_header}>Ridesharing Groups</div>
          {[1].map(row => <LegendRow key={row} text={"University of Waterloo Rideshare"} color={""} />)}
        </div>
        <div className={s.results}>
          <div style={{marginBottom: "20px"}}>
            {posts.length} Result{posts.length == 1 ? '' : 's'} Found
          </div>

          <div>
            { posts.slice(0, visible).map(post => (
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
