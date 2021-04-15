import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import { PauseOutlined } from '@ant-design/icons';

import './TaskControl.less';

import rootStore from '../../../../services/RootStore';
import { useTaskDuration } from '../../../../hooks/TaskHooks';
import CircleButton from '../../../../components/CircleButton/CircleButton';

const { tasksStore, projectStore } = rootStore;

export default observer(function TaskControl() {
  const task = tasksStore.activeTask;
  const duration = useTaskDuration(task);

  const project = useMemo(() => {
    return projectStore.get(task?.projectId || '');
  }, [task]);

  if (task) {
    return (
      <span className="task-control">
        <div className="task-control__info">
          <span className="task-control__project">{project?.title}</span>
          <span>{task.title}</span>
        </div>
        <span className="task-control__duration">{duration}</span>
        <CircleButton onClick={() => tasksStore.stopTimer(task)}>
          <PauseOutlined />
        </CircleButton>
      </span>
    );
  }
  return <span className="task-control">No active tasks</span>;
});
