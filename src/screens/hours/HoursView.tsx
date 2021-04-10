import React from 'react';
import { Layout } from 'antd';

import rootStore from '../../services/RootStore';
import HoursCard from './components/HoursCard/HoursCard';
import getTimeItems from '../../services/TaskTimeItem';

const { tasksStore } = rootStore;

export default function HoursView() {
  const tasks = tasksStore.getTaskByDate(new Date());
  const timeItems = getTimeItems(tasks, new Date());

  return (
    <Layout style={{ padding: '12px' }}>
      {timeItems.map((taskTime, index) => (
        <HoursCard key={index} taskTime={taskTime} />
      ))}
    </Layout>
  );
}
