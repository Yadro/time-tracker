export interface ITreeItem<T extends ITreeItem<any> = ITreeItem<any>> {
  title: string;
  key: string;
  children?: T[];
}

export interface ITreeItemWithParent<
  T extends ITreeItemWithParent<any> = ITreeItemWithParent<any>
> extends ITreeItem<T> {
  parent: T | undefined;
}
