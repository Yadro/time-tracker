export interface TimeRangeTypeV0 {
  start: string;
  end?: string;
  description?: string;
}

export interface TaskTypeV0 {
  key: string;
  title: string;
  children: TaskTypeV0[] | undefined;
  // parent: TaskTypeV0 | undefined;
  projectId: string;
  checked: boolean;
  active: boolean;
  expanded: boolean;
  inMyDay: string | undefined;
  time: TimeRangeTypeV0[];
  datesInProgress: string[];
  details: string;
  withoutActions: boolean;
}

export type TaskDataV0 = Record<string, TaskTypeV0[]>;
