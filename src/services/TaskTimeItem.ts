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
        isSameDay(range.start, date) ||
        (range.end && isSameDay(range.end, date))
    );
    taskTime = taskTime.concat(
      timeItems.map((time) => new TaskTimeModel(task, time))
    );
  });
  taskTime = taskTime.sort((a, b) => compareAsc(a.time.start, b.time.start));
  return taskTime;
}
