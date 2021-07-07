import React, { useEffect } from 'react';
import { Route, Switch, Link, Redirect, useLocation } from 'react-router-dom';
import { Layout } from 'antd';

import ProjectsScreen from './projects/ProjectsScreen';
import TaskControl from '../components/TaskControl/TaskControl';
import HeaderMenu from '../components/HeaderMenu/HeaderMenu';
import HoursScreen from './hours/HoursScreen';
import Dashboard from './dashboard/Dashboard';
import analytics from '../services/GaService';

const { Header } = Layout;

const Main = () => {
  const location = useLocation();

  useEffect(() => {
    analytics?.pageview(location.pathname);
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
        <Redirect exact from="/" to="/projects" />
        <Route path="/hours" component={HoursScreen} />
        <Route path="/projects" component={ProjectsScreen} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </Layout>
  );
};

export default Main;
