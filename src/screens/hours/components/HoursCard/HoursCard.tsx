import React, { useMemo } from 'react';
import { Card } from 'antd';
import format from 'date-fns/format';
import { observer } from 'mobx-react';

import './HoursCard.less';

import TaskTimeModel from '../../../../models/TaskTimeModel';
import PlayStopButton from '../../../../components/PlayStopButton/PlayStopButton';
import rootStore from '../../../../services/RootStore';
import { msToTime } from '../../../../helpers/DateTime';

const { projectStore } = rootStore;

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
  const project = useMemo(() => projectStore.get(task.projectId), [task]);
  const duration = time.end
    ? msToTime(time.end.getTime() - time.start.getTime())
    : '';

  return (
    <Card
      className="hours-card"
      onClick={() => onClick(taskTime)}
      style={
        project?.color ? { borderLeft: `4px solid ${project?.color}` } : {}
      }
    >
      <div className="hours-card__info">
        <div className="project-title">{project?.title}</div>
        <div className="task-title">{task.title}</div>
        <div className="description">{time.description}</div>
        <div className="time-container">
          <div className="time">{`${timeFormat(time.start)} - ${timeFormat(
            time.end
          )}`}</div>
          <div className="time">{duration}</div>
        </div>
      </div>
      <PlayStopButton task={task} />
    </Card>
  );
});
