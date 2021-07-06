import React from 'react';
import { observer } from 'mobx-react';
import { Space } from 'antd';

import * as TaskHooks from '../../../../hooks/TaskHooks';
import TaskTimeItemModel from '../../../../models/TaskTimeItemModel';
import {
  EIGHT_HOURS,
  estimateWorkingTimeEnd,
  getTime,
  msToTime,
} from '../../../../helpers/DateTime';
import LabelWithTooltip, { ILabelWithTooltipProps } from './LabelWithTooltip';

interface TotalHoursProps {
  timeItems: TaskTimeItemModel[];
}

const TotalHours = observer((props: TotalHoursProps) => {
  const { timeItems } = props;

  const { durationMs, restMs } = TaskHooks.useTimeItemsDuration(timeItems);
  const startWorkingTime = TaskHooks.useStartWorkingTime(timeItems);
  const estimatedWorkingTimeEnd = estimateWorkingTimeEnd(
    startWorkingTime,
    restMs
  );
  const restHoursMs = EIGHT_HOURS - durationMs;

  if (!timeItems.length) {
    return null;
  }

  const items: ILabelWithTooltipProps[] = [
    {
      label: getTime(startWorkingTime),
      tooltip: 'Start time',
    },
    {
      icon: 'mi-work-outline',
      label: msToTime(durationMs, false),
      tooltip: 'Working hours',
    },
    {
      icon: 'mi-local-cafe',
      label: msToTime(restMs, false),
      tooltip: 'Rest hours',
    },
    {
      icon: 'mi-notifications',
      label: getTime(estimatedWorkingTimeEnd),
      tooltip: 'Estimated end time',
    },
    {
      label: msToTime(restHoursMs, false),
      tooltip: 'Time left',
    },
  ];

  return (
    <Space size="middle">
      {items.map((props, index) => (
        <LabelWithTooltip key={index} {...props} />
      ))}
    </Space>
  );
});

export default TotalHours;
