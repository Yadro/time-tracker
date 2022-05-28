import React, { FC, useCallback } from 'react';
import { Button } from 'antd';
import { observer } from 'mobx-react';

import { createTaskStore } from '../store/CreateTaskStore';

type Props = {
  text: string;
};

const SuggestionComp: FC<Props> = ({ text }: Props) => {
  const handleApplySuggestion = useCallback(
    () => createTaskStore.applySuggestion(text),
    [text]
  );

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
