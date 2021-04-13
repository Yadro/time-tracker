import { makeAutoObservable } from 'mobx';

import TaskService from './TaskService';
import TaskModel from '../../models/TaskModel';
import TasksByProject from '../../models/TasksByProject';
import TreeModelStoreHelper from '../../base/TreeModelStoreHelper';

export default class TaskStore {
  tasks: TasksByProject = {};
  activeTask: TaskModel | undefined;
  private tasksService = new TaskService();

  constructor() {
    makeAutoObservable(this);
  }

  set(projectId: string, tasks: TaskModel[]) {
    this.tasks[projectId] = tasks;
    this.tasksService.save(this.tasks);
  }

  getTasks(projectId: string): TaskModel[] {
    return this.tasks[projectId] || [];
  }

  getTaskByKey(taskKey: string): TaskModel | undefined {
    function condition(task: TaskModel): boolean {
      return task.key === taskKey;
    }

    for (const tasks of Object.values(this.tasks)) {
      const found = TreeModelStoreHelper.getItemRecursive(tasks, condition);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  getTaskByDate(date: Date) {
    const result: TaskModel[] = [];

    function condition(task: TaskModel): boolean {
      return task.wasActiveInDay(date);
    }

    for (const tasks of Object.values(this.tasks)) {
      TreeModelStoreHelper.getFlatItemsRecursive(tasks, condition, result);
    }
    return result;
  }

  add(task: TaskModel) {
    const { projectId } = task;
    if (!Array.isArray(this.tasks[projectId])) {
      this.tasks[projectId] = [];
    }
    this.tasks[projectId].push(task);
    this.tasks[projectId] = this.tasks[projectId].slice();
    this.tasksService.save(this.tasks);
  }

  delete(task: TaskModel) {
    task.setDeleted();
    this.tasksService.save(this.tasks);
  }

  startTimer(task: TaskModel) {
    if (this.activeTask) {
      this.endTimer(this.activeTask);
    }
    this.activeTask = task;
    task.start();
    this.tasksService.save(this.tasks);
  }

  endTimer(task: TaskModel) {
    this.activeTask = undefined;
    task.end();
    this.tasksService.save(this.tasks);
  }

  restore() {
    this.tasks = this.tasksService.getAll();
    this.findActiveTask();
  }

  getCheckedKeys(projectId: string): string[] {
    function condition(task: TaskModel): boolean {
      return task.checked;
    }

    if (Array.isArray(this.tasks[projectId])) {
      const found: TaskModel[] = [];
      TreeModelStoreHelper.getFlatItemsRecursive(
        this.tasks[projectId],
        condition,
        found
      );
      return found.map((f) => f.key);
    }
    return [];
  }

  checkTasks(projectId: string, taskIds: string[]) {
    if (Array.isArray(this.tasks[projectId])) {
      this.checkTasksRecursive(this.tasks[projectId], taskIds);
    }
    this.tasksService.save(this.tasks);
  }

  private findActiveTask() {
    Object.keys(this.tasks).find((projectId) => {
      const found = this.findActiveTaskRecursive(this.tasks[projectId]);
      if (found) {
        this.activeTask = found;
        return true;
      }
      return false;
    });
  }

  private findActiveTaskRecursive(tasks: TaskModel[]): TaskModel | undefined {
    function condition(task: TaskModel): boolean {
      return task.active;
    }

    return TreeModelStoreHelper.getItemRecursive(tasks, condition);
  }

  private checkTasksRecursive(tasks: TaskModel[], taskIds: string[]) {
    tasks.forEach((task) => {
      task.checked = taskIds.includes(task.key);
      if (Array.isArray(task.children)) {
        this.checkTasksRecursive(task.children, taskIds);
      }
    });
  }
}
