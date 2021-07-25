import { autorun, makeAutoObservable } from 'mobx';

import TaskService from './TaskService';
import TaskModel, { ITimeRangeModel } from './models/TaskModel';
import TasksByProject from '../../modules/tasks/models/TasksByProject';
import TreeModelHelper from '../../helpers/TreeModelHelper';
import BadgeService from '../BadgeService';
import { RootStore } from '../RootStore';
import GaService from '../../services/gaService/GaService';
import {
  EEventCategory,
  ETasksEvents,
  ETimeRangeEvents,
} from '../../services/gaService/EEvents';
import { DEFAULT_PROJECT_ID } from '../projects/models/ProjectModel';

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

  set(projectId: string, tasksInProject: TaskModel[]) {
    this.tasks[projectId] = tasksInProject;
    this.tasksService.save(this.tasks);
  }

  setTime(task: TaskModel, timeIndex: number, timeRange: ITimeRangeModel) {
    task.time[timeIndex] = timeRange;
    this.tasksService.save(this.tasks);
    GaService.event(EEventCategory.TimeRange, ETimeRangeEvents.Update);
  }

  deleteTime(task: TaskModel, timeIndex: number) {
    if (task.active) {
      this.stopTimer();
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
      const found = TreeModelHelper.getItemRecursive(tasks, condition);
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
      TreeModelHelper.getFlatItemsRecursiveBase(tasks, condition, result);
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

  addToMyDay(task: TaskModel) {
    task.inMyDay = new Date();
    // @ts-ignore
    const pathToNode = TreeModelHelper.getPathToNode(task);

    TreeModelHelper.copyItemsToTree(
      this.tasks[task.projectId],
      // @ts-ignore
      this.tasks[DEFAULT_PROJECT_ID.MyDay],
      pathToNode
    );
  }

  delete(task: TaskModel) {
    function condition(_task: TaskModel) {
      return _task.key === task.key;
    }

    this.stopTimer();

    for (const projectKey in this.tasks) {
      if (this.tasks.hasOwnProperty(projectKey)) {
        this.tasks[projectKey] = TreeModelHelper.deleteItems(
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
    const condition = (task: TaskModel) => task.checked;

    return this.getTaskKeysByCondition(projectId, condition);
  }

  getExpandedKeys(projectId: string): string[] {
    const condition = (task: TaskModel) => task.expanded;

    return this.getTaskKeysByCondition(projectId, condition);
  }

  checkTasks(projectId: string, taskIds: string[]) {
    function checkTaskFn(task: TaskModel, taskIds: string[]) {
      task.checked = taskIds.includes(task.key);
    }

    if (Array.isArray(this.tasks[projectId])) {
      TreeModelHelper.modifyItemsWithIdsRecursive<TaskModel>(
        this.tasks[projectId],
        taskIds,
        checkTaskFn
      );

      this.set(projectId, this.tasks[projectId].slice());
    }
    GaService.event(EEventCategory.Tasks, ETasksEvents.Check);
  }

  markExpanded(projectId: string, taskIds: string[]) {
    const markExpanded = (task: TaskModel, taskIds: string[]) => {
      task.expanded = taskIds.includes(task.key);
    };

    if (Array.isArray(this.tasks[projectId])) {
      TreeModelHelper.modifyItemsWithIdsRecursive<TaskModel>(
        this.tasks[projectId],
        taskIds,
        markExpanded
      );

      this.set(projectId, this.tasks[projectId].slice());
    }
  }

  private getTaskKeysByCondition(
    projectId: string,
    condition: (task: TaskModel) => boolean
  ) {
    if (Array.isArray(this.tasks[projectId])) {
      return TreeModelHelper.getFlatItemsRecursive(
        this.tasks[projectId],
        condition
      ).map((task) => task.key);
    }
    return [];
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

    return TreeModelHelper.getItemRecursive(tasks, condition);
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
