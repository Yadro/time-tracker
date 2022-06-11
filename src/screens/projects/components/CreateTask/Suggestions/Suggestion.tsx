import React, { FC, useCallback } from 'react';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

import { createTaskStore } from '../store/CreateTaskStore';
import { createTask } from '../../../../../modules/tasks/TaskStore';

type Props = {
  text: string;
};

const SuggestionComp: FC<Props> = ({ text }: Props) => {
  const $ = useStyle();

  const handleApplySuggestion = useCallback(() => {
    createTask(text);
    createTaskStore.afterApplySuggestion();
  }, [text]);

  return (
    <Button
      className={$.suggestion}
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

const useStyle = createUseStyles({
  suggestion: {
    '& span': {
      maxWidth: 200,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
});
