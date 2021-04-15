import React, { SyntheticEvent } from 'react';
import { CaretRightFilled, PauseOutlined } from '@ant-design/icons';

import './PlayStopButton.less';

import CircleButton from '../CircleButton/CircleButton';
import rootStore from '../../services/RootStore';
import TaskModel from '../../models/TaskModel';

const { tasksStore } = rootStore;

interface PlayStopButtonProps {
  task: TaskModel | undefined;
}

export default function PlayStopButton({ task }: PlayStopButtonProps) {
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
    <CircleButton onClick={handleClick} className="play-stop-button">
      {!task?.active ? (
        <CaretRightFilled className="play-stop-button__icon" />
      ) : (
        <PauseOutlined className="play-stop-button__icon" />
      )}
    </CircleButton>
  );
}
