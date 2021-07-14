import { autorun, makeAutoObservable } from 'mobx';

import TaskService from './TaskService';
import TaskModel, { ITimeRangeModel } from './models/TaskModel';
import TasksByProject from '../../modules/tasks/models/TasksByProject';
import TreeModelStoreHelper from '../../base/TreeModelStoreHelper';
import BadgeService from '../BadgeService';
import { RootStore } from '../RootStore';
import GaService from '../../services/gaService/GaService';
import {
  EEventCategory,
  ETasksEvents,
  ETimeRangeEvents,
} from '../../services/gaService/EEvents';

export default class TaskStore {
  tasks: TasksByProject = {};
  activeTask: TaskModel | undefined;
  private tasksService = new TaskService();
  private interval: NodeJS.Timeout | undefined;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    autorun(() => {
      const profile = this.rootStore.settingsStore.settings.currentProfile;
      if (profile) {
        this.tasksService.setProfile(profile);
      }
    });
  }

  set(projectId: string, tasks: TaskModel[]) {
    this.tasks[projectId] = tasks;
    this.tasksService.save(this.tasks);
  }

  setTime(task: TaskModel, timeIndex: number, timeRange: ITimeRangeModel) {
    task.time[timeIndex] = timeRange;
    this.tasksService.save(this.tasks);
    GaService.event(EEventCategory.TimeRange, ETimeRangeEvents.Update);
  }

  deleteTime(task: TaskModel, timeIndex: number) {
    if (!task.time[timeIndex].end) {
      task.stop();
    }
    task.time.splice(timeIndex, 1);
    this.tasksService.save(this.tasks);
    GaService.event(EEventCategory.TimeRange, ETimeRangeEvents.Delete);
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

  getTasksByDate(date: Date): TaskModel[] {
    const result: TaskModel[] = [];

    function condition(task: TaskModel): boolean {
      return task.wasActiveInDay(date);
    }

    for (const tasks of Object.values(this.tasks)) {
      TreeModelStoreHelper.getFlatItemsRecursiveBase(tasks, condition, result);
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
    GaService.event(EEventCategory.Tasks, ETasksEvents.Create);
  }

  delete(task: TaskModel) {
    function condition(_task: TaskModel) {
      return _task.key === task.key;
    }

    this.stopTimer();

    for (const projectKey in this.tasks) {
      if (this.tasks.hasOwnProperty(projectKey)) {
        this.tasks[projectKey] = TreeModelStoreHelper.deleteItems(
          this.tasks[projectKey],
          condition
        );
      }
    }
    this.tasksService.save(this.tasks);
    GaService.event(EEventCategory.Tasks, ETasksEvents.Delete);
  }

  deleteProjectTasks(projectKey: string) {
    delete this.tasks[projectKey];
    this.tasksService.save(this.tasks);
  }

  startTimer(task: TaskModel) {
    this.stopTimer(true);
    this.activeTask = task;
    task.start();
    this.setupReminder(task);
    this.tasksService.save(this.tasks);
  }

  stopTimer(silent?: boolean) {
    if (this.activeTask) {
      this.activeTask.stop();
      this.activeTask = undefined;
    }

    if (!silent) {
      this.setupReminder();
      this.tasksService.save(this.tasks);
    }
  }

  restore() {
    this.tasks = this.tasksService.getAll();
    this.findAndSetActiveTask();
    this.setupReminder(this.activeTask);
  }

  getCheckedKeys(projectId: string): string[] {
    function condition(task: TaskModel): boolean {
      return task.checked;
    }

    if (Array.isArray(this.tasks[projectId])) {
      return TreeModelStoreHelper.getFlatItemsRecursive(
        this.tasks[projectId],
        condition
      ).map((task) => task.key);
    }
    return [];
  }

  checkTasks(projectId: string, taskIds: string[]) {
    if (Array.isArray(this.tasks[projectId])) {
      this.checkTasksRecursive(this.tasks[projectId], taskIds);
    }
    this.tasksService.save(this.tasks);
    GaService.event(EEventCategory.Tasks, ETasksEvents.Check);
  }

  private findAndSetActiveTask() {
    for (const tasks of Object.values(this.tasks)) {
      const found = this.findActiveTaskRecursive(tasks);
      if (found) {
        this.activeTask = found;
        break;
      }
    }
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

  private setupReminder(task?: TaskModel) {
    BadgeService.setBadge(!!task);

    if (!this.rootStore.settingsStore.settings.showNotifications) {
      return;
    }

    this.removeReminder();

    if (task) {
      console.log('Setup: Task in progress');
      this.interval = setInterval(() => {
        console.log('Task in progress');
        new Notification('You are tracking time', {
          body: `Task '${task.title}' in progress`,
        });
      }, 40 * 60 * 1000);
    } else {
      console.log('Setup: No tasks in progress');
      this.interval = setInterval(() => {
        console.log('No tasks in progress');
        new Notification('You are not tracking time', {
          body: 'There are not task that you track',
        });
      }, 15 * 60 * 1000);
    }
  }

  removeReminder() {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
    }
  }
}
