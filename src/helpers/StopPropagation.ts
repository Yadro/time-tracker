import React from 'react';

export const stopPropagation = (e: React.SyntheticEvent | undefined) => {
  e?.stopPropagation();
};

export const stopPropagationAndRun = (fn: () => void) => {
  return (e: React.SyntheticEvent | undefined) => {
    e?.stopPropagation();
    fn();
  };
};
