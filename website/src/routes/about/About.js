import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './About.css';

import Layout from '../../components/Layout/Layout.js';
import Collapse from '../../components/Collapse/Collapse.js';

class About extends React.Component {
  render (){
    const faq = [{
      title: "How does this website work?",
      body: "This is some words",
    }, {
      title: "How does this website work?",
      body: "Narwhal wolf raw denim, fixie adaptogen retro tilde. Sustainable meggings actually four dollar toast deep v hashtag VHS. Tote bag sriracha woke pug brunch vaporware hoodie jianbing DIY cold-pressed kitsch scenester literally. Jean shorts man bun af tacos iPhone hoodie mustache. Umami marfa meggings freegan vape. Raclette paleo everyday carry pinterest, post-ironic franzen health goth.",
    }];
    return (
      <div>
        <div className={s.title}>
          Frequently Asked Questions
        </div>
        <div className={s.background}>
          <Collapse items={faq}/>
        </div>
      </div>
    )
  }
}



export default withStyles(s)(About)
