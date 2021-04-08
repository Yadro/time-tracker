import ProjectModel from '../../models/ProjectModel';
import ProjectService from './ProjectService';
import { makeAutoObservable } from 'mobx';

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

  add(project: ProjectModel) {
    this.projects.push(project);
    this.projects = this.projects.slice();
    this.projectService.save(this.projects);
  }

  delete(project: ProjectModel) {}

  setActiveProject(projectId: string) {
    this.activeProject = projectId;
  }

  restore() {
    this.projects = this.projectService.getAll();
    this.activeProject = Object.keys(this.projects)[0];
  }
}
