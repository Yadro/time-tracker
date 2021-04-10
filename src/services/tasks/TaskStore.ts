import { makeAutoObservable } from 'mobx';
import TaskService from './TaskService';
import TaskModel from '../../models/TaskModel';
import TaskRecordModel from '../../models/TaskRecordModel';

export default class TaskStore {
  tasks: TaskRecordModel = {};
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

  add(task: TaskModel) {
    const { projectId } = task;
    if (!Array.isArray(this.tasks[projectId])) {
      this.tasks[projectId] = [];
    }
    this.tasks[projectId].push(task);
    this.tasks[projectId] = this.tasks[projectId].slice();
    this.tasksService.save(this.tasks);
  }

  startTimer(task: TaskModel) {
    if (this.activeTask) {
      this.endTimer(this.activeTask);
    }
    this.activeTask = task;
    task.time.forEach((range) => {
      if (range.length === 1) {
        range[1] = Date.now();
      }
    });
    task.time.push([Date.now()]);
    task.active = true;
    this.tasksService.save(this.tasks);
  }

  endTimer(task: TaskModel) {
    this.activeTask = undefined;
    task.active = false;
    const range = task.time[task.time.length - 1];
    range.push(Date.now());
    this.tasksService.save(this.tasks);
  }

  restore() {
    this.tasks = this.tasksService.getAll();
    this.findActiveTask();
  }

  getCheckedKeys(projectId: string): string[] {
    if (Array.isArray(this.tasks[projectId])) {
      const checkedIds: string[] = [];
      this.getCheckedKeysRecursive(this.tasks[projectId], checkedIds);
      return checkedIds;
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
    for (const taskKey in tasks) {
      const task = tasks[taskKey];
      if (task.active) {
        return task;
      }
      if (Array.isArray(task.children)) {
        const found = this.findActiveTaskRecursive(task.children);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  private getCheckedKeysRecursive(tasks: TaskModel[], checkedIds: string[]) {
    tasks.forEach((task) => {
      if (task.checked) {
        checkedIds.push(task.key);
      }
      if (Array.isArray(task.children)) {
        this.getCheckedKeysRecursive(task.children, checkedIds);
      }
    });
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
