import TaskModel from './TaskModel';
import { TaskModelProxy } from './TaskModelProxy';

type Task = TaskModel | TaskModelProxy;
type TasksByProject = Record<string, Task[]>;

export default TasksByProject;
