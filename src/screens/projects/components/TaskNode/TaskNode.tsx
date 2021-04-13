import React from 'react';
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

  return (
    <div className="task-node">
      <span className="task-title">{model.title}</span>
      <span>{duration}</span>
      <span className="task-node__actions">
        {!model.active ? (
          <CaretRightFilled onClick={() => tasksStore.startTimer(model)} />
        ) : (
          <PauseOutlined onClick={() => tasksStore.endTimer(model)} />
        )}
        <DeleteOutlined onClick={() => tasksStore.delete(model)} />
      </span>
    </div>
  );
}
