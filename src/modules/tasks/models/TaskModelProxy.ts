import TaskModel from './TaskModel';

export class TaskModelProxy extends TaskModel {
  origin: TaskModel | null = null;
  children: TaskModelProxy[] = [];

  constructor(originTaskModel: TaskModel, children: TaskModelProxy[]) {
    super(originTaskModel);
    this.origin = originTaskModel;
    this.children = children;
  }
}

export const taskModelProxyHandler: ProxyHandler<TaskModelProxy> = {
  get(target: TaskModelProxy, prop: string | symbol): any {
    return target?.origin?.[prop as keyof TaskModel];
  },
  set(target: TaskModelProxy, prop: string | symbol, value: any): boolean {
    if (prop === 'duration') {
      console.error(
        `TaskModel: Can't set prop '${prop.toString()}' in`,
        target
      );
      return false;
    }
    // @ts-ignore
    target[prop] = value;

    if (prop !== 'expanded') {
      // @ts-ignore
      target.origin[prop] = value;
    }

    return true;
  },
};
