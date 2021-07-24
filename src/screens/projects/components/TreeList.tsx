import React from 'react';
import { Empty, Tree } from 'antd';
import { observer } from 'mobx-react';
import { Key } from 'rc-tree/lib/interface';

import { IDragInfo } from '../../../types/IDragInfo';
import { ITreeItem } from '../../../types/ITreeItem';
import { TreeProps } from 'antd/lib/tree/Tree';

interface TreeListProps {
  onSelect?: (selectedKeys: Key[]) => void;
}

interface TreePropsExtended<T>
  extends Omit<TreeProps, 'onDrop' | 'onSelect' | 'titleRender'> {
  getCheckedKeys?: () => Key[];
  getExpandedKeys?: () => Key[];
  titleRender?: (item: T) => React.ReactNode;
}

export default function TreeList<T extends ITreeItem<any>>(
  getData: () => T[],
  updateData: (items: T[]) => void,
  options: TreePropsExtended<T>
) {
  const { getCheckedKeys, getExpandedKeys, ...rest } = options;

  return observer(({ onSelect }: TreeListProps) => {
    const data = getData();

    function onDrop(info: IDragInfo) {
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split('-');
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const loop = (
        items: ITreeItem[],
        key: string | number,
        callback: (item: ITreeItem, key: number, items: ITreeItem[]) => void
      ) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].key === key) {
            return callback(items[i], i, items);
          }
          if (items[i].children) {
            loop(items[i].children as ITreeItem[], key, callback);
          }
        }
        return undefined;
      };
      const dataCopy = [...data];

      // Find dragObject
      let dragObj: ITreeItem;
      loop(dataCopy, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!info.dropToGap) {
        // Drop on the content
        loop(dataCopy, dropKey, (item) => {
          item.children = item.children || [];
          // where to insert
          item.children.unshift(dragObj);
        });
      } else if (
        (info.node.props.children || []).length > 0 && // Has children
        info.node.props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(dataCopy, dropKey, (item) => {
          item.children = item.children || [];
          // where to insert
          item.children.unshift(dragObj);
          // in previous version, we use item.children.push(dragObj) to insert the
          // item to the tail of the children
        });
      } else {
        let ar: ITreeItem[];
        let i: number;
        loop(dataCopy, dropKey, (_item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          // @ts-ignore
          ar?.splice(i, 0, dragObj);
        } else {
          // @ts-ignore
          ar?.splice(i + 1, 0, dragObj);
        }
      }

      updateData(dataCopy);
    }

    if (!data.length) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_DEFAULT}
          description={
            <>
              There are no tasks yet.
              <br />
              Type a new task name below and press Enter
            </>
          }
        />
      );
    }

    return (
      <Tree
        className="draggable-tree"
        defaultExpandParent={false}
        checkedKeys={getCheckedKeys?.()}
        expandedKeys={getExpandedKeys?.()}
        blockNode
        treeData={data}
        // @ts-ignore
        onDrop={onDrop}
        onSelect={onSelect}
        {...rest}
      />
    );
  });
}
