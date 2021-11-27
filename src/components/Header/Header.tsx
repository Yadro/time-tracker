import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import useMediaQuery from 'react-hook-media-query';
import { createUseStyles } from 'react-jss';

import HeaderLink from '../HeaderLink/HeaderLink';
import Profile from '../Profile/Profile';
import TaskControl from '../TaskControl/TaskControl';
import ProgressBar from '../ProgressBar/ProgressBar';

const { Header: HeaderBase } = Layout;

const query = '(min-width: 950px)';
function Header() {
  const style = useStyle();
  const isBigScreen = useMediaQuery(query);

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
      <span className={style.flex1}>{isBigScreen && <ProgressBar />}</span>
      <TaskControl />
      <Profile />
    </HeaderBase>
  );
}

export default observer(Header);

const useStyle = createUseStyles({
  flex1: {
    flex: 1,
  },
});
