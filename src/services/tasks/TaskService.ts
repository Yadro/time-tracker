import TaskRepository from './TaskRepository';
import TaskFactory from './TaskFactory';
import IService from '../../base/IService';
import TaskRecordModel from '../../models/TaskRecordModel';

export default class TaskService implements IService<TaskRecordModel> {
  taskRepository: TaskRepository = new TaskRepository();
  taskFactory: TaskFactory = new TaskFactory();

  getAll(): TaskRecordModel {
    const tasks = this.taskRepository.restore({});
    return tasks as TaskRecordModel;
  }

  save(data: TaskRecordModel) {
    this.taskRepository.save(data);
  }
}
