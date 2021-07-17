import * as colors from '@ant-design/colors';

import AbstractModel from '../../../base/AbstractModel';
import { ITreeItem } from '../../../types/ITreeItem';

export const DEFAULT_PROJECTS: any[] = [
  {
    key: '1',
    title: 'Inbox',
    color: colors.blue,
  },
];

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
  expanded: boolean = false;
  children?: ProjectModel[] = [];

  constructor(props: IJsonProjectItem) {
    super();
    this.load(props); // TODO вынести итератор
    this.children = props.children?.map((json) => new ProjectModel(json)) || [];
  }
}
