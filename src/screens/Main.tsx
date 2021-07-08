import React, { useEffect } from 'react';
import { Route, Switch, Link, Redirect, useLocation } from 'react-router-dom';
import { Layout } from 'antd';

import ProjectsScreen from './projects/ProjectsScreen';
import TaskControl from '../components/TaskControl/TaskControl';
import HeaderMenu from '../components/HeaderMenu/HeaderMenu';
import HoursScreen from './hours/HoursScreen';
import Dashboard from './dashboard/Dashboard';
import GaService from '../services/gaService/GaService';

const { Header } = Layout;

const Main = () => {
  const location = useLocation();

  useEffect(() => {
    let path = location.pathname;
    if (path.includes('index.html')) {
      path = '/';
    }
    GaService.pageView(path);
  }, [location.pathname]);

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
        <Route path="/hours" component={HoursScreen} />
        <Route path="/projects" component={ProjectsScreen} />
        <Route path="/dashboard" component={Dashboard} />
        <Redirect from="*" to="/projects" />
      </Switch>
    </Layout>
  );
};

export default Main;
