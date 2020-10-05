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
  const { title, selectedString } = props;
  const classes = useStyles();

  return (
    <ListItem button style={{ display: 'block', padding: '0' }}>
      <Box p={1}>
        <Typography className={classes.title} variant="h6">{title}</Typography>
        <Typography variant="body1">{selectedString}</Typography>
      </Box>
      <Divider />
    </ListItem>
  );
}

BookmarkListItem.propTypes = {
  selectedString: PropTypes.string,
  title: PropTypes.string
};

export default function BookmarkList() {
  const bookmarkList = useSelector(selectBookmarkList);

  const list = useMemo(() => (
    <List>{bookmarkList.map(item => (
      <BookmarkListItem key={item._id} {...item}/>
    ))}</List>
  ), [bookmarkList]);

  return list;
}
