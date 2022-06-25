import React, { FC, memo, useMemo } from 'react';
import { Chart } from 'react-google-charts';
import { createUseStyles } from 'react-jss';

import rootStore from '../../../modules/RootStore';
import { getTimeItems } from '../../../helpers/TaskHelper';
import TaskTimeItemModel from '../../../modules/tasks/models/TaskTimeItemModel';

const { tasksStore } = rootStore;

const columns = [
  { type: 'string', id: 'Task' },
  { type: 'date', id: 'Start' },
  { type: 'date', id: 'End' },
];

function mapTimeItemToChartItem({ task, time }: TaskTimeItemModel): any[] {
  return [task.title || '-', time.start || new Date(), time.end || new Date()];
}

type Props = {
  date: Date;
};

const Timeline: FC<Props> = ({ date }: Props) => {
  const classes = useStyles();

  const data = useMemo(() => {
    const tasks = tasksStore.getTasksByDate(date);
    const filteredTimeItems = getTimeItems(tasks, date);
    const items = filteredTimeItems.map(mapTimeItemToChartItem);
    if (items.length === 0) {
      return undefined;
    }
    return [columns, ...items];
  }, [date]);

  if (!data) {
    return null;
  }

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
    display: 'flex',
    flex: 1,
    height: '100%',
  },
});
