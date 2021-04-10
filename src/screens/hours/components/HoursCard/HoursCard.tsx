import React from 'react';
import { Card } from 'antd';

import TaskTimeModel from '../../../../models/TaskTimeModel';
import format from 'date-fns/format';

const formatStr = 'HH:mm';
function timeFormat(date: Date | undefined) {
  if (date) {
    return format(date, formatStr);
  }
  return '';
}

interface HoursCardProps {
  taskTime: TaskTimeModel;
}

export default function HoursCard({ taskTime }: HoursCardProps) {
  return (
    <Card style={{ width: 300 }}>
      <div>{taskTime.task.title}</div>
      <div>
        {`${timeFormat(taskTime.time[0])} - ${timeFormat(taskTime.time[1])}`}
      </div>
    </Card>
  );
}
