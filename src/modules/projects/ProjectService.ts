import ProjectModel, { DEFAULT_PROJECTS } from './models/ProjectModel';
import ProjectFactory from './ProjectFactory';
import ProjectRepository from './ProjectRepository';
import AbstractServiceWithProfile from '../../base/AbstractServiceWithProfile';

export default class ProjectService extends AbstractServiceWithProfile<
  ProjectModel[]
> {
  private factory = new ProjectFactory();
  protected repository = new ProjectRepository();

  getAll(): ProjectModel[] {
    const data = this.repository.restore(DEFAULT_PROJECTS);

    return this.factory.createProjects(data);
  }

  save(data: ProjectModel[]): void {
    this.repository.save(data);
  }
}
