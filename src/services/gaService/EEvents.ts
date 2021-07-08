export enum EEventCategory {
  Hours = 'Hours',
  Projects = 'Projects',
  Tasks = 'Tasks',
  TimeRange = 'TimeRange',
}

export enum EHoursEvents {}

export enum EProjectEvents {
  Create = 'Project.Create',
  Update = 'Project.Update',
  Delete = 'Project.Delete',
}

export enum ETasksEvents {
  Create = 'Task.Create',
  Update = 'Task.Update',
  Check = 'Task.Check',
  Delete = 'Task.Delete',
  UpdDescription = 'Task.UpdDescription',
}

export enum ETimeRangeEvents {
  Update = 'TimeRange.Update',
  Delete = 'TimeRange.Delete',
}
