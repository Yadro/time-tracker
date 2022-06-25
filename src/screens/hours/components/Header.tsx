import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Col, Row } from 'antd';
import { createUseStyles } from 'react-jss';

import SelectDate from '../../../components/SelectDate';
import RadioGroupChangeHoursView from './RadioGroupChangeHoursView';
import { HoursTabView } from '../types';

type Props = {
  date: Date;
  setDate(date: Date): void;
  tab: HoursTabView;
  setTab(tab: HoursTabView): void;
};

const Header: FC<Props> = ({ date, setDate, tab, setTab }: Props) => {
  const classes = useStyles();

  return (
    <Row className={classes.main}>
      <Col span={8} offset={8} className={classes.alignCenter}>
        <SelectDate date={date} onChange={setDate} />
      </Col>
      <Col span={8} className={classes.alignRight}>
        <RadioGroupChangeHoursView tab={tab} onChange={setTab} />
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
