import React, { KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { observer } from 'mobx-react';
import { v4 as uuid } from 'uuid';

import rootStore from '../../../modules/RootStore';
import TaskModel from '../../../modules/tasks/models/TaskModel';
import ObservableInput from './observable/ObservableInput';

interface Props {
  className?: string;
  input: ObservableInput;
}

export default observer(function TaskInput({ className, input }: Props) {
  const inputRef = useRef<Input>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [input.focusTrigger]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Hotkey: Enter
      if (event.key === 'Enter') {
        const { tasksStore, projectStore } = rootStore;
        tasksStore.add(
          new TaskModel({
            key: uuid(),
            title: input.value,
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
        input.clear();
      }
    },
    [input]
  );

  const handleChange = useCallback((e: any) => input.set(e.target.value), [
    input,
  ]);

  return (
    <Input
      ref={inputRef}
      className={className}
      placeholder="Create task..."
      onKeyPress={handleKeyPress}
      value={input.value}
      onChange={handleChange}
    />
  );
});
