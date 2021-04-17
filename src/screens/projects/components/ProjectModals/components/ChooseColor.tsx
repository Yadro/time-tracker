import React from 'react';
import {
  red,
  volcano,
  blue,
  cyan,
  geekblue,
  gold,
  green,
  grey,
  lime,
  magenta,
  orange,
  purple,
  yellow,
} from '@ant-design/colors';
import { CheckOutlined } from '@ant-design/icons';

import './ChooseColor.less';
import cn from '../../../../../helpers/ClassNameHelper';

const colors = [
  red,
  volcano,
  orange,
  gold,
  yellow,
  lime,
  green,
  cyan,
  blue,
  geekblue,
  purple,
  magenta,
  grey,
].map((color) => color.primary);

interface ChooseColorProps {
  activeColor: string | undefined;
  onChoose: (color: string) => void;
}

export default function ChooseColor({
  activeColor,
  onChoose,
}: ChooseColorProps) {
  return (
    <div className="choose-color">
      {colors.map((color, index) => (
        <div
          key={index}
          className={cn('color', activeColor === color && 'active')}
          style={{ backgroundColor: color }}
          onClick={() => {
            if (color) {
              onChoose(color);
            }
          }}
        >
          {activeColor === color && (
            <CheckOutlined style={{ color: 'white' }} />
          )}
        </div>
      ))}
    </div>
  );
}
