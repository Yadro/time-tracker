import React, { SyntheticEvent } from 'react';
import {
  CaretRightFilled,
  DeleteOutlined,
  PauseOutlined,
} from '@ant-design/icons';

import './TaskNode.less';

import TaskModel from '../../../../models/TaskModel';
import rootStore from '../../../../services/RootStore';
import { useTaskDuration } from '../../../../hooks/TaskHooks';

const { tasksStore } = rootStore;

interface TaskNodeProps {
  model: TaskModel;
}

export default function TaskNode({ model }: TaskNodeProps) {
  const duration = useTaskDuration(model);

  function preventDefault(fn: () => void) {
    return (e: SyntheticEvent) => {
      e.stopPropagation();
      fn();
    };
  }

  return (
    <div className="task-node">
      <span className="task-title">{model.title}</span>
      <span>{duration}</span>
      <span className="task-node__actions">
        {!model.active ? (
          <CaretRightFilled
            onClick={preventDefault(() => tasksStore.startTimer(model))}
          />
        ) : (
          <PauseOutlined
            onClick={preventDefault(() => tasksStore.endTimer(model))}
          />
        )}
        <DeleteOutlined
          onClick={preventDefault(() => tasksStore.delete(model))}
        />
      </span>
    </div>
  );
}
