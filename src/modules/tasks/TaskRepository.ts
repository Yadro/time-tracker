import AbstractFileRepository from '../../base/repositories/AbstractFileRepository';
import TasksByProject from '../../models/TasksByProject';

export default class TaskRepository extends AbstractFileRepository<
  TasksByProject
> {
  fileName = 'tasks.json';
}
