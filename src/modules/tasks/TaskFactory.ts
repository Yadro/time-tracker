import AbstractFactory from '../../base/AbstractFactory';
import TasksByProject from './models/TasksByProject';
import TaskModel from './models/TaskModel';

export default class TaskFactory extends AbstractFactory {
  createTasks(data: TasksByProject): TasksByProject {
    const newData: TasksByProject = {};
    Object.keys(data).forEach((projectId) => {
      newData[projectId] = this.createList(TaskModel, data[projectId]);
    });
    return newData;
  }
}
