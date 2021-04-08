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
}
