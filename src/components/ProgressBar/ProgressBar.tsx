import React, { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { Slider } from 'antd';
import { isSameDay } from 'date-fns';
import { createUseStyles } from 'react-jss';

import rootStore from '../../modules/RootStore';
import { useInterval } from '../../hooks/UseInterval';
import { getStartWorkingTime, getTimeItems } from '../../helpers/TaskHelper';
import TaskTimeService from '../../services/TaskTimeService';
import { toTimeFormat } from '../../helpers/DateTime';

const { tasksStore, settingsStore } = rootStore;

function ProgressBar() {
  const { settings } = settingsStore;
  const workingHoursMs = settings.numberOfWorkingHours;

  const style = useStyle();

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
  1 + 1;
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

  const { estimatedWorkingTimeEnd, progress } = useMemo(
    () =>
      TaskTimeService.getDayProgress(
        timeRangeItems,
        workingTimeStart,
        workingHoursMs
      ),
    [timer, timeRangeItems, workingTimeStart, workingHoursMs]
  );

  const marks = useMemo(
    () => ({
      0: toTimeFormat(workingTimeStart),
      100: toTimeFormat(estimatedWorkingTimeEnd),
    }),
    [timer, workingTimeStart, estimatedWorkingTimeEnd]
  );

  return <Slider marks={marks} value={progress} className={style.slider} />;
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
