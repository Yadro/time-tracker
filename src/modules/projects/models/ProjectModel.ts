import * as colors from '@ant-design/colors';

import AbstractModel from '../../../base/AbstractModel';
import { ITreeItem } from '../../../types/ITreeItem';

export enum DEFAULT_PROJECT_ID {
  MyDay = '0',
  Inbox = '1',
}

export const DEFAULT_PROJECTS: IJsonProjectItem[] = [
  // {
  //   key: DEFAULT_PROJECT_ID.MyDay,
  //   title: 'My Day',
  //   color: colors.yellow.primary || '',
  //   deletable: false,
  //   expanded: false,
  // },
  {
    key: DEFAULT_PROJECT_ID.Inbox,
    title: 'Inbox',
    color: colors.blue.primary || '',
    deletable: false,
    expanded: false,
  },
];

export interface IJsonProjectItem extends ITreeItem<IJsonProjectItem> {
  color: string;
  expanded: boolean;
  deletable: boolean;
}

interface IProjectModel extends ITreeItem<IProjectModel> {
  color: string;
  expanded: boolean;
  deletable: boolean;
}

export default class ProjectModel extends AbstractModel
  implements IProjectModel {
  key: string = '';
  title: string = '';
  color: string = '';
  expanded: boolean = false;
  deletable: boolean = true;
  children?: ProjectModel[] = [];

  constructor(props: IJsonProjectItem) {
    super();

    const newProps = {
      ...props,
      children: props.children?.map((json) => new ProjectModel(json)),
    };

    this.load(newProps);
  }
}
