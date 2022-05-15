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

const Timeline: FC = () => {
  const classes = useStyles();

  const tasks = useMemo(() => tasksStore.getTasksByDate(nowDate), []);
  const filteredTimeItems = useMemo(() => getTimeItems(tasks, nowDate), [
    tasks,
  ]);

  const data = useMemo(() => {
    const items = filteredTimeItems.map(({ task, time }) => [
      task.title,
      time.start,
      time.end || new Date(),
    ]);
    return [columns, ...items];
  }, [filteredTimeItems]);

  return (
    <div className={classes.main}>
      <Chart chartType="Timeline" data={data} height="100%" />;
    </div>
  );
};

export default memo(Timeline);

const useStyles = createUseStyles({
  main: {
    padding: 10,
  },
});
