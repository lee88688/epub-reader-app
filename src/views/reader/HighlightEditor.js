import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Divider from '@material-ui/core/Divider';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ColorRadio from './ColorRadio';
import Button from '@material-ui/core/Button';

const colors = [
  { label: 'red', value: '#F44336' },
  { label: 'purple', value: '#9C27B0' },
  { label: 'blue', value: '#2196F3' },
  { label: 'cyan', value: '#00BCD4' },
  { label: 'teal', value: '#009688' },
  { label: 'orange', value: '#FF9800' },
  { label: 'blue-grey', value: '#607D8B' },
];

export function getColorsValue(label) {
  return colors.find(c => c.label === label).value;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '300px'
  },
  input: {
    paddingLeft: '5px',
    paddingRight: '5px',
    '&::before': { display: 'none' },
    '&::after': { display: 'none' }
  },
  radioGroup: {
    paddingLeft: '11px',
    '& > label': {
      marginRight: 0
    }
  },
  actions: {
    display: 'flex',
    flexDirection: 'row-reverse'
  }
}));

export default function HighlightEditor(props) {
  const { onChange, onCancel, onDelete, onConfirm, ...otherProps } = props;
  const classes = useStyles();
  const [{ color, text }, setEditorContent] = useState({ color: '', text: '' });

  useEffect(() => {
    setEditorContent({ color: props.color, text: props.text });
  }, [props.color, props.text]);

  const onEditChange = type => {
    if (type === 'color') {
      return e => {
        setEditorContent({ color: e.target.value, text });
        isFunction(onChange) && onChange({ ...otherProps, color: e.target.value, text });
      };
    } else if (type === 'text') {
      return e => {
        setEditorContent({ color, text: e.target.value });
        isFunction(onChange) && onChange({ ...otherProps, color, text: e.target.value });
      };
    }
  };
  const colorRadios = useMemo(() => {
    return colors.map(({ label, value }) => (
      <FormControlLabel key={label} label="" value={label} control={<ColorRadio key={label} color={value} />} />
    ));
  }, []);

  return (
    <Paper className={classes.root} elevation={3}>
      <RadioGroup value={color} onChange={onEditChange('color')} row name="color" className={classes.radioGroup}>
        {colorRadios}
      </RadioGroup>
      <Divider />
      <Input value={text} onChange={onEditChange('text')} fullWidth multiline classes={{ root: classes.input }} placeholder="comments" />
      <Divider />
      <div className={classes.actions}>
        <Button key="confirm" color="primary" onClick={() => {
          isFunction(onConfirm) && onConfirm({ ...props, color, text });
        }}>confirm</Button>
        <Button key="delete" color="secondary" onClick={() => {
          isFunction(onDelete) && onDelete({ ...props, color, text });
        }}>delete</Button>
        <Button key="cancel" onClick={() => {
          isFunction(onCancel) && onCancel({ ...props, color, text });
        }}>cancel</Button>
      </div>
    </Paper>
  );
}

HighlightEditor.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
  onConfirm: PropTypes.func,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func
};
