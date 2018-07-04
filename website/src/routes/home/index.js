/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import Base from '../../components/Base/Base.js';

function action() {
  return {
    title: 'UWCarpool',
    chunks: ['home'],
    component: (
      <Base>
        <Home />
      </Base>
    ),
  };
}

export default action;
