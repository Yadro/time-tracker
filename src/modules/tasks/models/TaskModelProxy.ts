import TaskModel from './TaskModel';

export class TaskModelProxy extends TaskModel {
  origin: TaskModel | null = null;
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
    // @ts-ignore
    target.origin[prop] = value;

    return true;
  },
};
