import { autorun, computed, makeAutoObservable } from 'mobx';
import { v4 as uuid } from 'uuid';
import TaskService from './TaskService';
import TaskModel, { ITimeRangeModel } from './models/TaskModel';
import { Task, TasksByProject } from './models/TasksByProject';
import TreeModelHelper from '../../helpers/TreeModelHelper';
import BadgeService from '../BadgeService';
import rootStore, { RootStore } from '../RootStore';
import GaService from '../../services/gaService/GaService';
import {
  EEventCategory,
  ETasksEvents,
  ETimeRangeEvents,
} from '../../services/gaService/EEvents';
import { DEFAULT_PROJECT_ID } from '../projects/models/ProjectModel';
import throttle from '../../helpers/Throttle';
import { THROTTLE_SAVE_JSON_MS } from '../../config';
import { findSuggestionsByProject } from './utils';
import { Suggestion, SuggestionsByProject } from './models/TasksTypes';

export default class TaskStore {
  tasks: TasksByProject = {};
  suggestions: SuggestionsByProject = {};
  activeTask: TaskModel | undefined;
  versionHash = uuid();
  private tasksService = new TaskService();
  private interval: NodeJS.Timeout | undefined;
  private saveInStorage = throttle(() => {
    this.tasksService.save(this.tasks);
    this.updateVersion();
  }, THROTTLE_SAVE_JSON_MS);

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
    this.saveInStorage();
  }

  setTime(task: TaskModel, timeIndex: number, timeRange: ITimeRangeModel) {
    task.time[timeIndex] = timeRange;
    this.saveInStorage();
    GaService.event(EEventCategory.TimeRange, ETimeRangeEvents.Update);
  }

  removeTime(task: TaskModel, timeIndex: number) {
    if (task.active) {
      this.stopTimer();
    }

    task.time.splice(timeIndex, 1); // TODO move to task
    this.saveInStorage();
    GaService.event(EEventCategory.TimeRange, ETimeRangeEvents.Delete);
  }

  getTasks(projectId: string): Task[] {
    return this.tasks[projectId] || [];
  }

  suggestionsForProject = computed<Suggestion[]>(() => {
    const { activeProject } = this.rootStore.projectStore;
    if (activeProject in this.suggestions) {
      return this.suggestions[activeProject] ?? [];
    }
    return [];
  });

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
    this.tasks[projectId] = [...this.tasks[projectId], task];
    this.saveInStorage();
    GaService.event(EEventCategory.Tasks, ETasksEvents.Create);
  }

  addToMyDay(task: TaskModel) {
    task.inMyDay = new Date();

    const pathToNode = TreeModelHelper.getPathToNode(task);

    TreeModelHelper.copyItemsToTreeUnderProject(
      rootStore.projectStore.get(task.projectId),
      this.tasks[task.projectId],
      // @ts-ignore
      this.tasks[DEFAULT_PROJECT_ID.MyDay],
      pathToNode
    );
  }

  remove(task: TaskModel) {
    function condition(_task: TaskModel) {
      return _task.key === task.key;
    }

    if (task.active) {
      this.stopTimer();
    }

    for (const projectKey in this.tasks) {
      if (this.tasks.hasOwnProperty(projectKey)) {
        this.tasks[projectKey] = TreeModelHelper.deleteItems(
          this.tasks[projectKey],
          condition
        );
      }
    }
    this.saveInStorage();
    GaService.event(EEventCategory.Tasks, ETasksEvents.Delete);
  }

  removeProjectTasks(projectKey: string) {
    delete this.tasks[projectKey];
    this.saveInStorage();
  }

  startTimer(task: TaskModel) {
    this.stopTimer(true);
    this.activeTask = task;
    task.start();
    this.setupReminder(task);
    this.saveInStorage();
  }

  stopTimer(silent?: boolean) {
    if (this.activeTask) {
      this.activeTask.stop();
    }

    if (!silent) {
      this.setupReminder();
      this.saveInStorage();
    }
  }

  restore() {
    this.tasks = this.tasksService.getAll();
    this.suggestions = findSuggestionsByProject(this.tasks);
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

      this.saveInStorage();
    }
    GaService.event(EEventCategory.Tasks, ETasksEvents.Check);
  }

  markExpanded(projectId: string, taskIds: string[]) {
    const markExpanded = (task: Task, taskIds: string[]) => {
      if (task instanceof TaskModel) {
        task.expanded = taskIds.includes(task.key);
      }
    };

    if (Array.isArray(this.tasks[projectId])) {
      TreeModelHelper.modifyItemsWithIdsRecursive<Task>(
        this.tasks[projectId],
        taskIds,
        markExpanded
      );

      this.saveInStorage();
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

  private updateVersion() {
    this.versionHash = uuid();
  }
}

export function createTask(title: string) {
  const { tasksStore, projectStore } = rootStore;
  tasksStore.add(
    new TaskModel({
      key: uuid(),
      title,
      projectId: projectStore.activeProject,
      active: false,
      time: [],
      checked: false,
      children: [],
      datesInProgress: [],
      details: [],
      parent: undefined, // Add into root
      expanded: true,
    })
  );
}
