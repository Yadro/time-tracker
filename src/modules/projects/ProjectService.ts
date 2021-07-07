import IService from '../../base/IService';
import ProjectModel, { DEFAULT_PROJECTS } from './models/ProjectModel';
import ProjectFactory from './ProjectFactory';
import ProjectRepository from './ProjectRepository';

export default class ProjectService implements IService<ProjectModel[]> {
  projectFactory = new ProjectFactory();
  projectRepository = new ProjectRepository();

  getAll(): ProjectModel[] {
    const data = this.projectRepository.restore(DEFAULT_PROJECTS);
    return this.projectFactory.createList(ProjectModel, data);
  }

  save(data: ProjectModel[]): void {
    this.projectRepository.save(data);
  }
}
