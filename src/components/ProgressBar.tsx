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

  useInterval(shouldDayUpdate);

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
  ]);

  const workingTimeStart = useMemo(() => getStartWorkingTime(timeItems), [
    timeItems,
  ]);

  const timeRangeItems = useMemo(() => timeItems.map((t) => t.time), [
    timeItems,
  ]);

  const { estimatedWorkingTimeEnd, progress } = TaskTimeService.getDayProgress(
    timeRangeItems,
    workingTimeStart,
    workingHoursMs
  );

  const progressRound = Math.round(progress);
  const marks: Record<number, string> = {
    0: toTimeFormat(workingTimeStart),
    100: toTimeFormat(estimatedWorkingTimeEnd),
  };
  if (progressRound > 10 && progressRound < 90) {
    marks[progressRound] = `${progressRound}%`;
  }

  const tipFormatter = useMemo(() => {
    if (progressRound <= 10 || progressRound >= 90) {
      return (value?: number) => `${value}%`;
    }
    return null;
  }, [progressRound]);

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
