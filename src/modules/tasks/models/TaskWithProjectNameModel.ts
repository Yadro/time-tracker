import AbstractModel from '../../../base/AbstractModel';
import { ITreeItemWithParent } from '../../../types/ITreeItem';
import TaskModel from './TaskModel';

interface ITaskWithProjectName {
  key: string;
  title: string;
  parent: null;
  children: TaskModel[];
}

export class TaskWithProjectNameModel extends AbstractModel
  implements ITreeItemWithParent<TaskModel> {
  key: string = '';
  title: string = '';
  parent: TaskModel | null = null;
  children: TaskModel[] = [];

  constructor(props: ITaskWithProjectName) {
    super();
    this.load(props);
  }
}
