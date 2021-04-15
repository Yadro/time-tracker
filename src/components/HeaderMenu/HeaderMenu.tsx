import React from 'react';
import { observer } from 'mobx-react';

import './HeaderMenu.less';

interface HeaderMenuProps {
  children: React.ReactNode;
}

export default observer(function HeaderMenu({ children }: HeaderMenuProps) {
  return <span className="header-menu">{children}</span>;
});
