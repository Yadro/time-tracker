import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { observer } from 'mobx-react';

import Main from './screens/Main';
import 'antd/dist/antd.less';
import './App.global.less';

export default observer(() => {
  return (
    <Router>
      <Main />
    </Router>
  );
});
