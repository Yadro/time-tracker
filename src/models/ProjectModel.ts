import AbstractModel from '../base/AbstractModel';
import { ITreeItem } from '../types/ITreeItem';

interface IProjectItem extends ITreeItem<IProjectItem> {}

export default class ProjectModel extends AbstractModel
  implements IProjectItem {
  key: string = '';
  title: string = '';
  children: ProjectModel[] = [];

  constructor(props: IProjectItem) {
    super();
    this.load(props);
    this.children = props.children?.map((json) => new ProjectModel(json)) || [];
  }
}
