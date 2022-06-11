import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Input } from 'antd';
import { observer } from 'mobx-react';

import { createTaskStore } from './store/CreateTaskStore';
import { createTask } from '../../../../modules/tasks/TaskStore';

interface Props {
  className?: string;
}

const handleCreateTask = (event: KeyboardEvent) => {
  // Hotkey: Enter
  if (event.key === 'Enter') {
    createTask(createTaskStore.input);
    createTaskStore.clear();
  }
};

const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
  createTaskStore.setInput(e.target.value);

const handleFocus = () => createTaskStore.setFocus(true);

export default observer(function TaskInput({ className }: Props) {
  return (
    <Input
      className={className}
      placeholder="Create task..."
      onKeyPress={handleCreateTask}
      value={createTaskStore.input}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  );
});
