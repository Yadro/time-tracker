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
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

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

  return (
    <Space>
      <span>{getTime(startWorkingTime)}</span>
      <div>
        <span className={clsx('mi mi-work-outline', classes.icon)} />
        <span>{msToTime(durationMs, false)}</span>
      </div>
      <div>
        <span className={clsx('mi mi-local-cafe', classes.icon)} />
        <span>{msToTime(gapsMs, false)}</span>
      </div>
      <div>
        <span className={clsx('mi mi-notifications', classes.icon)} />
        <span>{getTime(estimatedWorkingTimeEnd)}</span>
      </div>
      <span>{msToTime(restHoursMs, false)}</span>
    </Space>
  );
});

const useStyle = createUseStyles({
  icon: {
    fontSize: 18,
  },
});

export default TotalHours;
