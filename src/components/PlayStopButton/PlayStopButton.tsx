import React, { SyntheticEvent } from 'react';
import { CaretRightFilled, PauseOutlined } from '@ant-design/icons';

import './PlayStopButton.less';

import CircleButton from '../CircleButton/CircleButton';
import rootStore from '../../services/RootStore';
import TaskModel from '../../models/TaskModel';
import cn from '../../helpers/ClassNameHelper';

const { tasksStore } = rootStore;

interface PlayStopButtonProps {
  task: TaskModel | undefined;
  className?: string;
}

export default function PlayStopButton({
  task,
  className,
}: PlayStopButtonProps) {
  function handleClick(e: SyntheticEvent) {
    e.stopPropagation();
    if (task) {
      if (!task?.active) {
        tasksStore.startTimer(task);
      } else {
        tasksStore.endTimer(task);
      }
    }
  }

  return (
    <CircleButton
      onClick={handleClick}
      className={cn('play-stop-button', className)}
    >
      {!task?.active ? (
        <CaretRightFilled className="play-stop-button__icon" />
      ) : (
        <PauseOutlined className="play-stop-button__icon" />
      )}
    </CircleButton>
  );
}
