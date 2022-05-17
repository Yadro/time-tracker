import React, { FC, useCallback } from 'react';
import { CheckboxOptionType } from 'antd/lib/checkbox/Group';
import { AppstoreOutlined, BuildOutlined } from '@ant-design/icons';
import { Radio, RadioChangeEvent } from 'antd';
import { observer } from 'mobx-react';

import { HoursTabView } from '../types';

const ICON_STYLE = { fontSize: '20px' };
const ICON_MIRRORED_STYLE = { ...ICON_STYLE, transform: 'scale(-1, 1)' };

const options: CheckboxOptionType[] = [
  { label: <AppstoreOutlined style={ICON_STYLE} />, value: HoursTabView.Edit },
  {
    label: <BuildOutlined style={ICON_MIRRORED_STYLE} />,
    value: HoursTabView.Timeline,
  },
];

type Props = {
  tab: HoursTabView;
  onChange(val: HoursTabView): void;
};

const RadioGroupChangeHoursView: FC<Props> = ({ tab, onChange }: Props) => {
  const handleOnChange = useCallback(
    (e: RadioChangeEvent) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <Radio.Group
      options={options}
      optionType="button"
      buttonStyle="solid"
      value={tab}
      onChange={handleOnChange}
    />
  );
};

export default observer(RadioGroupChangeHoursView);
