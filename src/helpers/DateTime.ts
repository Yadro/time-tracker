import { ITimeRangeModel } from '../modules/tasks/models/TaskModel';
import { format, isSameMonth, isSameYear } from 'date-fns';

import { iterPrevCurrent } from './ArrayHelper';

function timePad(time: number): string {
  return String(time).padStart(2, '0');
}

function onlySecs(sign: string, secs: number) {
  return `${sign}${secs}s`;
}

function timeItemsToString(
  sign: string,
  hrs: number,
  mins: number,
  secs: number,
  showSeconds: boolean
) {
  if (hrs === 0 && mins === 0) {
    return onlySecs(sign, secs);
  }

  let result = `${sign}${timePad(hrs)}:${timePad(mins)}`;
  if (showSeconds) {
    result += `:${timePad(secs)}`;
  }

  return result;
}

export function msToTime(s: number, showSeconds: boolean = true) {
  if (!s) {
    return '0s';
  }
  const sign = s < 0 ? '-' : '';
  s = Math.abs(s);
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  return timeItemsToString(sign, hrs, mins, secs, showSeconds);
}

export function taskLastActiveDateFormat(date: Date) {
  const now = new Date();
  if (isSameMonth(date, now)) {
    return format(date, 'E dd');
  }
  if (isSameYear(date, now)) {
    return format(date, 'dd/MM');
  }
  return format(date, 'dd/MM/yy');
}

export function timeToMs(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return (hours * 60 + minutes) * 60 * 1000;
}

export function calcDuration(taskTime: ITimeRangeModel[]): number {
  return taskTime.reduce((prev, timeRange) => {
    if (!timeRange.start) {
      return 0;
    }
    if (!timeRange.end) {
      return prev + new Date().getTime() - timeRange.start.getTime();
    }
    return prev + timeRange.end.getTime() - timeRange.start.getTime();
  }, 0);
}

export function calcDurationGaps(taskTime: ITimeRangeModel[]): number {
  let result = 0;
  iterPrevCurrent(taskTime, (prev, cur) => {
    if (prev?.end) {
      result += cur.start.getTime() - prev.end.getTime();
    }
  });

  const lastTask = taskTime[taskTime.length - 1];
  if (lastTask && lastTask.end) {
    result += new Date().getTime() - lastTask.end.getTime();
  }

  return result;
}

const TIME_FORMAT = 'HH:mm';
const NO_TIME = '--:--';

export function getTime(date: Date | undefined) {
  if (!date) {
    return NO_TIME;
  }
  return format(date, TIME_FORMAT);
}

export function estimateWorkingTimeEnd(
  startDate: Date | undefined,
  restTimeMs: number,
  workingHoursMs: number
): Date | undefined {
  return startDate
    ? new Date(startDate.getTime() + restTimeMs + workingHoursMs)
    : undefined;
}
