import AbstractFileRepository from '../../base/repositories/AbstractFileRepository';
import { schemaMigrations } from './migrations';
import { ProjectDataV1 } from './types';

export default class ProjectRepository extends AbstractFileRepository<
  ProjectDataV1
> {
  fileName = 'projects.json';
  schemaMigrations = schemaMigrations;
}
