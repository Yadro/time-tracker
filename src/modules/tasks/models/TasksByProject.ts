import TaskModel from './TaskModel';
import { TaskInMyDay } from './TaskInMyDay';
import { TaskWithProjectNameModel } from './TaskWithProjectNameModel';

export type Task = TaskModel | TaskInMyDay | TaskWithProjectNameModel;
export type TasksByProject = Record<string, Task[]>;
