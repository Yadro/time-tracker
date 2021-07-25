import TaskModel from './TaskModel';
import { TaskInMyDay } from './TaskInMyDay';

type Task = TaskModel | TaskInMyDay;
type TasksByProject = Record<string, Task[]>;

export default TasksByProject;
