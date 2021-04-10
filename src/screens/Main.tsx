import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { Layout } from 'antd';
import { observer } from 'mobx-react';

import './Main.less';

import Projects from './projects/Projects';
import TaskControl from './projects/components/TaskControl/TaskControl';
import HeaderMenu from '../components/HeaderMenu/HeaderMenu';
import HoursView from './hours/HoursView';

const { Header } = Layout;

export default observer(function Main() {
  return (
    <Layout className="layout">
      <Header>
        <HeaderMenu>
          <Link to="/hours">Hours</Link>
        </HeaderMenu>
        <HeaderMenu>
          <Link to="/projects">Projects</Link>
        </HeaderMenu>
        <span className="flex-1" />
        <TaskControl />
      </Header>
      <Switch>
        <Route path="/hours">
          <HoursView />
        </Route>
        <Route path="/projects">
          <Projects />
        </Route>
      </Switch>
    </Layout>
  );
});
