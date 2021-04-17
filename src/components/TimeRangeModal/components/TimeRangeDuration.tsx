import React from 'react';

import { useTimeRangeDuration } from '../../../hooks/TaskHooks';
import { ITimeRangeModel } from '../../../models/TaskModel';

interface TimeRangeDurationProps {
  timeRange?: ITimeRangeModel;
}

export default function TimeRangeDuration({
  timeRange,
}: TimeRangeDurationProps) {
  const duration = useTimeRangeDuration(timeRange);

  return <div>{duration}</div>;
}
