import AbstractModel from '../base/AbstractModel';
import { ITreeItem } from '../types/ITreeItem';

interface IProjectItem extends ITreeItem<IProjectItem> {}

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
