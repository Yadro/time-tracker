import React from 'react';
import { observer } from 'mobx-react';

import { useTimeItemsDuration } from '../../../../hooks/TaskHooks';
import TaskTimeModel from '../../../../models/TaskTimeModel';

interface TotalHoursProps {
  timeItems: TaskTimeModel[];
}

export default observer(function TotalHours({ timeItems }: TotalHoursProps) {
  const duration = useTimeItemsDuration(timeItems);
  return <div>{duration}</div>;
});
