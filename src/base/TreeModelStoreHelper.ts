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

  static getItemsRecursive<T extends ITreeItem<any>>(
    tasks: T[],
    condition: (task: T) => boolean,
    result: T[]
  ): T[] {
    for (const task of tasks) {
      if (condition(task)) {
        result.push(task);
      }
      if (Array.isArray(task.children)) {
        this.getItemsRecursive(task.children, condition, result);
      }
    }
    return result;
  }
}
