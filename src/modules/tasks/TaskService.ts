import TaskRepository from './TaskRepository';
import TaskFactory from './TaskFactory';
import IService from '../../base/IService';
import TasksByProject from './models/TasksByProject';

export default class TaskService implements IService<TasksByProject> {
  taskRepository: TaskRepository = new TaskRepository();
  taskFactory: TaskFactory = new TaskFactory();

  getAll(): TasksByProject {
    const data: TasksByProject = this.taskRepository.restore({});
    return this.taskFactory.createTasks(data);
  }

  save(data: TasksByProject) {
    this.taskRepository.save(data);
  }
}
