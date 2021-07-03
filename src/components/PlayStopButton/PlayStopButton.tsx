import React, { SyntheticEvent } from 'react';
import { CaretRightFilled, PauseOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { createUseStyles } from 'react-jss';

import CircleButton from '../CircleButton/CircleButton';
import rootStore from '../../modules/RootStore';
import TaskModel from '../../modules/tasks/models/TaskModel';

const { tasksStore } = rootStore;

interface PlayStopButtonProps {
  task: TaskModel | undefined;
  className?: string;
}

export default observer(function PlayStopButton({
  task,
  className,
}: PlayStopButtonProps) {
  const classes = useStyles();

  function handleClick(e: SyntheticEvent) {
    e.stopPropagation();
    if (task) {
      if (!task?.active) {
        tasksStore.startTimer(task);
      } else {
        tasksStore.stopTimer(task);
      }
    }
  }

  return (
    <CircleButton
      onClick={handleClick}
      className={clsx('play-stop-button', className)}
    >
      {!task?.active ? (
        <CaretRightFilled className={classes.icon} />
      ) : (
        <PauseOutlined className={classes.icon} />
      )}
    </CircleButton>
  );
});

const useStyles = createUseStyles({
  icon: {
    color: 'white',
  },
});
