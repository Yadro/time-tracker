import { ITreeItem, ITreeItemWithParent } from '../types/ITreeItem';
import { TaskInMyDay } from '../modules/tasks/models/TaskInMyDay';
import TaskModel from '../modules/tasks/models/TaskModel';
import TaskFactory from '../modules/tasks/TaskFactory';

const TreeModelHelper = {
  getPathToNode<T extends ITreeItemWithParent = ITreeItemWithParent>(node: T) {
    const result: string[] = [];

    let ptrNode: T | undefined = node;
    while (ptrNode) {
      result.unshift(ptrNode.key);
      // @ts-ignore
      ptrNode = ptrNode.parent;
    }

    return result;
  },

  copyItemsToTree(
    sourceTree: TaskModel[],
    destTree: TaskInMyDay[],
    keysToNode: string[]
  ) {
    let keyIdx = 0;
    let sourceChildren = sourceTree;
    let destChildren = destTree;

    if (keysToNode.length === 1) {
      const source = sourceChildren.find((node) => node.key === keysToNode[0]);
      if (source) {
        destChildren.push(TaskFactory.createTaskModelProxy(source));
      }
      return !!source;
    }

    do {
      const nextSourceNode = sourceChildren.find(
        (task) => task.key === keysToNode[keyIdx]
      );
      if (!nextSourceNode) {
        return false;
      }

      const nextDestNode = destChildren.find(
        (task) => task.key === keysToNode[keyIdx]
      );

      if (nextDestNode) {
        // We already have a copy of node, go on
        keyIdx++;
        sourceChildren = nextSourceNode.children;
        destChildren = nextDestNode.children;
      } else {
        // Make a copy from this node
        const restKeysToNode = keysToNode.slice(keyIdx);
        return TreeModelHelper.copySubItemsToTree(
          sourceChildren,
          destChildren,
          restKeysToNode
        );
      }
    } while (keyIdx < keysToNode.length);

    return true;
  },

  copySubItemsToTree(
    sourceTree: TaskModel[],
    destTree: TaskInMyDay[],
    keysToNode: string[]
  ) {
    if (!sourceTree) {
      return false;
    }

    let keyIdx = 0;
    let destChildren = destTree;
    let sourceNode = sourceTree.find((node) => node.key === keysToNode[keyIdx]);

    if (!sourceNode) {
      return false;
    }

    while (true) {
      const copyNode = TaskFactory.createTaskModelProxy(sourceNode);
      destChildren.push(copyNode);

      keyIdx++;
      if (keyIdx === keysToNode.length) {
        return true;
      }

      destChildren = copyNode.children;
      sourceNode = sourceNode.children.find(
        (node) => node.key === keysToNode[keyIdx]
      );
      if (!sourceNode) {
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
