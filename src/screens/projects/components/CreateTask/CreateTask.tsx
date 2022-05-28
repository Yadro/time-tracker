import React, { FC, useMemo, useRef } from 'react';
import { observer } from 'mobx-react';

import TaskInput from './TaskInput';
import Suggestions from './Suggestions/Suggestions';
import { createTaskStore } from './store/CreateTaskStore';
import useOutsideClick from '../../../../hooks/useOutsideClick';

const handleBlur = () => createTaskStore.setFocus(false);

const CreateTask: FC = () => {
  const ref = useRef(null);

  useOutsideClick(ref, handleBlur);

  const showSuggestions = useMemo(() => createTaskStore.isInputEmpty, []).get();

  return (
    <div ref={ref}>
      {showSuggestions && createTaskStore.inputFocus && <Suggestions />}
      <TaskInput />
    </div>
  );
};

export default observer(CreateTask);
