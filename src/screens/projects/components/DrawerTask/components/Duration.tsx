import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import IconTile from '../../../../../components/IconTile/IconTile';
import PlayStopButton from '../../../../../components/PlayStopButton/PlayStopButton';
import TaskModel from '../../../../../models/TaskModel';
import * as TaskHooks from '../../../../../hooks/TaskHooks';

interface DurationProps {
  task?: TaskModel;
}

export default observer(function Duration({ task }: DurationProps) {
  const classes = useStyle();
  const duration = TaskHooks.useTaskDuration(task);

  return (
    <div className={classes.root}>
      <IconTile backgroundColor="#713A91">
        <ClockCircleOutlined style={{ color: 'white ' }} />
      </IconTile>
      <span className={classes.duration}>{duration}</span>
      <span className="flex-1" />
      <PlayStopButton task={task} />
    </div>
  );
});

const useStyle = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    paddingLeft: 8,
  },
});
