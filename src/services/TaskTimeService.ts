import {
  calcDuration,
  calcDurationGaps,
  estimateWorkingTimeEnd,
} from '../helpers/DateTime';
import { ITimeRangeModel } from '../modules/tasks/models/TaskModel';

const TaskTimeService = {
  getDayProgress(
    timeItems: ITimeRangeModel[],
    workingTimeStart: Date | undefined,
    workingHoursMs: number
  ) {
    if (!workingTimeStart) {
      return 0;
    }

    const durationMs = calcDuration(timeItems);
    const restMs = calcDurationGaps(timeItems);
    const estimatedWorkingTimeEnd = estimateWorkingTimeEnd(
      workingTimeStart,
      restMs,
      workingHoursMs
    );

    if (estimatedWorkingTimeEnd) {
      const durationWorkDayMs =
        estimatedWorkingTimeEnd.getTime() - workingTimeStart.getTime() || 1;
      return (durationMs * 100) / durationWorkDayMs;
    }

    return 0;
  },
};

export default TaskTimeService;
