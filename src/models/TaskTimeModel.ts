import TaskModel, { ITimeRangeModel } from './TaskModel';

export default class TaskTimeModel {
  task: TaskModel;
  time: ITimeRangeModel;

  constructor(task: TaskModel, time: ITimeRangeModel) {
    this.task = task;
    this.time = time;
  }
}
