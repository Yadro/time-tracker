import React, { useCallback, useMemo } from 'react';
import { Layout, Space } from 'antd';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';
import { isToday } from 'date-fns';

import rootStore from '../../modules/RootStore';
import { getTimeItems } from '../../helpers/TaskHelper';
import TotalHours from './components/TotalHours/TotalHours';
import Header from './components/Header';
import GridWithTimeItemsView from './components/GridWithTimeItemsView';
import TimelineScreen from './components/TimelineScreen';
import { HoursTabView } from './types';
import useLocalStorage from '../../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../../consts';
import BackOnToday from './components/BackOnToday';

const { tasksStore } = rootStore;

const parseDateFromString = (value: string) => new Date(value);

export default observer(function HoursScreen() {
  const classes = useStyles();

  const [date, setDate] = useLocalStorage<Date>(
    LOCAL_STORAGE_KEY.HOURS_SELECTED_DATE,
    new Date(),
    true,
    parseDateFromString
  );

  const goTodayDate = useCallback(() => {
    setDate(new Date());
  }, [setDate]);

  const [tab, setTab] = useLocalStorage<HoursTabView>(
    LOCAL_STORAGE_KEY.HOURS_TAB,
    HoursTabView.Edit,
    true
  );

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
        {!timeItems.length && !isToday(date) ? (
          <BackOnToday goToday={goTodayDate} />
        ) : tab === HoursTabView.Edit ? (
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
