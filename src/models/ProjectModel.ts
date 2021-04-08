import AbstractModel from '../base/AbstractModel';
import { IDraggableItem } from '../types/IDraggableItem';

interface IProjectItem extends IDraggableItem<IProjectItem> {}

export default class ProjectModel extends AbstractModel
  implements IProjectItem {
  key: string = '';
  title: string = '';
  children: IProjectItem[] = [];

  constructor(props: IProjectItem) {
    super();
    this.load(props);
  }
}
