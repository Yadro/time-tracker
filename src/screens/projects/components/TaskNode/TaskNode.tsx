import React from 'react';
import { CaretRightFilled, DeleteOutlined } from '@ant-design/icons';
import TaskModel from '../../../../models/TaskModel';
import './TaskNode.less';

interface TaskNodeProps {
  model: TaskModel;
}

export default function TaskNode({ model }: TaskNodeProps) {
  return (
    <div className="task-node">
      <span className="task-title">{model.title}</span>
      <span className="task-node__actions">
        <CaretRightFilled />
        <DeleteOutlined />
      </span>
    </div>
  );
}
