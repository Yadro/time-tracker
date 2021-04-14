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
    const taskTimeItems: TaskTimeModel[] = [];
    for (let i = 0; i < task.time.length; i++) {
      const range = task.time[i];
      if (
        isSameDay(range.start, date) ||
        (range.end && isSameDay(range.end, date))
      ) {
        taskTimeItems.push(new TaskTimeModel(task, range, i));
      }
    }
    taskTime = taskTime.concat(taskTimeItems);
  });
  taskTime = taskTime.sort((a, b) => compareAsc(a.time.start, b.time.start));
  return taskTime;
}
