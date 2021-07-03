import IService from '../../base/IService';
import ProjectModel from './ProjectModel';
import ProjectFactory from './ProjectFactory';
import ProjectRepository from './ProjectRepository';

export default class ProjectService implements IService<ProjectModel[]> {
  factory = new ProjectFactory();
  repository = new ProjectRepository();

  setProfile(profile: string) {
    this.repository.setProfile(profile);
  }

  getAll(): ProjectModel[] {
    const data = this.repository.restore([]);
    return this.factory.createList(ProjectModel, data);
  }

  save(data: ProjectModel[]): void {
    this.repository.save(data);
  }
}
