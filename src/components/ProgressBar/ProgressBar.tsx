import React, { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { Slider } from 'antd';
import { isSameDay } from 'date-fns';

import rootStore from '../../modules/RootStore';
import { useInterval } from '../../hooks/UseInterval';
import { getStartWorkingTime, getTimeItems } from '../../helpers/TaskHelper';
import TaskTimeService from '../../services/TaskTimeService';

const { tasksStore, settingsStore } = rootStore;

function ProgressBar() {
  const { settings } = settingsStore;
  const workingHoursMs = settings.numberOfWorkingHours;

  const [dayUpdateEveryDay, setDayUpdateEveryDay] = useState(new Date());
  const [timer, setTimer] = useState(new Date());

  const shouldDayUpdate = useCallback(() => {
    const now = new Date();
    setTimer(now);
    if (!isSameDay(dayUpdateEveryDay, now)) {
      setDayUpdateEveryDay(now);
    }
  }, [dayUpdateEveryDay]);

  useInterval(shouldDayUpdate);

  const tasks = useMemo(() => tasksStore.getTasksByDate(dayUpdateEveryDay), [
    tasksStore.tasks,
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

  const progress = useMemo(
    () =>
      TaskTimeService.getDayProgress(
        timeRangeItems,
        workingTimeStart,
        workingHoursMs
      ),
    [timer, timeRangeItems, workingTimeStart, workingHoursMs]
  );

  console.log(progress);

  return <Slider value={progress} />;
}

export default observer(ProgressBar);
