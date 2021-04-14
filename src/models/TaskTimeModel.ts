import TaskModel, { ITimeRangeModel } from './TaskModel';

export default class TaskTimeModel {
  constructor(
    public task: TaskModel,
    public time: ITimeRangeModel,
    public index: number
  ) {}
}
