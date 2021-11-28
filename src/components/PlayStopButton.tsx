import React, { SyntheticEvent, useCallback } from 'react';
import { CaretRightFilled, PauseOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import CircleButton from './CircleButton';
import rootStore from '../modules/RootStore';
import TaskModel from '../modules/tasks/models/TaskModel';

const { tasksStore } = rootStore;

interface PlayStopButtonProps {
  task: TaskModel | undefined;
  className?: string;
}

function PlayStopButton({ task, className }: PlayStopButtonProps) {
  const classes = useStyles();

  const toggleTask = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();
      if (task) {
        if (!task?.active) {
          tasksStore.startTimer(task);
        } else {
          tasksStore.stopTimer();
        }
      }
    },
    [task]
  );

  return (
    <CircleButton onClick={toggleTask} className={className}>
      {!task?.active ? (
        <CaretRightFilled className={classes.icon} />
      ) : (
        <PauseOutlined className={classes.icon} />
      )}
    </CircleButton>
  );
}

export default observer(PlayStopButton);

const useStyles = createUseStyles({
  icon: {
    color: 'white',
  },
});
