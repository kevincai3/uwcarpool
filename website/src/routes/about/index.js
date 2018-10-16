/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout/Layout.js';
import About from './About.js';

function action(context) {
  return {
    title: 'UWCarpool - About',
    chunks: ['about'],
    component: (
      <Layout>
        <About fetch={context.fetch}/>
      </Layout>
    ),
  };
}

export default action;
