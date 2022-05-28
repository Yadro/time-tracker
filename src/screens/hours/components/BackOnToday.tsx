import React, { FC } from 'react';
import { Button } from 'antd';
import { observer } from 'mobx-react';

type Props = {
  goToday(): void;
};

const BackOnToday: FC<Props> = ({ goToday }: Props) => {
  return <Button onClick={goToday} title={'Go back'} />;
};

export default observer(BackOnToday);
