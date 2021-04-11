import { action, makeObservable, observable } from 'mobx';

import ProjectModel from '../../models/ProjectModel';
import ProjectService from './ProjectService';
import AbstractTreeModelStore from '../../base/AbstractTreeModelStore';

export default class ProjectStore extends AbstractTreeModelStore<ProjectModel> {
  projects: ProjectModel[] = [];
  activeProject: string = '';

  private projectService = new ProjectService();

  constructor() {
    super();
    makeObservable(this, {
      projects: observable,
      activeProject: observable,
      set: action,
      get: action,
      add: action,
      setActiveProject: action,
      restore: action,
    });
  }

  set(projects: ProjectModel[]) {
    this.projects = projects;
    this.projectService.save(this.projects);
  }

  get(projectKey: string): ProjectModel | undefined {
    function compare(project: ProjectModel) {
      return project.key === projectKey;
    }
    return this.getItemRecursive(this.projects, compare);
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
