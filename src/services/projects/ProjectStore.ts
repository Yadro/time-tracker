import { makeAutoObservable } from 'mobx';

import ProjectModel from '../../models/ProjectModel';
import ProjectService from './ProjectService';
import TreeModelStoreHelper from '../../base/TreeModelStoreHelper';

export default class ProjectStore {
  projects: ProjectModel[] = [];
  activeProject: string = '';

  private projectService = new ProjectService();

  constructor() {
    makeAutoObservable(this);
  }

  set(projects: ProjectModel[]) {
    this.projects = projects;
    this.projectService.save(this.projects);
  }

  get(projectKey: string): ProjectModel | undefined {
    function compare(project: ProjectModel) {
      return project.key === projectKey;
    }
    return TreeModelStoreHelper.getItemRecursive(this.projects, compare);
  }

  add(project: ProjectModel) {
    this.projects.push(project);
    this.projects = this.projects.slice();
    this.projectService.save(this.projects);
  }

  setActiveProject(projectId: string) {
    this.activeProject = projectId;
  }

  restore() {
    this.projects = this.projectService.getAll();
    this.activeProject = Object.keys(this.projects)[0];
  }
}
