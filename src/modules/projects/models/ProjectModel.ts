import * as colors from '@ant-design/colors';
import { makeObservable, observable } from 'mobx';

import AbstractModel from '../../../base/AbstractModel';
import { ITreeItemWithParent } from '../../../types/ITreeItem';

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
    parent: undefined,
  },
];

export interface IJsonProjectItem extends ITreeItemWithParent {
  color: string;
  expanded: boolean;
  deletable: boolean;
  children?: IJsonProjectItem[];
}

interface IProjectModel extends ITreeItemWithParent {
  color: string;
  expanded: boolean;
  deletable: boolean;
  children?: IProjectModel[];
}

export default class ProjectModel extends AbstractModel
  implements IProjectModel {
  key: string = '';
  title: string = '';
  color: string = '';
  expanded: boolean = false;
  deletable: boolean = true;
  children?: ProjectModel[] = [];
  parent: ProjectModel | undefined;

  constructor(props: IJsonProjectItem) {
    super();

    const newProps = {
      ...props,
      children: props.children?.map((json) => new ProjectModel(json)),
    };

    this.load(newProps);

    makeObservable(this, {
      key: observable,
      title: observable,
      color: observable,
      expanded: observable,
      deletable: observable,
      children: observable,
      // parent: none,
    });
  }
}
