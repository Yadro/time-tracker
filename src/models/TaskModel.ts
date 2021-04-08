import AbstractModel from '../base/AbstractModel';
import { IDraggableItem } from '../types/IDraggableItem';

interface ITaskModel extends IDraggableItem<ITaskModel> {
  projectId: string;
}

export default class TaskModel extends AbstractModel implements ITaskModel {
  key: string = '';
  title: string = '';
  children: TaskModel[] = [];
  projectId: string = '';

  constructor(props: ITaskModel) {
    super();
    this.load(props);
  }
}
