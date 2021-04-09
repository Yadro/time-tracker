import AbstractFileRepository from '../../base/repositories/AbstractFileRepository';
import TaskRecordModel from '../../models/TaskRecordModel';

export default class TaskRepository extends AbstractFileRepository<
  TaskRecordModel
> {
  fileName = 'tasks.json';
}
