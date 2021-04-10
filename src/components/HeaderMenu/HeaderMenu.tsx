import React from 'react';

import './HeaderMenu.less';

interface HeaderMenuProps {
  children: React.ReactNode;
}

export default function HeaderMenu({ children }: HeaderMenuProps) {
  return <span className="header-menu">{children}</span>;
}
