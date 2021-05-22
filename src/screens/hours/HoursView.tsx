import React, { useMemo, useState } from 'react';
import { Layout, Space } from 'antd';
import { observer } from 'mobx-react';

import rootStore from '../../services/RootStore';
import HoursCard from './components/HoursCard/HoursCard';
import { getTimeItems } from '../../helpers/TaskHelper';
import SelectDate from '../../components/SelectDate/SelectDate';
import TimeRangeModal from '../../components/TimeRangeModal/TimeRangeModal';
import TaskTimeItemModel from '../../models/TaskTimeItemModel';
import { Undefined } from '../../types/CommonTypes';
import TotalHours from './components/TotalHours/TotalHours';
import { createUseStyles } from 'react-jss';

const { tasksStore } = rootStore;

export default observer(function HoursView() {
  const classes = useStyles();
  const [date, setDate] = useState<Date>(new Date());
  const [currentTaskTime, setCurrentTaskTime] = useState<
    Undefined<TaskTimeItemModel>
  >();

  const tasks = useMemo(() => tasksStore.getTasksByDate(date), [date]);
  const timeItems = getTimeItems(tasks, date);

  return (
    <Layout className={classes.hours}>
      <Space direction="vertical">
        <SelectDate date={date} onChange={setDate} />
        <TotalHours timeItems={timeItems} />
        {timeItems.map((taskTime, index) => (
          <HoursCard
            key={index}
            taskTime={taskTime}
            onClick={(taskTime) => setCurrentTaskTime(taskTime)}
          />
        ))}
      </Space>
      <TimeRangeModal
        visible={!!currentTaskTime}
        onClose={() => setCurrentTaskTime(undefined)}
        taskTime={currentTaskTime}
      />
    </Layout>
  );
});

const useStyles = createUseStyles({
  hours: {
    overflowY: 'auto',
    padding: 12,

    '& .ant-space-item': {
      display: 'flex',
      justifyContent: 'center',
    },

    '& .ant-card-body': {
      padding: 8,
    },
  },
});
