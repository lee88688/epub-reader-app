import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { getMarks } from '../../api/mark';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getColorsValue } from './HighlightEditor';

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
  const { color, selectedString, content } = props;
  const classes = useStyles();
  console.log(getColorsValue(color));
  return (
    <ListItem button style={{ display: 'block', padding: '0' }}>
      <Box p={1}>
        <Typography className={classes.title} variant="h6">
          <span className={classes.color} style={{ color: getColorsValue(color) }} />
          title
        </Typography>
        <Typography variant="body1">{selectedString}</Typography>
        <br/>
        <Typography variant="caption">comment</Typography>
        <Typography variant="body1">{content}</Typography>
      </Box>
      <Divider />
    </ListItem>
  );
}

HighlightListItem.propTypes = {
  color: PropTypes.string,
  selectedString: PropTypes.string,
  content: PropTypes.string
};

export default function HighlightList(props) {
  const { bookId } = props;
  // todo: when bookId is not changed, does this component rendered?
  const [highlightList, setHighlightList] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await getMarks(bookId);
      setHighlightList(data);
    })();
  }, [bookId]);

  return (
    <List>{highlightList.map(item => (
      <HighlightListItem key={item._id} {...item} />
    ))}</List>
  );
}

HighlightList.propTypes = {
  bookId: PropTypes.string
};
