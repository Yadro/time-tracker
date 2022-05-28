import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react';

import Suggestion from './Suggestion';
import ObservableInput from '../observable/ObservableInput';
import rootStore from '../../../../modules/RootStore';

type Props = {
  input: ObservableInput;
};

const Suggestions: FC<Props> = ({ input }: Props) => {
  const suggestions = useMemo(
    () => rootStore.tasksStore.suggestionsForProject,
    []
  ).get();

  return (
    <>
      {suggestions.map((suggestion) => (
        <Suggestion
          key={suggestion.text}
          text={suggestion.text}
          input={input}
        />
      ))}
    </>
  );
};

export default observer(Suggestions);
