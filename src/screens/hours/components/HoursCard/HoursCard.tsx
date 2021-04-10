import React from 'react';
import { Card } from 'antd';
import format from 'date-fns/format';
import { observer } from 'mobx-react';

import './HoursCard.less';

import TaskTimeModel from '../../../../models/TaskTimeModel';
import CircleButton from '../../../../components/CircleButton/CircleButton';
import { CaretRightFilled, PauseOutlined } from '@ant-design/icons';
import rootStore from '../../../../services/RootStore';

const formatStr = 'HH:mm';
function timeFormat(date: Date | undefined) {
  if (date) {
    return format(date, formatStr);
  }
  return '';
}

const { tasksStore } = rootStore;

interface HoursCardProps {
  taskTime: TaskTimeModel;
}

export default observer(function HoursCard({ taskTime }: HoursCardProps) {
  const { task, time } = taskTime;

  function handleClick() {
    if (!task.active) {
      tasksStore.startTimer(task);
    } else {
      tasksStore.endTimer(task);
    }
  }

  return (
    <Card className="hours-card">
      <div className="hours-card__info">
        <div>{task.title}</div>
        <div>{`${timeFormat(time[0])} - ${timeFormat(time[1])}`}</div>
      </div>
      <CircleButton onClick={handleClick} className="hours-card__button">
        {!task.active ? (
          <CaretRightFilled className="hours-card__icon" />
        ) : (
          <PauseOutlined className="hours-card__icon" />
        )}
      </CircleButton>
    </Card>
  );
});
