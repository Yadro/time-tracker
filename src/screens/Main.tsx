import React from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { observer } from 'mobx-react';

import Projects from './projects/Projects';
import TaskControl from '../components/TaskControl/TaskControl';
import HeaderMenu from '../components/HeaderMenu/HeaderMenu';
import HoursView from './hours/HoursView';
import Dashboard from './dashboard/Dashboard';

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
        <HeaderMenu>
          <Link to="/dashboard">Dashboard</Link>
        </HeaderMenu>
        <span className="flex-1" />
        <TaskControl />
      </Header>
      <Switch>
        <Route exact path="/">
          <Redirect to="/projects" />
        </Route>
        <Route path="/hours">
          <HoursView />
        </Route>
        <Route path="/projects">
          <Projects />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
      </Switch>
    </Layout>
  );
});
