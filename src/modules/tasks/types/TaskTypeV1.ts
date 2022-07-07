import { ModelWithVersion } from '../../../types/ModelWithVersion';

export interface TimeRangeTypeV1 {
  start: string;
  end?: string;
  description?: string;
}

export interface TaskTypeV1 {
  key: string;
  title: string;
  children: TaskTypeV1[] | undefined;
  // parent: TaskTypeV1 | undefined;
  projectId: string;
  checked: boolean;
  active: boolean;
  expanded: boolean;
  inMyDay: string | undefined;
  time: TimeRangeTypeV1[];
  datesInProgress: string[];
  details: string;
  withoutActions: boolean;
}

export interface TaskDataV1 extends ModelWithVersion {
  data: Record<string, TaskTypeV1[]>;
}
