import {
  calcDuration,
  calcDurationGaps,
  estimateWorkingTimeEnd,
} from '../helpers/DateTime';
import { ITimeRangeModel } from '../modules/tasks/models/TaskModel';

export type DayProgress = {
  progress: number;
  durationMs: number;
  restMs: number;
  estimatedWorkingTimeEnd: Date | undefined;
};

const TaskTimeService = {
  getDayProgress(
    timeItems: ITimeRangeModel[],
    workingTimeStart: Date | undefined,
    workingHoursMs: number
  ): DayProgress {
    if (!workingTimeStart) {
      return {
        progress: 0,
        durationMs: 0,
        restMs: 0,
        estimatedWorkingTimeEnd: undefined,
      };
    }

    const durationMs = calcDuration(timeItems);
    const restMs = calcDurationGaps(timeItems);
    const estimatedWorkingTimeEnd = estimateWorkingTimeEnd(
      workingTimeStart,
      restMs,
      workingHoursMs
    );

    let progress = 0;
    if (estimatedWorkingTimeEnd) {
      const durationWorkDayMs =
        estimatedWorkingTimeEnd.getTime() - workingTimeStart.getTime() || 1;
      progress = (durationMs * 100) / durationWorkDayMs;
      progress = Math.min(progress, 100);
    }

    return {
      progress,
      durationMs,
      restMs,
      estimatedWorkingTimeEnd,
    };
  },
};

export default TaskTimeService;
