import {
  calcDuration,
  calcDurationGaps,
  estimateWorkingTimeEnd,
} from '../helpers/DateTime';
import { ITimeRangeModel } from '../modules/tasks/models/TaskModel';

export type DayProgress = {
  progress: number;
  realProgress: number;
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
        realProgress: 0,
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
    let realProgress = 0;
    if (estimatedWorkingTimeEnd) {
      const durationWorkDayMs =
        estimatedWorkingTimeEnd.getTime() - workingTimeStart.getTime() || 1;
      progress = max100(
        Math.round(((durationMs + restMs) * 100) / durationWorkDayMs)
      );
      realProgress = max100(Math.round((durationMs * 100) / workingHoursMs));
    }

    return {
      progress,
      realProgress,
      durationMs,
      restMs,
      estimatedWorkingTimeEnd,
    };
  },
};

function max100(num: number) {
  return Math.min(num, 100);
}

export default TaskTimeService;
