import React from 'react';
import { observer } from 'mobx-react';
import { createUseStyles } from 'react-jss';

interface HeaderMenuProps {
  children: React.ReactNode;
}

export default observer(function HeaderMenu({ children }: HeaderMenuProps) {
  const classes = useStyles();

  return <span className={classes.root}>{children}</span>;
});

const useStyles = createUseStyles({
  root: {
    padding: '0 20px',

    '& a': {
      color: 'white',
    },
  },
});
