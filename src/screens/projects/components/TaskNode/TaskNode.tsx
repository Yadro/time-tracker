import React, { useEffect, useRef, useState } from 'react';
import {
  CaretRightFilled,
  DeleteOutlined,
  PauseOutlined,
} from '@ant-design/icons';

import './TaskNode.less';

import TaskModel from '../../../../models/TaskModel';
import rootStore from '../../../../services/RootStore';
import { msToTime } from '../../../../helpers/DateTime';

const { tasksStore } = rootStore;

interface TaskNodeProps {
  model: TaskModel;
}

export default function TaskNode({ model }: TaskNodeProps) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const [duration, setDuration] = useState<string>('');

  useEffect(() => {
    const duration = model.duration;
    if (duration !== 0) {
      setDuration(msToTime(duration));
    }
    if (model.active) {
      intervalRef.current = setInterval(() => {
        setDuration(msToTime(model.duration));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [model.active]);

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
        <DeleteOutlined />
      </span>
    </div>
  );
}
