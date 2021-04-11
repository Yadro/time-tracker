export interface ITreeItem<T extends ITreeItem<any> = ITreeItem<any>> {
  title: string;
  key: string;
  children?: T[];
}
