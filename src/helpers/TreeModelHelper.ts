import { ITreeItem, ITreeItemWithParent } from '../types/ITreeItem';
import { TaskInMyDay } from '../modules/tasks/models/TaskInMyDay';
import TaskModel from '../modules/tasks/models/TaskModel';
import TaskFactory from '../modules/tasks/TaskFactory';
import ProjectModel from '../modules/projects/models/ProjectModel';

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

  copyItemsToTreeUnderProject(
    project: ProjectModel | undefined,
    sourceTree: TaskModel[],
    destTree: TaskInMyDay[],
    keysToNode: string[]
  ): boolean {
    if (!project) {
      return false;
    }

    let destProject = destTree.find((node) => node.key === project.key);
    if (!destProject) {
      destProject = TaskFactory.createTaskModelProxy(
        new TaskModel({
          key: project.key,
          projectId: project.key,
          title: project.title,
          active: false,
          checked: false,
          children: [],
          datesInProgress: [],
          details: [],
          expanded: true,
          inMyDay: new Date().toString(),
          parent: undefined,
          time: [],
          withoutActions: true,
        })
      );
      destTree.push(destProject);
    }

    return TreeModelHelper.copyItemsToTree(
      sourceTree,
      destProject.children || [],
      keysToNode
    );
  },

  /**
   * Make a copy of tasks to 'My Day'
   */
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
        sourceChildren = nextSourceNode.children || [];
        destChildren = nextDestNode.children || [];
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

      destChildren = copyNode.children || [];
      sourceNode = sourceNode.children?.find(
        (node) => node.key === keysToNode[keyIdx]
      );
      if (!sourceNode) {
        return false;
      }
    }
  },

  walkRecursive<T extends ITreeItem>(
    fn: (item: T, parent?: T) => void,
    treeItems: T[],
    parent?: T
  ) {
    treeItems.forEach((item) => {
      fn(item, parent);
      if (item.children?.length) {
        this.walkRecursive(fn, item.children as T[], item);
      }
    });
  },

  walkToParent<T extends ITreeItemWithParent>(
    fn: (nParent: T) => void,
    treeItem: T
  ) {
    if (treeItem.parent) {
      fn(treeItem.parent as T);
      this.walkToParent(fn, treeItem.parent as T);
    }
  },

  modifyItemsWithIdsRecursive<T extends ITreeItem>(
    treeItems: T[],
    ids: string[],
    fn: (treeItem: T, ids: string[]) => void
  ) {
    treeItems.forEach((item) => {
      fn(item, ids);
      if (Array.isArray(item.children) && item.children.length) {
        this.modifyItemsWithIdsRecursive(item.children as T[], ids, fn);
      }
    });
  },

  getItemRecursive<T extends ITreeItem>(
    items: T[],
    condition: (task: T) => boolean
  ): T | undefined {
    for (const item of items) {
      if (condition(item)) {
        return item;
      }
      if (item.children?.length) {
        const found = this.getItemRecursive(item.children as T[], condition);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  },

  getFlatItemsRecursive<T extends ITreeItem>(
    tree: T[],
    condition: (task: T) => boolean
  ): T[] {
    const result: T[] = [];

    this.getFlatItemsRecursiveBase(tree, condition, result);

    return result;
  },

  getFlatItemsRecursiveBase<T extends ITreeItem>(
    treeItems: T[],
    condition: (item: T) => boolean,
    result: T[]
  ): T[] {
    treeItems.forEach((item) => {
      if (condition(item)) {
        result.push(item);
      }
      if (item.children?.length) {
        this.getFlatItemsRecursiveBase(item.children as T[], condition, result);
      }
    });
    return result;
  },

  deleteItems<T extends ITreeItem>(
    treeItems: T[],
    condition: (item: T) => boolean
  ): T[] {
    const result = treeItems.filter((t) => !condition(t));
    result.forEach((item) => {
      if (item.children?.length) {
        item.children = this.deleteItems(item.children as T[], condition);
      }
    });
    return result;
  },
};

export default TreeModelHelper;
