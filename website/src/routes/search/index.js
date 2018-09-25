import React from 'react';
import Search from './Search';
import Layout from '../../components/Layout/Layout.js';

function action(context, params) {
  return {
    title: 'UWCarpool - Search Results',
    chunks: ['search'],
    component: (
      <Layout>
        <Search query={context.query} path={context.path}/>
      </Layout>
    ),
  };
}

export default action;
