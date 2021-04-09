import AbstractModel from '../base/AbstractModel';
import { ITreeItem } from '../types/ITreeItem';

interface ITaskModel extends ITreeItem<ITaskModel> {
  projectId: string;
  checked: boolean;
}

export default class TaskModel extends AbstractModel implements ITaskModel {
  key: string = '';
  title: string = '';
  children: TaskModel[] = [];
  projectId: string = '';
  checked: boolean = false;

  constructor(props: ITaskModel) {
    super();
    this.load(props);
  }
}
