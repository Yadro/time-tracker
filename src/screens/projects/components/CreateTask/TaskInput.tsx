import React, { ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { observer } from 'mobx-react';
import { v4 as uuid } from 'uuid';

import rootStore from '../../../../modules/RootStore';
import TaskModel from '../../../../modules/tasks/models/TaskModel';
import { createTaskStore } from './store/CreateTaskStore';

interface Props {
  className?: string;
}

const handleCreateTask = (event: KeyboardEvent) => {
  // Hotkey: Enter
  if (event.key === 'Enter') {
    const { tasksStore, projectStore } = rootStore;
    tasksStore.add(
      new TaskModel({
        key: uuid(),
        title: createTaskStore.input,
        projectId: projectStore.activeProject,
        active: false,
        time: [],
        checked: false,
        children: [],
        datesInProgress: [],
        details: [],
        parent: undefined, // Add into root
        expanded: true,
      })
    );
    createTaskStore.clear();
  }
};

const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
  createTaskStore.setInput(e.target.value);

const handleFocus = () => createTaskStore.setFocus(true);

export default observer(function TaskInput({ className }: Props) {
  const inputRef = useRef<Input>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [createTaskStore.focusTrigger]);

  return (
    <Input
      ref={inputRef}
      className={className}
      placeholder="Create task..."
      onKeyPress={handleCreateTask}
      value={createTaskStore.input}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  );
});
