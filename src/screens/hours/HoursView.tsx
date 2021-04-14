import React, { useState } from 'react';
import { Layout, Space } from 'antd';
import { observer } from 'mobx-react';

import './HoursView.less';

import rootStore from '../../services/RootStore';
import HoursCard from './components/HoursCard/HoursCard';
import getTimeItems from '../../services/TaskTimeItem';
import SelectDate from './components/SelectDate/SelectDate';

const { tasksStore } = rootStore;

export default observer(function HoursView() {
  const [date, setDate] = useState<Date>(new Date());

  const tasks = tasksStore.getTasksByDate(date);
  const timeItems = getTimeItems(tasks, date);

  return (
    <Layout className="hours">
      <Space direction="vertical">
        <SelectDate date={date} onChange={setDate} />
        {timeItems.map((taskTime, index) => (
          <HoursCard key={index} taskTime={taskTime} />
        ))}
      </Space>
    </Layout>
  );
});
