import { useEffect, useRef, useState } from 'react';

import { calcDuration, msToTime } from '../helpers/DateTime';
import TaskModel from '../models/TaskModel';
import TaskTimeModel from '../models/TaskTimeModel';

export function useTaskDuration(model: TaskModel | undefined) {
  model = model || ({} as TaskModel);

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
  }, [model, model.active]);

  return duration;
}

export function useTimeItemsDuration(taskTime: TaskTimeModel[]) {
  const [duration, setDuration] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const haveActiveTime = taskTime.some((t) => !t.time.end);
    setDuration(msToTime(calcDuration(taskTime.map((t) => t.time)), false));
    if (haveActiveTime) {
      intervalRef.current = setInterval(() => {
        setDuration(msToTime(calcDuration(taskTime.map((t) => t.time)), false));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [taskTime]);

  return duration;
}
