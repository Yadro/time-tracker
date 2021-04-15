import React, { SyntheticEvent } from 'react';

import './CircleButton.less';

import cn from '../../helpers/ClassNameHelper';

interface CircleButtonProps {
  className?: string;
  onClick: (e: SyntheticEvent) => void;
  children: React.ReactNode;
}

export default function CircleButton({
  className,
  children,
  onClick,
}: CircleButtonProps) {
  return (
    <span className={cn('circle-button', className)} onClick={onClick}>
      {children}
    </span>
  );
}
