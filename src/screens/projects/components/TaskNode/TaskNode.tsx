import React, { SyntheticEvent, useCallback } from 'react';
import {
  CaretRightFilled,
  DeleteOutlined,
  EnterOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import TaskModel from '../../../../modules/tasks/models/TaskModel';
import rootStore from '../../../../modules/RootStore';
import * as TaskHooks from '../../../../hooks/TaskHooks';

const { tasksStore } = rootStore;

interface TaskNodeProps {
  task: TaskModel;
}

export default observer(function TaskNode({ task }: TaskNodeProps) {
  const classes = useStyle();

  const duration = TaskHooks.useTaskDuration(task);

  const preventDefault = useCallback((fn: () => void) => {
    return (e: SyntheticEvent) => {
      e.stopPropagation();
      fn();
    };
  }, []);

  return (
    <div className={classes.taskNode}>
      <span className={classes.taskTitle}>{task.title}</span>
      <span>{duration}</span>
      <span className={classes.taskNodeActions}>
        <EnterOutlined
          onClick={preventDefault(() => tasksStore.addToMyDay(task))}
        />
        {!task.active ? (
          <CaretRightFilled
            onClick={preventDefault(() => tasksStore.startTimer(task))}
          />
        ) : (
          <PauseOutlined
            onClick={preventDefault(() => tasksStore.stopTimer())}
          />
        )}
        <DeleteOutlined
          onClick={preventDefault(() => tasksStore.delete(task))}
        />
      </span>
    </div>
  );
});

const useStyle = createUseStyles({
  taskNode: {
    display: 'flex',

    '&:hover $taskNodeActions': {
      display: 'inline',
    },
  },
  taskNodeActions: {
    display: 'none',
  },
  taskTitle: {
    flex: 1,
  },
});
