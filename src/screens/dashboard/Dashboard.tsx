import React, { useMemo, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Layout, Space } from 'antd';
import { observer } from 'mobx-react';

import SelectDate from '../../components/SelectDate/SelectDate';
import rootStore from '../../services/RootStore';
import { getTasksWithTotalTimeForDay } from '../../helpers/TaskHelper';
import HoursWithDuration from './components/HoursWithDuration';

const { tasksStore } = rootStore;

const Dashboard: React.FC = observer(() => {
  const classes = useStyles();

  const [date, setDate] = useState<Date>(new Date());
  const tasks = useMemo(() => tasksStore.getTasksByDate(date), [date]);
  const tasksWithDuration = useMemo(
    () => getTasksWithTotalTimeForDay(tasks, date),
    [tasks, date]
  );

  return (
    <Layout className={classes.root}>
      <Space direction="vertical">
        <div className={classes.selectDate}>
          <SelectDate date={date} onChange={setDate} />
        </div>
        {tasksWithDuration.map((tasksWithDuration) => (
          <HoursWithDuration
            key={tasksWithDuration.task.key}
            taskWithDuration={tasksWithDuration}
          />
        ))}
      </Space>
    </Layout>
  );
});

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    overflowY: 'auto',
    padding: 12,
  },
  selectDate: {
    display: 'flex',
    justifyContent: 'center',
  },
});

export default Dashboard;
