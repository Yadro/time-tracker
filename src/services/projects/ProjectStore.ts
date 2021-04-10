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

  get(projectId: string): ProjectModel | undefined {
    return this.getRecursive(this.projects, projectId);
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

  private getRecursive(
    projects: ProjectModel[],
    projectId: string
  ): ProjectModel | undefined {
    for (const projectKey in projects) {
      const project = projects[projectKey];
      if (project.key === projectId) {
        return project;
      }
      if (Array.isArray(project.children)) {
        const found = this.getRecursive(project.children, projectId);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }
}
