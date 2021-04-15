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
  onClick: (taskTime: TaskTimeModel) => void;
}

export default observer(function HoursCard({
  taskTime,
  onClick,
}: HoursCardProps) {
  const { task, time } = taskTime;

  return (
    <Card className="hours-card" onClick={() => onClick(taskTime)}>
      <div className="hours-card__info">
        <div className="hours-card__title">{task.title}</div>
        <div className="hours-card__description">{time.description}</div>
        <div className="hours-card__time">{`${timeFormat(
          time.start
        )} - ${timeFormat(time.end)}`}</div>
      </div>
      <PlayStopButton task={task} />
    </Card>
  );
});
