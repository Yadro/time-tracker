import { useCallback, useEffect, useRef, useState } from 'react';

import { calcDuration, msToTime } from '../helpers/DateTime';
import TaskModel, { ITimeRangeModel } from '../models/TaskModel';
import TaskTimeItemModel from '../models/TaskTimeItemModel';

export function useTaskDuration(model: TaskModel | undefined) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const [duration, setDuration] = useState<string>('');

  useEffect(() => {
    if (!model) {
      return;
    }
    const duration = model.duration;
    if (duration !== 0) {
      setDuration(msToTime(duration, model.active));
    }
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

export function useTimeItemsDuration(
  taskTime: TaskTimeItemModel[],
  showSeconds: boolean = false
) {
  const [duration, setDuration] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout>();

  const calcTaskDuration = useCallback(
    () => msToTime(calcDuration(taskTime.map((t) => t.time)), showSeconds),
    [showSeconds, taskTime]
  );

  useEffect(() => {
    setDuration(calcTaskDuration());

    const haveActiveTime = taskTime.some((t) => !t.time.end);
    if (haveActiveTime) {
      intervalRef.current = setInterval(() => {
        setDuration(calcTaskDuration());
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [calcTaskDuration, taskTime]);

  return duration;
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
