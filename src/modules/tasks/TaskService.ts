import { toJS } from 'mobx';

import TaskRepository from './TaskRepository';
import TaskFactory from './TaskFactory';
import TasksByProject from './models/TasksByProject';
import AbstractServiceWithProfile from '../../base/AbstractServiceWithProfile';
import TreeModelHelper from '../../helpers/TreeModelHelper';
import TaskModel from './models/TaskModel';

const setParent = (item: TaskModel, parent?: TaskModel) => {
  item.parent = parent || null;
};

const clearParent = (item: TaskModel) => {
  item.parent = null;
};

export default class TaskService extends AbstractServiceWithProfile<
  TasksByProject
> {
  private factory: TaskFactory = new TaskFactory();
  protected repository: TaskRepository = new TaskRepository();

  getAll(): TasksByProject {
    const data: TasksByProject = this.repository.restore({});
    TaskService.fillParent(data);
    return this.factory.createTasks(data);
  }

  save(data: TasksByProject) {
    const copyData = toJS(data);
    TaskService.clearParent(copyData);
    this.repository.save(copyData);
  }

  private static fillParent(data: TasksByProject) {
    Object.values(data).forEach((projectTasks) => {
      TreeModelHelper.walkRecursive(setParent, projectTasks);
    });
  }

  private static clearParent(data: TasksByProject) {
    Object.values(data).forEach((projectTasks) => {
      TreeModelHelper.walkRecursive(clearParent, projectTasks);
    });
  }
}
