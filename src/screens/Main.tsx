import React, { useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { Layout } from 'antd';

import ProjectsScreen from './projects/ProjectsScreen';
import HoursScreen from './hours/HoursScreen';
import Dashboard from './dashboard/Dashboard';
import GaService from '../services/gaService/GaService';
import Header from '../components/Header';

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
      <Header />
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
