import React from 'react';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

interface IconTileProps {
  children: React.ReactNode;
  backgroundColor: string;
  className?: string;
}

export default observer(function IconTile({
  className,
  children,
  backgroundColor,
}: IconTileProps) {
  const classes = useStyles();

  return (
    <span className={clsx(classes.root, className)} style={{ backgroundColor }}>
      {children}
    </span>
  );
});

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    padding: 8,
    borderRadius: 5,
  },
});
