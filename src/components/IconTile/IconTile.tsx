import React from 'react';

import './IconTile.less';
import cn from '../../helpers/ClassNameHelper';

interface IconTileProps {
  children: React.ReactNode;
  backgroundColor: string;
  className: string;
}

export default function IconTile({
  className,
  children,
  backgroundColor,
}: IconTileProps) {
  return (
    <span className={cn('icon-tile', className)} style={{ backgroundColor }}>
      {children}
    </span>
  );
}
