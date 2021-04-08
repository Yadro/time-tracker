import React from 'react';
import { Tree } from 'antd';
import { observer } from 'mobx-react';
import { Key } from 'rc-tree/lib/interface';

import { IDragInfo } from '../../../types/IDragInfo';
import { IDraggableItem } from '../../../types/IDraggableItem';

interface DraggableListProps {
  onSelect?: (selectedKeys: Key[]) => void;
}

export default function DraggableList<T extends IDraggableItem>(
  getData: () => T[],
  updateData: (items: T[]) => void
) {
  return observer(function DraggableList({ onSelect }: DraggableListProps) {
    const data = getData();

    function onDrop(info: IDragInfo) {
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split('-');
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const loop = (
        draggableItems: IDraggableItem[],
        key: string | number,
        callback: (
          item: IDraggableItem,
          key: number,
          items: IDraggableItem[]
        ) => void
      ) => {
        for (let i = 0; i < draggableItems.length; i++) {
          if (draggableItems[i].key === key) {
            return callback(draggableItems[i], i, draggableItems);
          }
          if (draggableItems[i].children) {
            loop(draggableItems[i].children as IDraggableItem[], key, callback);
          }
        }
        return undefined;
      };
      const dataCopy = [...data];

      // Find dragObject
      let dragObj: IDraggableItem;
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
        let ar: IDraggableItem[];
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
        draggable
        blockNode
        onDrop={onDrop}
        treeData={data}
        onSelect={onSelect}
      />
    );
  });
}
