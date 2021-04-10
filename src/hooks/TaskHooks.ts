import { msToTime } from '../helpers/DateTime';
import TaskModel from '../models/TaskModel';
import { useEffect, useRef, useState } from 'react';

/**
 *
 * @param model
 */
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
