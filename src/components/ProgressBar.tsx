import React, { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { Slider } from 'antd';
import { isSameDay } from 'date-fns';
import { createUseStyles } from 'react-jss';

import rootStore from '../modules/RootStore';
import { useInterval } from '../hooks/UseInterval';
import { getStartWorkingTime, getTimeItems } from '../helpers/TaskHelper';
import TaskTimeService from '../services/TaskTimeService';
import { toTimeFormat } from '../helpers/DateTime';

const { tasksStore, settingsStore } = rootStore;

function ProgressBar() {
  const { settings } = settingsStore;
  const workingHoursMs = settings.numberOfWorkingHours;

  const style = useStyle();

  const [dayUpdateEveryDay, setDayUpdateEveryDay] = useState(new Date());
  const [_tick, setTick] = useState(new Date());

  const shouldDayUpdate = useCallback(() => {
    const now = new Date();
    setTick(now);
    if (!isSameDay(dayUpdateEveryDay, now)) {
      setDayUpdateEveryDay(now);
    }
  }, [dayUpdateEveryDay]);

  useInterval(shouldDayUpdate, 1000);

  const tasksByProject = useMemo(() => Object.values(tasksStore.tasks), [
    tasksStore.tasks,
    tasksStore.versionHash,
  ]);

  const tasks = useMemo(() => tasksStore.getTasksByDate(dayUpdateEveryDay), [
    tasksByProject,
    dayUpdateEveryDay,
  ]);

  const timeItems = useMemo(() => getTimeItems(tasks, dayUpdateEveryDay), [
    tasks,
    dayUpdateEveryDay,
  ]);

  const workingTimeStart = useMemo(() => getStartWorkingTime(timeItems), [
    timeItems,
  ]);

  const timeRangeItems = useMemo(() => timeItems.map((t) => t.time), [
    timeItems,
  ]);

  const {
    estimatedWorkingTimeEnd,
    progress,
    realProgress,
  } = TaskTimeService.getDayProgress(
    timeRangeItems,
    workingTimeStart,
    workingHoursMs
  );

  const marks: Record<number, string> = {
    0: toTimeFormat(workingTimeStart),
    100: toTimeFormat(estimatedWorkingTimeEnd),
  };
  if (progress > 10 && progress < 90) {
    marks[progress] = `${realProgress}%`;
  }

  const tipFormatter = useMemo(() => {
    if (progress <= 10 || progress >= 90) {
      return () => `${realProgress}%`;
    }
    return null;
  }, [progress, realProgress]);

  return (
    <Slider
      marks={marks}
      value={progress}
      className={style.slider}
      tipFormatter={tipFormatter}
    />
  );
}

const useStyle = createUseStyles({
  slider: {
    '& .ant-slider-mark': {
      '& .ant-slider-mark-text': {
        color: 'white',
      },
    },
  },
});

export default observer(ProgressBar);
