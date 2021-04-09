export interface ITreeItem<T extends ITreeItem = ITreeItem<any>> {
  title: string;
  key: string;
  children?: T[];
}
