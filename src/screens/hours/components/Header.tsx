import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Col, Row } from 'antd';
import { createUseStyles } from 'react-jss';

import SelectDate from '../../../components/SelectDate';
import RadioGroupChangeHoursView from './RadioGroupChangeHoursView';

type Props = {
  date: Date;
  setDate(date: Date): void;
};

const Header: FC<Props> = ({ date, setDate }: Props) => {
  const classes = useStyles();

  return (
    <Row className={classes.main}>
      <Col span={8} offset={8} className={classes.alignCenter}>
        <SelectDate date={date} onChange={setDate} />
      </Col>
      <Col span={8} className={classes.alignRight}>
        <RadioGroupChangeHoursView onChange={(_option) => {}} />
      </Col>
    </Row>
  );
};

export default observer(Header);

const useStyles = createUseStyles({
  main: {
    flex: 1,
  },
  alignCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  alignRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
