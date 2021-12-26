export interface IJsonProjectItem extends ITreeItemWithParent {
  color: string;
  expanded: boolean;
  deletable: boolean;
  children?: IJsonProjectItem[];
}
