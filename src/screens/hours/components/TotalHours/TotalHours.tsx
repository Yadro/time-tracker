import React from 'react';
import { observer } from 'mobx-react';

import * as TaskHooks from '../../../../hooks/TaskHooks';
import TaskTimeItemModel from '../../../../models/TaskTimeItemModel';

interface TotalHoursProps {
  timeItems: TaskTimeItemModel[];
}

export default observer(function TotalHours({ timeItems }: TotalHoursProps) {
  const duration = TaskHooks.useTimeItemsDuration(timeItems);
  return <div>{duration}</div>;
});
