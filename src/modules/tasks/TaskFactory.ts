import AbstractFactory from '../../base/AbstractFactory';
import TasksByProject from './models/TasksByProject';
import TaskModel from './models/TaskModel';
import { TaskInMyDay, taskModelProxyHandler } from './models/TaskInMyDay';
import { DEFAULT_PROJECT_ID } from '../projects/models/ProjectModel';

export default class TaskFactory extends AbstractFactory {
  createTasks(data: TasksByProject): TasksByProject {
    const newData: TasksByProject = {};
    Object.keys(data).forEach((projectId) => {
      newData[projectId] = this.createList(TaskModel, data[projectId]);
    });

    newData[DEFAULT_PROJECT_ID.MyDay] = [];

    return newData;
  }

  static createTaskModelProxy(taskModel: TaskModel): TaskInMyDay {
    const target = new TaskInMyDay(taskModel, []);

    return new Proxy<TaskInMyDay>(target, taskModelProxyHandler);
  }
}
