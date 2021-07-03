import TaskModel, { ITimeRangeModel } from './TaskModel';

export default class TaskTimeItemModel {
  constructor(
    public task: TaskModel,
    public time: ITimeRangeModel,
    public index: number,
  ) {}
}
