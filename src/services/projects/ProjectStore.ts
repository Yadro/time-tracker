import { makeAutoObservable } from 'mobx';

import ProjectModel from '../../models/ProjectModel';
import ProjectService from './ProjectService';
import TreeModelStoreHelper from '../../base/TreeModelStoreHelper';
import { Undefined } from '../../types/CommonTypes';

export default class ProjectStore {
  projects: ProjectModel[] = [];
  activeProject: string = '';
  editProject: Undefined<ProjectModel>;

  private projectService = new ProjectService();

  constructor() {
    makeAutoObservable(this);
  }

  set(projects: ProjectModel[]) {
    this.projects = projects;
    this.projectService.save(this.projects);
  }

  setEditableProject(project?: ProjectModel) {
    this.editProject = project;
  }

  setActiveProject(projectId: string) {
    this.activeProject = projectId;
  }

  setTitle(project: ProjectModel, title: string) {
    project.title = title;
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

  delete(project: ProjectModel) {
    function condition(_project: ProjectModel) {
      return _project.key === project.key;
    }

    this.projects = TreeModelStoreHelper.deleteItems(this.projects, condition);
    this.projectService.save(this.projects);
  }

  restore() {
    this.projects = this.projectService.getAll();
    this.activeProject = Object.keys(this.projects)[0];
  }
}
