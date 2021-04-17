import React from 'react';

import { useTimeItemsDuration } from '../../../hooks/TaskHooks';
import TaskTimeItemModel from '../../../models/TaskTimeItemModel';

interface TimeRangeDurationProps {
  taskTimeItem?: TaskTimeItemModel;
}

export default function TimeRangeDuration({
  taskTimeItem,
}: TimeRangeDurationProps) {
  const duration = useTimeItemsDuration(
    taskTimeItem ? [taskTimeItem] : [],
    true
  );

  return <div>{duration}</div>;
}
