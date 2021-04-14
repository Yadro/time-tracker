import React from 'react';
import { Card } from 'antd';
import format from 'date-fns/format';
import { observer } from 'mobx-react';

import './HoursCard.less';

import TaskTimeModel from '../../../../models/TaskTimeModel';
import PlayStopButton from '../../../../components/PlayStopButton/PlayStopButton';

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

export default observer(function HoursCard({ taskTime }: HoursCardProps) {
  const { task, time } = taskTime;

  return (
    <Card className="hours-card">
      <div className="hours-card__info">
        <div>{task.title}</div>
        <div>{`${timeFormat(time.start)} - ${timeFormat(time.end)}`}</div>
      </div>
      <PlayStopButton task={task} />
    </Card>
  );
});
