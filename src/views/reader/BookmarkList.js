import React, { useMemo, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getBookmarkList, selectBookmarkList } from './readerSlice';
import List from '@material-ui/core/List';
import MoreVert from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { removeMark } from '../../api/mark';

const useStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1
  }
}));

function BookmarkListItem(props) {
  const { title, selectedString, onClick, id, book } = props;
  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const menuOpen = e => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };
  const menuClose = e => {
    e.stopPropagation();
    setMenuAnchorEl(null);
  };

  const removeBookmark = async e => {
    e.stopPropagation(); // for menu is in the button, clicking menu will trigger button again without stopPropagation
    setMenuAnchorEl(null);
    await removeMark(id, book);
    dispatch(getBookmarkList(book));
  };
  console.log('menuAnchorEl', menuAnchorEl);

  const stopPropagation = e => e.stopPropagation();

  return (
    <ListItem onClick={() => onClick ? onClick(props) : null} button style={{ display: 'block', padding: '0' }}>
      <Box p={1}>
        <Box display="flex" flexDirection="row">
          <Typography className={classes.title} variant="h6">{title}</Typography>
          <IconButton color="inherit" onClick={menuOpen} onMouseDown={stopPropagation} onTouchStart={stopPropagation}>
            <MoreVert />
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={menuClose}
              keepMounted
            >
              <MenuItem onClick={removeBookmark}>remove bookmark</MenuItem>
            </Menu>
          </IconButton>
        </Box>
        <Typography variant="body1">{selectedString}</Typography>
      </Box>
      <Divider />
    </ListItem>
  );
}

BookmarkListItem.propTypes = {
  id: PropTypes.string,
  book: PropTypes.string,
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
