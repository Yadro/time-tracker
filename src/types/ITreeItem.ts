export interface ITreeItem {
  title: string;
  key: string;
  children?: ITreeItem[];
}

export interface ITreeItemWithParent extends ITreeItem {
  parent: ITreeItemWithParent | undefined;
}
