import React, { useMemo } from 'react';
import { observer } from 'mobx-react';

import './TaskControl.less';

import rootStore from '../../../../services/RootStore';
import { useTaskDuration } from '../../../../hooks/TaskHooks';

const { tasksStore, projectStore } = rootStore;

export default observer(function TaskControl() {
  const activeTask = tasksStore.activeTask;
  const duration = useTaskDuration(activeTask);

  const project = useMemo(() => {
    return projectStore.get(activeTask?.projectId || '');
  }, [activeTask]);

  if (activeTask) {
    return (
      <div className="task-control">
        <div>{project?.title}</div>
        <div>{activeTask.title}</div>
        {duration}
      </div>
    );
  }
  return <div className="task-control">No active tasks</div>;
});
