import TaskStore from './tasks/TaskStore';
import ProjectStore from './projects/ProjectStore';
import ProjectModel from './projects/ProjectModel';
import SettingsStore from './settings/SettingsStore';

export class RootStore {
  settingsStore = new SettingsStore();
  tasksStore = new TaskStore(this);
  projectStore = new ProjectStore(this);

  restore() {
    this.settingsStore.restore();
    this.tasksStore.restore();
    this.projectStore.restore();
  }

  deleteProject(project: ProjectModel) {
    this.tasksStore.deleteProjectTasks(project.key);
    this.projectStore.delete(project);
  }
}

const rootStore = new RootStore();
rootStore.restore();

export default rootStore;
