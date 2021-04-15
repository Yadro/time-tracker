import React from 'react';

import { useTimeItemsDuration } from '../../../../hooks/TaskHooks';
import TaskTimeModel from '../../../../models/TaskTimeModel';

interface TotalHoursProps {
  timeItems: TaskTimeModel[];
}

export default function TotalHours({ timeItems }: TotalHoursProps) {
  const duration = useTimeItemsDuration(timeItems);
  return <div>{duration}</div>;
}
