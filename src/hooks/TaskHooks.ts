import { useCallback, useEffect, useRef, useState } from 'react';

import { calcDuration, calcDurationGaps, msToTime } from '../helpers/DateTime';
import TaskModel, { ITimeRangeModel } from '../modules/tasks/models/TaskModel';
import TaskTimeItemModel from '../modules/tasks/models/TaskTimeItemModel';

export function useTaskDuration(model?: TaskModel, showZero?: boolean) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const [duration, setDuration] = useState<string>('');

  useEffect(() => {
    if (!model) {
      return;
    }
    const duration = model.duration;

    const durationMs =
      duration !== 0 || showZero ? msToTime(duration, model.active) : '';

    setDuration(durationMs);

    if (model.active) {
      intervalRef.current = setInterval(() => {
        setDuration(msToTime(model?.duration || 0));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [model, model?.active]);

  return duration;
}

export function useTimeItemsDuration(taskTime: TaskTimeItemModel[]) {
  const [durationMs, setDurationMs] = useState<number>(0);
  const [restMs, setRestMs] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const calcTaskDuration = useCallback(
    () => calcDuration(taskTime.map((t) => t.time)),
    [taskTime]
  );

  const calcTaskGapsDuration = useCallback(
    () => calcDurationGaps(taskTime.map((t) => t.time)),
    [taskTime]
  );

  const setTimes = useCallback(() => {
    setDurationMs(calcTaskDuration());
    setRestMs(calcTaskGapsDuration());
  }, [calcTaskDuration, calcTaskGapsDuration]);

  useEffect(() => {
    setTimes();

    intervalRef.current = setInterval(() => {
      setTimes();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [setTimes, taskTime]);

  return {
    durationMs,
    restMs,
  };
}

export function useTimeRangeDuration(timeRange: ITimeRangeModel | undefined) {
  const [duration, setDuration] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout>();

  const calcTimeRangeDuration = useCallback(
    () => msToTime(timeRange ? calcDuration([timeRange]) : 0),
    [timeRange]
  );

  useEffect(() => {
    if (!timeRange) {
      return;
    }
    setDuration(calcTimeRangeDuration());

    const haveActiveTime = !timeRange.end;
    if (haveActiveTime) {
      intervalRef.current = setInterval(() => {
        setDuration(calcTimeRangeDuration());
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [calcTimeRangeDuration, timeRange]);

  return duration;
}
