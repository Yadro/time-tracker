import AbstractFactory from '../../base/AbstractFactory';
import TasksByProject from './models/TasksByProject';
import TaskModel from './models/TaskModel';
import { TaskModelProxy, taskModelProxyHandler } from './models/TaskModelProxy';
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

  createTaskProxy(taskModel: TaskModel): TaskModelProxy {
    const target = new TaskModelProxy(taskModel);

    return new Proxy<TaskModelProxy>(target, taskModelProxyHandler);
  }
}
