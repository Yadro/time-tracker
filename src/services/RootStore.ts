import TaskStore from './tasks/TaskStore';
import ProjectStore from './projects/ProjectStore';
import { toJS } from 'mobx';

class RootStore {
  tasksStore = new TaskStore();
  projectStore = new ProjectStore();

  restore() {
    this.tasksStore.restore();
    this.projectStore.restore();
  }
}

const rootStore = new RootStore();
rootStore.restore();

export default rootStore;
