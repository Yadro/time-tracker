import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react';

import rootStore from '../../../../../modules/RootStore';
import Suggestion from './Suggestion';

const Suggestions: FC = () => {
  const suggestions = useMemo(
    () => rootStore.tasksStore.suggestionsForProject,
    []
  ).get();

  return (
    <>
      {suggestions.map((suggestion) => (
        <Suggestion key={suggestion.text} text={suggestion.text} />
      ))}
    </>
  );
};

export default observer(Suggestions);
