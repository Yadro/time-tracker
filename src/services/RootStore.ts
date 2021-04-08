import TaskStore from './tasks/TaskStore';
import ProjectStore from './projects/ProjectStore';
import { toJS } from 'mobx';

class RootStore {
  tasksStore = new TaskStore();
  projectStore = new ProjectStore();

  restore() {
    this.tasksStore.restore();
    this.projectStore.restore();
    console.log(toJS(this.projectStore.projects));
    console.log(toJS(this.tasksStore.tasks));
  }
}

const rootStore = new RootStore();
rootStore.restore();

export default rootStore;
