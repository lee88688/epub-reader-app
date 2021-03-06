import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '8px',
    boxSizing: 'content-box'
  },
  icon: {
    width: '0.7em',
    height: '0.7em',
    backgroundColor: 'currentColor',
    borderRadius: '50%',
    backgroundClip: 'content-box',
    border: '0.3em solid rgba(0, 0, 0, 0)'
  },
  checkedIcon: {
    backgroundClip: 'border-box',
    border: '0.3em solid rgba(255, 255, 255, 0.9)'
  }
}));

export default function ColorRadio(props) {
  const { color = 'red', ...otherProps } = props;
  const classes = useStyles();

  const checkedIcon = useMemo(() => (
    <span className={clsx(classes.icon, classes.checkedIcon)} style={{ color }} />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [color]);

  const icon = useMemo(() => (
    <span className={classes.icon} style={{ color }} />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [color]);

  return (
    <Radio
      color="default"
      className={classes.root}
      checkedIcon={checkedIcon}
      icon={icon}
      { ...otherProps}
    />
  );
}

ColorRadio.propTypes = {
  color: PropTypes.string
};
