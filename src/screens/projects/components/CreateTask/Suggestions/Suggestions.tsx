import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import rootStore from '../../../../../modules/RootStore';
import Suggestion from './Suggestion';
import { createTaskStore } from '../store/CreateTaskStore';

const Suggestions: FC = () => {
  const $ = useStyle();

  const suggestions = useMemo(
    () => rootStore.tasksStore.suggestionsForProject,
    []
  ).get();

  const showSuggestions = useMemo(() => createTaskStore.isInputEmpty, []).get();

  const isVisible =
    showSuggestions && createTaskStore.inputFocus && !!suggestions.length;

  return (
    <div
      className={$.suggestions}
      style={{ display: isVisible ? undefined : 'none' }}
    >
      {suggestions.map((suggestion) => (
        <Suggestion key={suggestion.text} text={suggestion.text} />
      ))}
    </div>
  );
};

export default observer(Suggestions);

const useStyle = createUseStyles({
  suggestions: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    gap: 8,
    marginBottom: 8,
  },
});
