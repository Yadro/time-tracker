import React from 'react';
import { Drawer, Input } from 'antd';
import { observer } from 'mobx-react';

import TaskModel from '../../../../models/TaskModel';

interface DrawerTaskProps {
  task: TaskModel | undefined;
  visible: boolean;
  onClose: () => void;
}

export default observer(function DrawerTask({
  task,
  visible,
  onClose,
}: DrawerTaskProps) {
  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
    >
      <Input
        value={task?.title}
        onChange={(e) => {
          const title = e.target.value;
          if (task) {
            task.setTitle(title);
          }
        }}
      />
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
});
