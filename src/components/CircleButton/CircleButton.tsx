import React, { SyntheticEvent } from 'react';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

interface CircleButtonProps {
  className?: string;
  onClick: (e: SyntheticEvent) => void;
  children: React.ReactNode;
}

export default observer(function CircleButton({
  className,
  children,
  onClick,
}: CircleButtonProps) {
  const classes = useStyles();

  return (
    <span className={clsx(classes.circleButton, className)} onClick={onClick}>
      {children}
    </span>
  );
});

const useStyles = createUseStyles({
  circleButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    width: 28,
    borderRadius: 14,
    cursor: 'pointer',
    backgroundColor: 'black',
  },
});
