import { ITreeItemWithParent } from '../../../types/ITreeItem';

export interface ProjectTypeV0 extends ITreeItemWithParent {
  color: string;
  expanded: boolean;
  deletable: boolean;
  children?: ProjectTypeV0[];
}

export type ProjectDataV0 = ProjectTypeV0[];
