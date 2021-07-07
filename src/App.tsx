import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Main from './screens/Main';
import 'antd/dist/antd.less';
import './App.global.less';

const App = () => {
  // useEffect(() => {
  //   Sentry.captureException(new Error(`${process.env.NODE_ENV} exception`));
  // }, []);

  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
};

export default App;
