import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { Layout } from 'antd';
import { observer } from 'mobx-react';

import Projects from './projects/Projects';
import TaskControl from './projects/components/TaskControl/TaskControl';
import HeaderMenu from '../components/HeaderMenu';

const { Header } = Layout;

export default observer(function Main() {
  return (
    <Layout className="layout">
      <Header>
        <div>
          <HeaderMenu>
            <Link to="/hours">Hours</Link>
          </HeaderMenu>
          <HeaderMenu>
            <Link to="/projects">Projects</Link>
          </HeaderMenu>
          <TaskControl />
        </div>
      </Header>
      <Switch>
        <Route path="/hours">
          <h1>Test1</h1>
        </Route>
        <Route path="/projects">
          <Projects />
        </Route>
      </Switch>
    </Layout>
  );
});
