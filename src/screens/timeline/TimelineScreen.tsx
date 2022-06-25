import React, { FC, memo, useMemo } from 'react';
import { Chart } from 'react-google-charts';
import { createUseStyles } from 'react-jss';

import rootStore from '../../modules/RootStore';
import { getTimeItems } from '../../helpers/TaskHelper';

const { tasksStore } = rootStore;

const columns = [
  { type: 'string', id: 'Task' },
  { type: 'date', id: 'Start' },
  { type: 'date', id: 'End' },
];

const nowDate = new Date();
// TODO remove
const Timeline: FC = () => {
  const classes = useStyles();

  const data = useMemo(() => {
    const tasks = tasksStore.getTasksByDate(nowDate);
    const filteredTimeItems = getTimeItems(tasks, nowDate);
    const items = filteredTimeItems.map(({ task, time }) => [
      task.title || '-',
      time.start || new Date(),
      time.end || new Date(),
    ]);
    return [columns, ...items];
  }, []);

  return (
    <div className={classes.main}>
      <Chart
        style={{ flex: 1 }}
        chartType="Timeline"
        data={data}
        height="100%"
      />
    </div>
  );
};

export default memo(Timeline);

const useStyles = createUseStyles({
  main: {
    padding: 10,
    display: 'flex',
    height: '100%',
  },
});
