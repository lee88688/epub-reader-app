import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const NestedListContext = React.createContext({ selected: '' });

const useItemStyles = makeStyles((theme) => ({
  root: {},
  nested: {
    paddingLeft: ({ level = 1 }) => theme.spacing(3 * level) + 10
  }
}));

function NestedListItem(props) {
  const { level, data: { label, children } = {} } = props;
  const classes = useItemStyles(props);
  const [open, setOpen] = useState(false);
  const { selected, setSelected } = useContext(NestedListContext);
  const key = `${level}-${label}`;

  const handleExpand = () => {
    setOpen(!open);
  };

  const handleClick = () => {
    const { onClick, data } = props;
    setSelected(key);
    if (isFunction(onClick)) {
      onClick({ ...data, level });
    }
  };

  if (Array.isArray(children) && children.length) {
    return (
      <React.Fragment>
        <ListItem
          button
          selected={selected === key}
          className={classes.nested}
          onClick={handleClick}
        >
          <ListItemText primary={label} />
          {open ? (
            <ListItemSecondaryAction>
              <IconButton onClick={handleExpand}>
                <ExpandLess fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          ) : (
            <ListItemSecondaryAction>
              <IconButton onClick={handleExpand}>
                <ExpandMore fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item, index) => (
              <NestedListItem
                key={`${level}-${index}-${item.label}`}
                data={item}
                level={level + 1}
                onClick={props.onClick}
              />
            ))}
          </List>
        </Collapse>
      </React.Fragment>
    );
  }
  return (
    <ListItem
      button
      selected={key === selected}
      className={classes.nested}
      onClick={handleClick}
    >
      <ListItemText primary={label} />
    </ListItem>
  );
}

NestedListItem.propTypes = {
  level: PropTypes.number,
  data: PropTypes.object,
  onClick: PropTypes.func
};

const useStyles = makeStyles((theme) => ({
  root: {}
}));

export default function NestedList(props) {
  const { data = [], onClick } = props;
  const level = useRef(0);
  const classes = useStyles(props);
  const [selected, setSelected] = useState('');

  return (
    <NestedListContext.Provider value={{ selected, setSelected }}>
      <List component="nav" className={classes.root}>
        {data.map((item, index) => (
          <NestedListItem
            key={`${level}-${index}-${item.label}`}
            data={item}
            level={level.current}
            onClick={onClick}
          />
        ))}
      </List>
    </NestedListContext.Provider>
  );
}

NestedList.propTypes = {
  level: PropTypes.number,
  data: PropTypes.array,
  onClick: PropTypes.func
};
