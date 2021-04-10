import TaskModel from './TaskModel';

export default class TaskTimeModel {
  task: TaskModel;
  time: Date[];

  constructor(task: TaskModel, time: Date[]) {
    this.task = task;
    this.time = time;
  }
}
