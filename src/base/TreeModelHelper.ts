import { ITreeItem } from '../types/ITreeItem';

const TreeModelHelper = {
  walkRecursive<T extends ITreeItem<any>>(
    fn: (t: T, p?: T) => void,
    treeItems: T[],
    parent?: T
  ) {
    treeItems.forEach((item) => {
      fn(item, parent);
      if (item.children?.length) {
        TreeModelHelper.walkRecursive(fn, item.children, item);
      }
    });
  },

  modifyItemsWithIdsRecursive<T extends ITreeItem<any>>(
    treeItems: T[],
    ids: string[],
    fn: (treeItem: T, ids: string[]) => void
  ) {
    treeItems.forEach((item) => {
      fn(item, ids);
      if (Array.isArray(item.children) && item.children.length) {
        TreeModelHelper.modifyItemsWithIdsRecursive(item.children, ids, fn);
      }
    });
  },

  getItemRecursive<T extends ITreeItem<any>>(
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
  },

  getFlatItemsRecursive<T extends ITreeItem<any>>(
    tree: T[],
    condition: (task: T) => boolean
  ): T[] {
    const result: T[] = [];

    this.getFlatItemsRecursiveBase(tree, condition, result);

    return result;
  },

  getFlatItemsRecursiveBase<T extends ITreeItem<any>>(
    treeItems: T[],
    condition: (item: T) => boolean,
    result: T[]
  ): T[] {
    for (const item of treeItems) {
      if (condition(item)) {
        result.push(item);
      }
      if (Array.isArray(item.children)) {
        this.getFlatItemsRecursiveBase(item.children, condition, result);
      }
    }
    return result;
  },

  deleteItems<T extends ITreeItem<any>>(
    treeItems: T[],
    condition: (task: T) => boolean
  ): T[] {
    const result = treeItems.filter((t) => !condition(t));
    for (let i = 0; i < result.length; i++) {
      const task = treeItems[i];
      if (Array.isArray(task.children)) {
        treeItems[i].children = this.deleteItems(task.children, condition);
      }
    }
    return result;
  },
};

export default TreeModelHelper;
