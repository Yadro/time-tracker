import AbstractFileRepository from '../../base/repositories/AbstractFileRepository';

export default class TaskRepository extends AbstractFileRepository {
  fileName = 'tasks.json';
}
