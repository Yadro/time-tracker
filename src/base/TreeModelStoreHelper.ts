import { ITreeItem } from '../types/ITreeItem';

export default abstract class TreeModelStoreHelper {
  static getItemRecursive<T extends ITreeItem<any>>(
    tasks: T[],
    condition: (task: T) => boolean
  ): T | undefined {
    for (const task of tasks) {
      if (condition(task)) {
        return task;
      }
      if (Array.isArray(task.children)) {
        const found = this.getItemRecursive(task.children, condition);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  static getFlatItemsRecursive<T extends ITreeItem<any>>(
    tree: T[],
    condition: (task: T) => boolean
  ): T[] {
    const result: T[] = [];

    this.getFlatItemsRecursiveBase(tree, condition, result);

    return result;
  }

  static getFlatItemsRecursiveBase<T extends ITreeItem<any>>(
    tasks: T[],
    condition: (task: T) => boolean,
    result: T[]
  ): T[] {
    for (const task of tasks) {
      if (condition(task)) {
        result.push(task);
      }
      if (Array.isArray(task.children)) {
        this.getFlatItemsRecursiveBase(task.children, condition, result);
      }
    }
    return result;
  }

  static deleteItems<T extends ITreeItem<any>>(
    tasks: T[],
    condition: (task: T) => boolean
  ): T[] {
    const result = tasks.filter((t) => !condition(t));
    for (let i = 0; i < result.length; i++) {
      const task = tasks[i];
      if (Array.isArray(task.children)) {
        tasks[i].children = this.deleteItems(task.children, condition);
      }
    }
    return result;
  }
}
