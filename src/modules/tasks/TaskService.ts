import TaskRepository from './TaskRepository';
import TaskFactory from './TaskFactory';
import TasksByProject from './models/TasksByProject';
import AbstractServiceWithProfile from '../../base/AbstractServiceWithProfile';

export default class TaskService extends AbstractServiceWithProfile<
  TasksByProject
> {
  private factory: TaskFactory = new TaskFactory();
  protected repository: TaskRepository = new TaskRepository();

  getAll(): TasksByProject {
    const data: TasksByProject = this.repository.restore({});
    return this.factory.createTasks(data);
  }

  save(data: TasksByProject) {
    this.repository.save(data);
  }
}
