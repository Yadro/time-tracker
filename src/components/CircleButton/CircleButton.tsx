import React from 'react';

import './CircleButton.less';

export default function CircleButton({ children, onClick }) {
  return (
    <span className="circle-button" onClick={onClick}>
      {children}
    </span>
  );
}
