import React from 'react';
import { Tree } from 'antd';
import { observer } from 'mobx-react';
import { Key } from 'rc-tree/lib/interface';

import { IDragInfo } from '../../../types/IDragInfo';
import { ITreeItem } from '../../../types/ITreeItem';

interface TreeListProps {
  onSelect?: (selectedKeys: Key[]) => void;
}

export default function TreeList<T extends ITreeItem>(
  getData: () => T[],
  updateData: (items: T[]) => void,
  options?: {
    checkable?: boolean;
    selectable?: boolean;
    onCheck?: (checkedKeys: React.Key[]) => void;
    getCheckedKeys?: () => React.Key[];
    titleRender?: (nodeData: T) => React.ReactNode;
  }
) {
  return observer(function TreeList({ onSelect }: TreeListProps) {
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
        let i;
        loop(dataCopy, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar?.splice(i, 0, dragObj);
        } else {
          ar?.splice(i + 1, 0, dragObj);
        }
      }

      updateData(dataCopy);
    }

    return (
      <Tree
        className="draggable-tree"
        checkedKeys={options?.getCheckedKeys?.()}
        checkable={options?.checkable}
        draggable
        selectable={options?.selectable}
        blockNode
        onDrop={onDrop}
        treeData={data}
        onSelect={onSelect}
        onCheck={options?.checkable ? options?.onCheck : undefined}
        titleRender={options?.titleRender}
      />
    );
  });
}
