import React from 'react';
import { Card } from 'antd';
import { createUseStyles } from 'react-jss';

import TaskWithDurationModel from '../../../modules/tasks/models/TaskWithDurationModel';
import { msToTime } from '../../../helpers/DateTime';

interface IHoursWithDurationProps {
  taskWithDuration: TaskWithDurationModel;
}

const HoursWithDuration: React.FC<IHoursWithDurationProps> = ({
  taskWithDuration,
}: IHoursWithDurationProps) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <div>{taskWithDuration.task.title}</div>
      <div>{msToTime(taskWithDuration.duration)}</div>
    </Card>
  );
};

const useStyles = createUseStyles({
  root: {
    width: 300,
    '& .ant-card-body': {
      padding: 8,
    },
  },
});

export default HoursWithDuration;
