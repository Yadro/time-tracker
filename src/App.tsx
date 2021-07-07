import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { observer } from 'mobx-react';

import Main from './screens/Main';
import 'antd/dist/antd.less';
import './App.global.less';

export default observer(() => {
  // useEffect(() => {
  //   Sentry.captureException(new Error(`${process.env.NODE_ENV} exception`));
  // }, []);

  return (
    <Router>
      <Main />
    </Router>
  );
});
