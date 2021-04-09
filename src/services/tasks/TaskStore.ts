import { makeAutoObservable } from 'mobx';
import TaskService from './TaskService';
import TaskModel from '../../models/TaskModel';
import TaskRecordModel from '../../models/TaskRecordModel';

export default class TaskStore {
  tasks: TaskRecordModel = {};
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

  delete(projectId: string, task: TaskModel) {}

  restore() {
    this.tasks = this.tasksService.getAll();
  }

  getCheckedKeys(projectId: string): string[] {
    if (Array.isArray(this.tasks[projectId])) {
      const checkedIds: string[] = [];
      this.getCheckedKeysRecursive(this.tasks[projectId], checkedIds);
      return checkedIds;
    }
    return [];
  }

  checkTasks(taskIds: string[]) {
    Object.keys(this.tasks).forEach((projectId) => {
      this.checkTasksRecursive(this.tasks[projectId], taskIds);
    });
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
