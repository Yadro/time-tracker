import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import IconTile from '../../../../../components/IconTile/IconTile';
import PlayStopButton from '../../../../../components/PlayStopButton/PlayStopButton';
import TaskModel from '../../../../../modules/tasks/models/TaskModel';
import * as TaskHooks from '../../../../../hooks/TaskHooks';
import { PURPLE_COLOR } from '../../../../../consts';

interface DurationProps {
  task?: TaskModel;
}
function Duration({ task }: DurationProps) {
  const classes = useStyle();
  const duration = TaskHooks.useTaskDuration(task, true);

  return (
    <div className={classes.root}>
      <IconTile backgroundColor={PURPLE_COLOR}>
        <ClockCircleOutlined style={{ color: 'white ' }} />
      </IconTile>
      <span className={classes.duration}>{duration}</span>
      <span className={classes.flex1} />
      <PlayStopButton task={task} />
    </div>
  );
}

export default observer(Duration);

const useStyle = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    paddingLeft: 8,
  },
  flex1: {
    flex: 1,
  },
});
