import React from 'react';

import * as TaskHooks from '../../../hooks/TaskHooks';
import { ITimeRangeModel } from '../../../modules/tasks/models/TaskModel';

interface TimeRangeDurationProps {
  timeRange?: ITimeRangeModel;
}

export default function TimeRangeDuration({
  timeRange,
}: TimeRangeDurationProps) {
  const duration = TaskHooks.useTimeRangeDuration(timeRange);

  return <div>{duration}</div>;
}
