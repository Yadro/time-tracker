import AbstractFactory from '../../base/AbstractFactory';
import TaskRecordModel from '../../models/TaskRecordModel';
import TaskModel from '../../models/TaskModel';

export default class TaskFactory extends AbstractFactory {
  createTasks(data: TaskRecordModel): TaskRecordModel {
    const newData: TaskRecordModel = {};
    Object.keys(data).forEach((projectId) => {
      newData[projectId] = this.createList(TaskModel, data[projectId]);
    });
    return newData;
  }
}
