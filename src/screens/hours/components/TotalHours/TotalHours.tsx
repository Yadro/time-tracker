import React from 'react';
import { observer } from 'mobx-react';
import { Space, Tooltip } from 'antd';

import * as TaskHooks from '../../../../hooks/TaskHooks';
import TaskTimeItemModel from '../../../../models/TaskTimeItemModel';
import {
  EIGHT_HOURS,
  estimateWorkingTimeEnd,
  getTime,
  msToTime,
} from '../../../../helpers/DateTime';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';
import LabelWithTooltip, { ILabelWithTooltipProps } from './LabelWithTooltip';

interface TotalHoursProps {
  timeItems: TaskTimeItemModel[];
}

const TotalHours = observer((props: TotalHoursProps) => {
  const { timeItems } = props;
  const classes = useStyle();

  const { durationMs, gapsMs } = TaskHooks.useTimeItemsDuration(timeItems);
  const startWorkingTime = TaskHooks.useStartWorkingTime(timeItems);
  const estimatedWorkingTimeEnd = estimateWorkingTimeEnd(
    startWorkingTime,
    gapsMs
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
      label: msToTime(gapsMs, false),
      tooltip: 'Rest hours',
    },
    {
      icon: 'mi-notifications',
      label: getTime(estimatedWorkingTimeEnd),
      tooltip: 'Estimated end of working hours',
    },
    {
      label: msToTime(restHoursMs, false),
      tooltip: 'Left to work',
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

const useStyle = createUseStyles({
  iconAndLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    color: '#5f6368',
    marginRight: 4,
  },
});

export default TotalHours;
