import React, { useMemo } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectBookmarkList } from './readerSlice';
import List from '@material-ui/core/List';

const useStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
}));

function BookmarkListItem(props) {
  const { title, selectedString, onClick } = props;
  const classes = useStyles();

  return (
    <ListItem onClick={() => onClick ? onClick(props) : null} button style={{ display: 'block', padding: '0' }}>
      <Box p={1}>
        <Typography className={classes.title} variant="h6">title: {title}</Typography>
        <Typography variant="body1">{selectedString}</Typography>
      </Box>
      <Divider />
    </ListItem>
  );
}

BookmarkListItem.propTypes = {
  selectedString: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func
};

export default function BookmarkList(props) {
  const { onClick } = props;
  const bookmarkList = useSelector(selectBookmarkList);

  const list = useMemo(() => (
    <List>{bookmarkList.map(item => (
      <BookmarkListItem key={item._id} {...item} onClick={onClick}/>
    ))}</List>
  ), [bookmarkList, onClick]);

  return list;
}

BookmarkList.propTypes = {
  onClick: PropTypes.func
};
