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
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

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
  const classes = useStyle();

  return (
    <div className={classes.root}>
      {colors.map((color, index) => (
        <div
          key={index}
          className={clsx(
            classes.color,
            activeColor === color && classes.colorActive
          )}
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

const useStyle = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  color: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    height: 20,
    width: 20,
    marginRight: 8,
    borderRadius: 3,

    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  colorActive: {
    transform: 'scale(1.1)',
  },
});
