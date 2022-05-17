import React, { useMemo, useState } from 'react';
import { Layout, Space } from 'antd';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import rootStore from '../../modules/RootStore';
import { getTimeItems } from '../../helpers/TaskHelper';
import TotalHours from './components/TotalHours/TotalHours';
import Header from './components/Header';
import GridWithTimeItemsView from './components/GridWithTimeItemsView';
import { HoursTabView } from './types';
import TimelineScreen from './components/TimelineScreen';

const { tasksStore } = rootStore;

export default observer(function HoursScreen() {
  const classes = useStyles();
  const [date, setDate] = useState<Date>(new Date());
  const [tab, setTab] = useState<HoursTabView>(HoursTabView.Edit);

  const tasks = useMemo(() => tasksStore.getTasksByDate(date), [
    tasksStore.tasks,
    date,
  ]);
  const timeItems = getTimeItems(tasks, date);

  return (
    <Layout className={classes.hoursView}>
      <Space direction="vertical" className={classes.space}>
        <Header date={date} setDate={setDate} tab={tab} setTab={setTab} />
        <TotalHours timeItems={timeItems} />
        {tab === HoursTabView.Edit ? (
          <GridWithTimeItemsView date={date} />
        ) : (
          <TimelineScreen date={date} />
        )}
      </Space>
    </Layout>
  );
});

const useStyles = createUseStyles({
  hoursView: {
    overflowY: 'auto',
    padding: 12,
  },
  space: {
    flex: 1,

    '& .ant-space-item': {
      display: 'flex',
      justifyContent: 'center',
    },

    '& .ant-space-item:last-child': {
      flex: 1,
    },
  },
});
