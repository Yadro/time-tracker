import React from 'react';
import { observer } from 'mobx-react';
import { Space } from 'antd';

import * as TaskHooks from '../../../../hooks/TaskHooks';
import TaskTimeItemModel from '../../../../models/TaskTimeItemModel';
import {
  estimateWorkingTimeEnd,
  getTime,
  msToTime,
} from '../../../../helpers/DateTime';

interface TotalHoursProps {
  timeItems: TaskTimeItemModel[];
}

export default observer(function TotalHours({ timeItems }: TotalHoursProps) {
  const { durationMs, gapsMs } = TaskHooks.useTimeItemsDuration(timeItems);
  const startWorkingTime = TaskHooks.useStartWorkingTime(timeItems);
  const estimatedWorkingTimeEnd = estimateWorkingTimeEnd(
    startWorkingTime,
    gapsMs
  );

  return (
    <Space>
      <span>{getTime(startWorkingTime)}</span>
      <span>{msToTime(durationMs, false)}</span>
      <span>{msToTime(gapsMs, false)}</span>
      <span>{getTime(estimatedWorkingTimeEnd)}</span>
    </Space>
  );
});
