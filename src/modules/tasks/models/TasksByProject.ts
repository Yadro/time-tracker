import TaskModel from './TaskModel';

// export type Task = TaskModel | TaskInMyDay | TaskWithProjectNameModel;
export type Task = TaskModel;
export type TasksByProject = Record<string, Task[]>;
