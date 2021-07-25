import TaskModel from './TaskModel';

export class TaskInMyDay extends TaskModel {
  origin: TaskModel | null = null;
  children: TaskInMyDay[] = [];

  constructor(originTaskModel: TaskModel, children: TaskInMyDay[]) {
    super(originTaskModel);
    this.origin = originTaskModel;
    this.children = children;
  }
}

export const taskModelProxyHandler: ProxyHandler<TaskInMyDay> = {
  get(target: TaskInMyDay, prop: string | symbol): any {
    return target?.[prop as keyof TaskInMyDay];
  },
  set(target: TaskInMyDay, prop: string | symbol, value: any): boolean {
    if (prop === 'duration') {
      console.error(
        `TaskModel: Can't set prop '${prop.toString()}' in`,
        target
      );
      return false;
    }
    // @ts-ignore
    target[prop] = value;

    if (!['expanded', 'children'].includes(prop as string)) {
      // @ts-ignore
      target.origin[prop] = value;
    }

    return true;
  },
};
