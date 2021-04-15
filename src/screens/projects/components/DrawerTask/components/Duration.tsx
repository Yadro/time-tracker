import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

import IconTile from '../../../../../components/IconTile/IconTile';
import PlayStopButton from '../../../../../components/PlayStopButton/PlayStopButton';
import TaskModel from '../../../../../models/TaskModel';
import { useTaskDuration } from '../../../../../hooks/TaskHooks';

interface DurationProps {
  task?: TaskModel;
}

export default observer(function Duration({ task }: DurationProps) {
  const duration = useTaskDuration(task);

  return (
    <div className="icon-with-value">
      <IconTile backgroundColor="#713A91">
        <ClockCircleOutlined style={{ color: 'white ' }} />
      </IconTile>
      <span className="value">{duration}</span>
      <span className="flex-1" />
      <PlayStopButton task={task} />
    </div>
  );
});
