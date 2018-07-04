import React from 'react';
import Search from './Search';
import Layout from '../../components/Layout/Layout.js';

function action() {
  return {
    title: 'UWCarpool - Search Results',
    chunks: ['search'],
    component: (
      <Layout>
        <Search />
      </Layout>
    ),
  };
}

export default action;
