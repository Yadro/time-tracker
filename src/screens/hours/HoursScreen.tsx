import React, { useMemo, useState } from 'react';
import { Layout, Space } from 'antd';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import rootStore from '../../modules/RootStore';
import { getTimeItems } from '../../helpers/TaskHelper';
import TotalHours from './components/TotalHours/TotalHours';
import Header from './components/Header';
import EditableTimeItemsView from './components/EditableTimeItemsView';

const { tasksStore } = rootStore;

export default observer(function HoursScreen() {
  const classes = useStyles();
  const [date, setDate] = useState<Date>(new Date());

  const tasks = useMemo(() => tasksStore.getTasksByDate(date), [
    tasksStore.tasks,
    date,
  ]);
  const timeItems = getTimeItems(tasks, date);

  return (
    <Layout className={classes.hours}>
      <Space direction="vertical">
        <Header date={date} setDate={setDate} />
        <TotalHours timeItems={timeItems} />
        <EditableTimeItemsView date={date} />
      </Space>
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
