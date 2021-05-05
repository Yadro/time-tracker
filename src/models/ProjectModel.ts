import AbstractModel from '../base/AbstractModel';
import { ITreeItem } from '../types/ITreeItem';

interface IJsonProjectItem extends ITreeItem<IJsonProjectItem> {
  color: string;
}

interface IProjectModel extends ITreeItem<IProjectModel> {
  color: string;
}

export default class ProjectModel extends AbstractModel
  implements IProjectModel {
  key: string = '';
  title: string = '';
  color: string = '';
  children?: ProjectModel[] = [];

  constructor(props: IJsonProjectItem) {
    super();
    this.load(props); // TODO вынести итератор
    this.children = props.children?.map((json) => new ProjectModel(json)) || [];
  }
}
