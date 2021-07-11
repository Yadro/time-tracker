import TaskRepository from './TaskRepository';
import TaskFactory from './TaskFactory';
import IService from '../../base/IService';
import TasksByProject from './models/TasksByProject';

export default class TaskService implements IService<TasksByProject> {
  repository: TaskRepository = new TaskRepository();
  factory: TaskFactory = new TaskFactory();

  setProfile(profile: string) {
    this.repository.setProfile(profile);
  }

  getAll(): TasksByProject {
    const data: TasksByProject = this.repository.restore({});
    return this.factory.createTasks(data);
  }

  save(data: TasksByProject) {
    this.repository.save(data);
  }
}
