import isSameDay from 'date-fns/isSameDay';

import TaskModel from '../models/TaskModel';
import TaskTimeModel from '../models/TaskTimeModel';
import compareAsc from 'date-fns/compareAsc';

export default function getTimeItems(
  tasks: TaskModel[],
  date: Date
): TaskTimeModel[] {
  let taskTime: TaskTimeModel[] = [];
  tasks.forEach((task) => {
    const timeItems = task.time.filter(
      (range) =>
        isSameDay(range[0], date) ||
        (range.length >= 1 && isSameDay(range[1], date))
    );
    taskTime = taskTime.concat(
      timeItems.map((time) => new TaskTimeModel(task, time))
    );
  });
  taskTime = taskTime.sort((a, b) => compareAsc(a.time[0], b.time[0]));
  return taskTime;
}
