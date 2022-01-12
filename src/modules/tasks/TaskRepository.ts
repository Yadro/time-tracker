import AbstractFileRepository from '../../base/repositories/AbstractFileRepository';
import { TasksByProject } from './models/TasksByProject';
import { schemaMigrations } from './migrations';

export default class TaskRepository extends AbstractFileRepository<
  TasksByProject
> {
  fileName = 'tasks.json';
  schemaMigrations = schemaMigrations;
}
