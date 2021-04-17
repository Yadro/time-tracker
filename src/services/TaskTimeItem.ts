import isSameDay from 'date-fns/isSameDay';

import TaskModel from '../models/TaskModel';
import TaskTimeItemModel from '../models/TaskTimeItemModel';
import compareAsc from 'date-fns/compareAsc';

export default function getTimeItems(
  tasks: TaskModel[],
  date: Date
): TaskTimeItemModel[] {
  let taskTime: TaskTimeItemModel[] = [];
  tasks.forEach((task) => {
    const taskTimeItems: TaskTimeItemModel[] = [];
    for (let i = 0; i < task.time.length; i++) {
      const range = task.time[i];
      if (
        isSameDay(range.start, date) ||
        (range.end && isSameDay(range.end, date))
      ) {
        taskTimeItems.push(new TaskTimeItemModel(task, range, i));
      }
    }
    taskTime = taskTime.concat(taskTimeItems);
  });
  taskTime = taskTime.sort((a, b) => compareAsc(a.time.start, b.time.start));
  return taskTime;
}
