import React, { FC } from 'react';
import { CheckboxOptionType } from 'antd/lib/checkbox/Group';
import { AppstoreOutlined, BuildOutlined } from '@ant-design/icons';
import { Radio } from 'antd';
import { observer } from 'mobx-react';

enum Options {
  Edit,
  Timeline,
}

const ICON_STYLE = { fontSize: '20px' };

const options: CheckboxOptionType[] = [
  { label: <AppstoreOutlined style={ICON_STYLE} />, value: Options.Edit },
  { label: <BuildOutlined style={ICON_STYLE} />, value: Options.Timeline },
];

type Props = {
  onChange(val: Options): void;
};

const RadioGroupChangeHoursView: FC<Props> = () => {
  return (
    <Radio.Group options={options} optionType="button" buttonStyle="solid" />
  );
};

export default observer(RadioGroupChangeHoursView);
