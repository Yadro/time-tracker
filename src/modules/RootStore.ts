import TaskStore from './tasks/TaskStore';
import ProjectStore from './projects/ProjectStore';
import ProjectModel from './projects/ProjectModel';

class RootStore {
  tasksStore = new TaskStore();
  projectStore = new ProjectStore();

  restore() {
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
