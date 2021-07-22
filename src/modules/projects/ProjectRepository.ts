import AbstractFileRepository from '../../base/repositories/AbstractFileRepository';
import { IJsonProjectItem } from './models/ProjectModel';

export default class ProjectRepository extends AbstractFileRepository<
  IJsonProjectItem[]
> {
  fileName = 'projects.json';
}
