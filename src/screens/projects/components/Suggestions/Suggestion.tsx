import React, { FC, useCallback } from 'react';
import { Button } from 'antd';
import { observer } from 'mobx-react';

import ObservableInput from '../observable/ObservableInput';

type Props = {
  text: string;
  input: ObservableInput;
};

const SuggestionComp: FC<Props> = ({ text, input }: Props) => {
  const handleApplySuggestion = useCallback(() => input.setSuggestion(text), [
    input,
    text,
  ]);

  return (
    <Button
      type="primary"
      shape="round"
      // icon={}
      size="small"
      onClick={handleApplySuggestion}
    >
      {text}
    </Button>
  );
};

export default observer(SuggestionComp);
