import ProjectModel, {
  DEFAULT_PROJECTS,
  IJsonProjectItem,
} from './models/ProjectModel';
import ProjectFactory from './ProjectFactory';
import ProjectRepository from './ProjectRepository';
import AbstractServiceWithProfile from '../../base/AbstractServiceWithProfile';
import TreeModelHelper from '../../helpers/TreeModelHelper';
import { toJS } from 'mobx';

export default class ProjectService extends AbstractServiceWithProfile<
  ProjectModel[]
> {
  private factory = new ProjectFactory();
  protected repository = new ProjectRepository();

  getAll(): ProjectModel[] {
    const data = this.repository.restore(DEFAULT_PROJECTS);
    ProjectService.fillParent(data);
    return this.factory.createProjects(data);
  }

  save(data: ProjectModel[]): void {
    const copyData = toJS(data);
    ProjectService.clearParent(copyData);
    this.repository.save(copyData);
  }

  private static fillParent(data: IJsonProjectItem[]) {
    TreeModelHelper.fillParent(data);
  }

  private static clearParent(data: ProjectModel[]) {
    TreeModelHelper.clearParent(data);
  }
}
