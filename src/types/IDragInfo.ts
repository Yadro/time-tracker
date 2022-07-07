import React from 'react';
import { EventDataNode, Key } from 'rc-tree/lib/interface';

export interface IDragInfo<T = HTMLDivElement> {
  event: React.MouseEvent<T>;
  node: EventDataNode & {
    props: {
      children: any[];
      expanded: boolean;
    };
  };
  dragNode: EventDataNode;
  dragNodesKeys: Key[];
  dropPosition: number;
  dropToGap: boolean;
}
