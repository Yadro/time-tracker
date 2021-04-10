import React from 'react';
import { Layout, Space } from 'antd';
import { observer } from 'mobx-react';

import './HoursView.less';

import rootStore from '../../services/RootStore';
import HoursCard from './components/HoursCard/HoursCard';
import getTimeItems from '../../services/TaskTimeItem';

const { tasksStore } = rootStore;

export default observer(function HoursView() {
  const tasks = tasksStore.getTaskByDate(new Date());
  const timeItems = getTimeItems(tasks, new Date());

  return (
    <Layout className="hours">
      <Space direction="vertical">
        {timeItems.map((taskTime, index) => (
          <HoursCard key={index} taskTime={taskTime} />
        ))}
      </Space>
    </Layout>
  );
});
