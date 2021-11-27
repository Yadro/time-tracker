import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import rootStore from '../../modules/RootStore';
import * as TaskHooks from '../../hooks/TaskHooks';
import PlayStopButton from '../PlayStopButton/PlayStopButton';
import { PURPLE_COLOR } from '../../consts';

const { tasksStore, projectStore } = rootStore;

function TaskControl() {
  const styles = useStyles();
  const task = tasksStore.activeTask;
  const duration = TaskHooks.useTaskDuration(task);

  const project = useMemo(() => {
    return projectStore.get(task?.projectId || '');
  }, [task]);

  if (task) {
    return (
      <span className={styles.root}>
        <div className={styles.info}>
          <span className={styles.project}>{project?.title}</span>
          <span>{task.title}</span>
        </div>
        <span className={styles.duration}>{duration}</span>
        <PlayStopButton task={task} />
      </span>
    );
  }
  return <span className={styles.root}>No active tasks</span>;
}

export default observer(TaskControl);

const useStyles = createUseStyles({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '44px',
    marginLeft: '20px',
    padding: '8px',
    borderRadius: '5px',
    lineHeight: '16px',
    color: 'white',
    backgroundColor: PURPLE_COLOR,
  },
  project: {
    fontSize: '12px',
  },
  info: {
    display: 'inline-flex',
    flex: 1,
    flexDirection: 'column',
    marginRight: '8px',
    width: '140px',
    '& span': {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  },
  duration: {
    marginRight: '8px',
  },
});
