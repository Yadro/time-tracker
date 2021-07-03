import TaskModel from './TaskModel';

export default class TaskWithDurationModel {
  constructor(
    public task: TaskModel,
    public duration: number // milliseconds
  ) {}
}
