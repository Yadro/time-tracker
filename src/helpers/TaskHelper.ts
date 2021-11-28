import { isSameDay, compareAsc, isBefore } from 'date-fns';

import TaskModel from '../modules/tasks/models/TaskModel';
import TaskTimeItemModel from '../modules/tasks/models/TaskTimeItemModel';
import TaskWithDurationModel from '../modules/tasks/models/TaskWithDurationModel';
import TreeModelHelper from './TreeModelHelper';

/**
 * Returns TaskTimeItemModel contains time range
 * return {
 *   task,
 *   time: {
 *     start: Date,
 *     end: Date,
 *     description
 *   },
 *   index,
 * }
 */
export function getTimeItems(
  tasks: TaskModel[],
  date: Date
): TaskTimeItemModel[] {
  const taskTime: TaskTimeItemModel[] = [];
  tasks.forEach((task) => {
    for (let i = 0; i < task.time.length; i++) {
      const range = task.time[i];
      if (
        isSameDay(range.start, date) ||
        (range.end && isSameDay(range.end, date))
      ) {
        taskTime.push(new TaskTimeItemModel(task, range, i));
      }
    }
  });
  taskTime.sort((a, b) => compareAsc(a.time.start, b.time.start));

  return taskTime;
}

/**
 * Return tasks with total time for selected day
 * @param tasks
 * @param date
 */
export function getTasksWithTotalTimeForDay(
  tasks: TaskModel[],
  date: Date
): TaskWithDurationModel[] {
  return tasks.map(
    (task) => new TaskWithDurationModel(task, task.getDurationByDate(date))
  );
}

/**
 * @example task1 → task2 → task
 * @param task
 */
export function getTaskTitlesPath(task: TaskModel) {
  const titlePath: string[] = [];

  function processParent(nParent: TaskModel) {
    titlePath.push(nParent.title);
  }

  TreeModelHelper.walkToParent(processParent, task);
  let titlePathStr = titlePath.reverse().join(' → ');
  if (titlePath.length > 0) {
    titlePathStr += ' →';
  }
  return titlePathStr;
}

export function getStartWorkingTime(
  timeItems: TaskTimeItemModel[]
): Date | undefined {
  let minTime: Date | undefined;
  let tmpStartTime: Date | undefined;
  timeItems.forEach((item) => {
    tmpStartTime = item.time.start;
    if (!minTime || isBefore(tmpStartTime, minTime)) {
      minTime = tmpStartTime;
    }
  });
  return minTime;
}
