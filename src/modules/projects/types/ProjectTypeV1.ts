import { ITreeItemWithParent } from '../../../types/ITreeItem';
import { ModelWithVersion } from '../../../types/ModelWithVersion';

export interface ProjectTypeV1 extends ITreeItemWithParent {
  color: string;
  expanded: boolean;
  deletable: boolean;
  children?: ProjectTypeV1[];
}

export interface ProjectDataV1 extends ModelWithVersion {
  data: ProjectTypeV1[];
}
