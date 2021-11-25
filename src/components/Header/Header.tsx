import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { observer } from 'mobx-react';

import HeaderLink from '../HeaderLink/HeaderLink';
import Profile from '../Profile/Profile';
import TaskControl from '../TaskControl/TaskControl';

const { Header: HeaderBase } = Layout;

function Header() {
  return (
    <HeaderBase>
      <HeaderLink>
        <Link to="/hours">Hours</Link>
      </HeaderLink>
      <HeaderLink>
        <Link to="/projects">Projects</Link>
      </HeaderLink>
      <HeaderLink>
        <Link to="/dashboard">Dashboard</Link>
      </HeaderLink>
      <span className="flex-1" />
      <TaskControl />
      <Profile />
    </HeaderBase>
  );
}

export default observer(Header);
