import AbstractFactory from '../../base/AbstractFactory';
import ProjectModel, {
  DEFAULT_PROJECT_ID,
  DEFAULT_PROJECTS,
  IJsonProjectItem,
} from './models/ProjectModel';

export default class ProjectFactory extends AbstractFactory {
  createProjects(projectItems: IJsonProjectItem[]): ProjectModel[] {
    const hasMyDay = projectItems.find(
      (p) => p.key === DEFAULT_PROJECT_ID.MyDay
    );
    if (!hasMyDay) {
      const myDayProj = DEFAULT_PROJECTS.find(
        (p) => p.key === DEFAULT_PROJECT_ID.MyDay
      );
      if (myDayProj) {
        projectItems.unshift(myDayProj);
      }
    }

    return this.createList(ProjectModel, projectItems);
  }
}
