import { autorun, makeAutoObservable } from 'mobx';

import ProjectModel from './models/ProjectModel';
import ProjectService from './ProjectService';
import TreeModelStoreHelper from '../../base/TreeModelStoreHelper';
import { Undefined } from '../../types/CommonTypes';
import { RootStore } from '../RootStore';
import GaService from '../../services/gaService/GaService';
import {
  EEventCategory,
  EProjectEvents,
} from '../../services/gaService/EEvents';

export default class ProjectStore {
  projects: ProjectModel[] = [];
  activeProject: string = '';
  editProject: Undefined<ProjectModel>;

  private projectService = new ProjectService();

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    autorun(() => {
      const profile = this.rootStore.settingsStore.settings.currentProfile;
      if (profile) {
        this.projectService.setProfile(profile);
      }
    });
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
    this.projects = this.projects.slice(); // trigger to update view
  }

  setProjectProps(
    project: ProjectModel,
    title: string,
    color: string | undefined,
  ) {
    project.title = title;
    project.color = color || '';
    this.projects = this.projects.slice();
    this.projectService.save(this.projects);
    GaService.event(EEventCategory.Projects, EProjectEvents.Update);
  }

  get(projectKey: string): ProjectModel | undefined {
    function compare(project: ProjectModel) {
      return project.key === projectKey;
    }
    return TreeModelStoreHelper.getItemRecursive(this.projects, compare);
  }

  add(project: ProjectModel) {
    const newProjects = this.projects.slice();
    newProjects.push(project);
    this.projects = newProjects;
    this.projectService.save(this.projects);
    GaService.event(EEventCategory.Projects, EProjectEvents.Create);
  }

  delete(project: ProjectModel) {
    function condition(_project: ProjectModel) {
      return _project.key === project.key;
    }

    this.projects = TreeModelStoreHelper.deleteItems(this.projects, condition);
    this.projectService.save(this.projects);
    GaService.event(EEventCategory.Projects, EProjectEvents.Delete);
  }

  restore() {
    this.projects = this.projectService.getAll();
    if (this.projects.length > 0) {
      this.activeProject = this.projects[0].key;
    }
  }
}
