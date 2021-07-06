import React from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';
import { Tooltip } from 'antd';

export interface ILabelWithTooltipProps {
  icon?: string;
  label: string;
  tooltip: string;
}

const LabelWithTooltip: React.VFC<ILabelWithTooltipProps> = (
  props: ILabelWithTooltipProps
) => {
  const { icon, label, tooltip } = props;
  const classes = useStyles();

  return (
    <Tooltip title={tooltip} placement="bottom">
      <div className={classes.iconAndLabel}>
        {icon && <span className={clsx('mi', icon, classes.icon)} />}
        <span>{label}</span>
      </div>
    </Tooltip>
  );
};

const useStyles = createUseStyles({
  iconAndLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    color: '#5f6368',
    marginRight: 4,
  },
});

export default LabelWithTooltip;
