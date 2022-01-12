import { toJS } from 'mobx';
import ProjectModel, { IJsonProjectItem } from './models/ProjectModel';
import ProjectFactory from './ProjectFactory';
import ProjectRepository from './ProjectRepository';
import AbstractServiceWithProfile from '../../base/AbstractServiceWithProfile';
import TreeModelHelper from '../../helpers/TreeModelHelper';
import DEFAULT_PROJECTS from './models/DefaultProjects';
import { ProjectDataV0, ProjectDataV1 } from './types';

export default class ProjectService extends AbstractServiceWithProfile<
  ProjectDataV0
> {
  private factory = new ProjectFactory();
  protected repository = new ProjectRepository();

  getAll(): ProjectModel[] {
    const data = this.repository.restore(DEFAULT_PROJECTS);
    ProjectService.fillParent(data);
    return this.factory.createProjects(data.data);
  }

  save(data: ProjectModel[]): void {
    const copyData = toJS(data);
    ProjectService.clearParent(copyData);
    this.repository.save(copyData);
  }

  private static fillParent(data: ProjectDataV1) {
    TreeModelHelper.fillParent(data.data);
  }

  private static clearParent(data: ProjectModel[]) {
    TreeModelHelper.clearParent(data);
  }
}
