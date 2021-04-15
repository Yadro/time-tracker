import React from 'react';
import { Button, DatePicker, Space } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import addDays from 'date-fns/addDays';

interface SelectDateProps {
  date: Date;
  onChange: (date: Date) => void;
}

function changeDate(date: Date, offsetDay: number) {
  return addDays(date, offsetDay);
}

export default function SelectDate({ date, onChange }: SelectDateProps) {
  return (
    <Space direction="horizontal">
      <Button
        icon={<LeftOutlined />}
        onClick={() => onChange(changeDate(date, -1))}
      />
      <DatePicker
        value={moment(date)}
        onChange={(date) => onChange(date?.toDate() || new Date())}
        allowClear={false}
        placeholder="Date"
        inputReadOnly
        format={'ddd DD MMM'}
      />
      <Button
        icon={<RightOutlined />}
        onClick={() => onChange(changeDate(date, 1))}
      />
    </Space>
  );
}
