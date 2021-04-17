import React from 'react';
import { observer } from 'mobx-react';

import { useTimeItemsDuration } from '../../../../hooks/TaskHooks';
import TaskTimeItemModel from '../../../../models/TaskTimeItemModel';

interface TotalHoursProps {
  timeItems: TaskTimeItemModel[];
}

export default observer(function TotalHours({ timeItems }: TotalHoursProps) {
  const duration = useTimeItemsDuration(timeItems);
  return <div>{duration}</div>;
});
