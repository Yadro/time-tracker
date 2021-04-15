import React, { SyntheticEvent } from 'react';
import {
  CaretRightFilled,
  DeleteOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react';

import './TaskNode.less';

import TaskModel from '../../../../models/TaskModel';
import rootStore from '../../../../services/RootStore';
import { useTaskDuration } from '../../../../hooks/TaskHooks';

const { tasksStore } = rootStore;

interface TaskNodeProps {
  task: TaskModel;
}

export default observer(function TaskNode({ task }: TaskNodeProps) {
  const duration = useTaskDuration(task);

  function preventDefault(fn: () => void) {
    return (e: SyntheticEvent) => {
      e.stopPropagation();
      fn();
    };
  }

  return (
    <div className="task-node">
      <span className="task-title">{task.title}</span>
      <span>{duration}</span>
      <span className="task-node__actions">
        {!task.active ? (
          <CaretRightFilled
            onClick={preventDefault(() => tasksStore.startTimer(task))}
          />
        ) : (
          <PauseOutlined
            onClick={preventDefault(() => tasksStore.stopTimer(task))}
          />
        )}
        <DeleteOutlined
          onClick={preventDefault(() => tasksStore.delete(task))}
        />
      </span>
    </div>
  );
});
