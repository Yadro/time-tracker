import React, { KeyboardEvent, useState } from 'react';
import { Input } from 'antd';
import { observer } from 'mobx-react';

import rootStore from '../../../modules/RootStore';
import TaskModel from '../../../modules/tasks/models/TaskModel';

export default observer(function TaskInput() {
  const [text, setText] = useState('');

  function handleKeyPress(event: KeyboardEvent) {
    // Hotkey: Enter
    if (event.key === 'Enter') {
      const { tasksStore, projectStore } = rootStore;
      tasksStore.add(
        new TaskModel({
          key: String(Date.now()),
          title: text,
          projectId: projectStore.activeProject,
          active: false,
          time: [],
          checked: false,
          children: [],
          datesInProgress: [],
          details: [],
        })
      );
      setText('');
    }
  }

  return (
    <Input
      placeholder="Create task..."
      onKeyPress={handleKeyPress}
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
});
