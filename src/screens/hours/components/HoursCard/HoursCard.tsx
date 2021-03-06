import React, { useMemo } from 'react';
import { Card } from 'antd';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import TaskTimeItemModel from '../../../../modules/tasks/models/TaskTimeItemModel';
import PlayStopButton from '../../../../components/PlayStopButton';
import rootStore from '../../../../modules/RootStore';
import { msToTime, toTimeFormat } from '../../../../helpers/DateTime';
import { getTaskTitlesPath } from '../../../../helpers/TaskHelper';

const { projectStore } = rootStore;

interface HoursCardProps {
  taskTime: TaskTimeItemModel;
  onClick: (taskTime: TaskTimeItemModel) => void;
}

export default observer(function HoursCard({
  taskTime,
  onClick,
}: HoursCardProps) {
  const { task, time } = taskTime;
  const classes = useStyle();
  const project = useMemo(() => projectStore.get(task.projectId), [task]);
  const duration = useMemo(
    () => (time.end ? msToTime(time.end.getTime() - time.start.getTime()) : ''),
    [time.end, time.start]
  );
  const titlePath = useMemo(() => getTaskTitlesPath(task), [task]);

  return (
    <Card
      className={classes.root}
      onClick={() => onClick(taskTime)}
      style={
        project?.color ? { borderLeft: `4px solid ${project?.color}` } : {}
      }
    >
      <div className={classes.hoursCard}>
        <div className={classes.projectTitle}>{project?.title}</div>
        <div className={classes.taskTitlePath}>{titlePath}</div>
        <div className={classes.taskTitle}>{task.title}</div>
        <div className={classes.description}>{time.description}</div>
        <div className={classes.timeContainer}>
          <div className={classes.time}>
            {`${toTimeFormat(time.start)} - ${toTimeFormat(time.end)}`}
          </div>
          <div className={classes.time}>{duration}</div>
        </div>
      </div>
      <PlayStopButton className={classes.playButton} task={task} />
    </Card>
  );
});

const useStyle = createUseStyles({
  root: {
    width: 300,
    margin: 4,

    '& .ant-card-body': {
      display: 'flex',
      flexDirection: 'row',
      cursor: 'pointer',
    },

    '&:hover $playButton': {
      display: 'inline-flex',
    },
  },
  hoursCard: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 12,
  },
  taskTitlePath: {
    fontSize: 12,
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  description: {
    fontSize: 11,
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    fontSize: 11,
  },
  playButton: {
    display: 'none',
    position: 'absolute',
    right: 8,
  },
});
