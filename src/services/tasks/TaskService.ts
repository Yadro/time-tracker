import TaskRepository from './TaskRepository';
import TaskFactory from './TaskFactory';
import IService from '../../base/IService';
import TaskRecordModel from '../../models/TaskRecordModel';

export default class TaskService implements IService<TaskRecordModel> {
  taskRepository: TaskRepository = new TaskRepository();
  taskFactory: TaskFactory = new TaskFactory();

  getAll(): TaskRecordModel {
    const data: TaskRecordModel = this.taskRepository.restore({});
    return this.taskFactory.createTasks(data);
  }

  save(data: TaskRecordModel) {
    this.taskRepository.save(data);
  }
}
