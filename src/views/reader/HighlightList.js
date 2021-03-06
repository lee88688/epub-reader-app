import React, { useMemo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getColorsValue } from './HighlightEditor';
import { useDispatch, useSelector } from 'react-redux';
import { getHighlightList, selectHighlightList } from './readerSlice';
import { removeMark } from '../../api/mark';
import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ReaderContext } from './index';
import { EpubCFI } from 'epubjs';

const useStyles = makeStyles(theme => ({
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1
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
  const { id, book, epubcfi, type, color, selectedString, content, title, onClick } = props;
  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { rendition } = useContext(ReaderContext);

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
    dispatch(getHighlightList(book));
    if (rendition.current) {
      rendition.current.annotations.remove(new EpubCFI(epubcfi), type);
    }
  };

  const stopRipplePropagation = e => e.stopPropagation();

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
        <Box display="flex" flexDirection="row">
          <Typography className={classes.title} variant="h6">
            <span className={classes.color} style={{ color: getColorsValue(color) }} />
            {title}
          </Typography>
          <IconButton color="inherit" onClick={menuOpen} onMouseDown={stopRipplePropagation} onTouchStart={stopRipplePropagation}>
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
        <br/>
        {comment}
      </Box>
      <Divider />
    </ListItem>
  );
}

HighlightListItem.propTypes = {
  id: PropTypes.string,
  book: PropTypes.string,
  epubcfi: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  selectedString: PropTypes.string,
  content: PropTypes.string,
  title: PropTypes.string,
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
