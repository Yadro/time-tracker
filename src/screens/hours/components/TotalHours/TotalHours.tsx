import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import { Space } from 'antd';

import * as TaskHooks from '../../../../hooks/TaskHooks';
import TaskTimeItemModel from '../../../../modules/tasks/models/TaskTimeItemModel';
import {
  estimateWorkingTimeEnd,
  toTimeFormat,
  msToTime,
  getRestHoursMs,
} from '../../../../helpers/DateTime';
import LabelWithTooltip, { ILabelWithTooltipProps } from './LabelWithTooltip';
import rootStore from '../../../../modules/RootStore';
import { getStartWorkingTime } from '../../../../helpers/TaskHelper';

interface TotalHoursProps {
  timeItems: TaskTimeItemModel[];
}

const { settingsStore } = rootStore;

const TotalHours = observer((props: TotalHoursProps) => {
  const { timeItems } = props;
  const { settings } = settingsStore;
  const workingHoursMs = settings.numberOfWorkingHours;

  const { durationMs, restMs } = TaskHooks.useTimeItemsDuration(timeItems);
  const startWorkingTime = useMemo(() => getStartWorkingTime(timeItems), [
    timeItems,
  ]);
  const estimatedWorkingTimeEnd = estimateWorkingTimeEnd(
    startWorkingTime,
    restMs,
    workingHoursMs
  );
  const restHoursMs = getRestHoursMs(workingHoursMs, durationMs);

  const items: ILabelWithTooltipProps[] = useMemo(
    () => [
      {
        label: toTimeFormat(startWorkingTime),
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
        label: toTimeFormat(estimatedWorkingTimeEnd),
        tooltip: 'Estimated end time',
      },
      {
        label: msToTime(restHoursMs, false),
        tooltip: 'Time left',
      },
    ],
    [startWorkingTime, durationMs, restMs, estimatedWorkingTimeEnd, restHoursMs]
  );

  if (!timeItems.length) {
    return null;
  }

  return (
    <Space size="middle">
      {items.map((props, index) => (
        <LabelWithTooltip key={index} {...props} />
      ))}
    </Space>
  );
});

export default TotalHours;
