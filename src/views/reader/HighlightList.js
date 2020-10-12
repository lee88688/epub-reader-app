import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getColorsValue } from './HighlightEditor';
import { useSelector } from 'react-redux';
import { selectHighlightList } from './readerSlice';

const useStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  color: {
    width: '0.7em',
    height: '0.7em',
    backgroundColor: 'currentColor',
    display: 'inline-block',
    marginRight: theme.spacing(1),
    borderRadius: '50%',
    border: '0.2em solid rgba(255, 255, 255, 0.9)',
    boxSizing: 'content-box'
  }
}));

function HighlightListItem(props) {
  const { color, selectedString, content, onClick } = props;
  const classes = useStyles();
  const comment = !content
    ? null
    : (
      <>
        <Typography variant="caption">comment</Typography>
        <Typography variant="body1">{content}</Typography>
      </>
    );

  return (
    <ListItem onClick={() => onClick ? onClick(props) : null } button style={{ display: 'block', padding: '0' }}>
      <Box p={1}>
        <Typography className={classes.title} variant="h6">
          <span className={classes.color} style={{ color: getColorsValue(color) }} />
          title
        </Typography>
        <Typography variant="body1">{selectedString}</Typography>
        <br/>
        {comment}
      </Box>
      <Divider />
    </ListItem>
  );
}

HighlightListItem.propTypes = {
  color: PropTypes.string,
  selectedString: PropTypes.string,
  content: PropTypes.string,
  onClick: PropTypes.func
};

export default function HighlightList(props) {
  const highlightList = useSelector(selectHighlightList);
  const { onClick } = props;

  const list =  useMemo(() => (
    <List>{highlightList.map(item => (
      <HighlightListItem key={item._id} {...item} onClick={onClick} />
    ))}</List>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [highlightList]);

  return list;
}

HighlightList.propTypes = {
  onClick: PropTypes.func
};
