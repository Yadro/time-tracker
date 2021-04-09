import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { observer } from 'mobx-react';
import Projects from './projects/Projects';

const { Header } = Layout;

export default observer(function Main() {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">
            <Link to="/hours">Hours</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/projects">Projects</Link>
          </Menu.Item>
        </Menu>
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
