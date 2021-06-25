import { ITimeRangeModel } from '../models/TaskModel';

function timePad(time: number): string {
  return String(time).padStart(2, '0');
}

function onlySecs(secs: number) {
  return `${secs}s`;
}

export function msToTime(s: number, showSeconds: boolean = true) {
  if (!s) {
    return '0s';
  }
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  if (showSeconds) {
    if (hrs === 0 && mins === 0) {
      return onlySecs(secs);
    }
    return `${timePad(hrs)}:${timePad(mins)}:${timePad(secs)}`;
  }
  if (hrs === 0 && mins === 0) {
    return onlySecs(secs);
  }
  return `${timePad(hrs)}:${timePad(mins)}`;
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
