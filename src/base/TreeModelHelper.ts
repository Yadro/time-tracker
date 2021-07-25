import { ITreeItem, ITreeItemWithParent } from '../types/ITreeItem';
import { TaskModelProxy } from '../modules/tasks/models/TaskModelProxy';
import TaskModel from '../modules/tasks/models/TaskModel';

const TreeModelHelper = {
  getPathToNode<T extends ITreeItemWithParent>(node: T) {
    const result: string[] = [];

    let ptrNode = node;
    while (ptrNode) {
      result.unshift(ptrNode.key);
      // @ts-ignore
      ptrNode = ptrNode.parent;
    }

    return result;
  },
  copyItemsToTree(
    sourceTree: TaskModel[],
    destTree: TaskModelProxy[],
    keysToTask: string[]
  ) {
    let keyIdx = 0;
    let sourceChildren = sourceTree;
    let destChildren = destTree;

    if (keysToTask.length === 1) {
      const source = sourceChildren.find((node) => node.key === keysToTask[0]);
      destChildren.push(
        // @ts-ignore
        new TaskModelProxy({
          ...source,
          children: [],
        })
      );
      return true;
    }

    do {
      const nextSourceNode = sourceChildren.find(
        (task) => task.key === keysToTask[keyIdx]
      );
      if (!nextSourceNode) {
        return false;
      }

      const nextDestNode = destChildren.find(
        (task) => task.key === keysToTask[keyIdx]
      );

      if (nextDestNode) {
        keyIdx++;
        sourceChildren = nextSourceNode.children;
        destChildren = nextDestNode.children;
      } else {
        const restKeysToTask = keysToTask.slice(keyIdx);
        return TreeModelHelper.copySubItemsToTree(
          sourceChildren,
          destChildren,
          restKeysToTask
        );
      }
    } while (keyIdx < keysToTask.length);

    return true;
  },

  copySubItemsToTree(
    sourceTree: TaskModel[],
    destTree: TaskModelProxy[],
    keysToTask: string[]
  ) {
    if (!sourceTree) {
      return false;
    }

    let keyIdx = 0;
    let dest = destTree;
    let source = sourceTree.find((node) => node.key === keysToTask[keyIdx]);

    if (!source) {
      return false;
    }

    while (true) {
      // @ts-ignore
      let copy = new TaskModelProxy({
        ...source,
        children: [],
      });

      dest.push(copy);

      keyIdx++;
      if (keyIdx === keysToTask.length) {
        return true;
      }

      dest = copy.children;
      source = source.children.find((node) => node.key === keysToTask[keyIdx]);
      if (!source) {
        return false;
      }
    }
  },

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
