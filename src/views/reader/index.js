import React, { useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowBack from '@material-ui/icons/ArrowBack';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useReader } from './epubReader';
import { useQuery } from '../../hooks';
import { getFileUrl } from '../../api/file';
import clsx from 'clsx';
import ReaderDrawer, { drawerWidth, viewBreakPoint } from './ReaderDrawer';
import { getHighlightList } from './readerSlice';

const useStyles = makeStyles(theme => ({
  root: { display: 'flex', flexDirection: 'row-reverse' },
  appBar: {
    [theme.breakpoints.up(viewBreakPoint)]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: drawerWidth,
    },
  },
  // necessary for content to be below app bar
  shim: theme.mixins.toolbar,
  main: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    height: '100vh',
    'max-height': '100%',
    overflow: 'hidden',
    flexGrow: 1,
    padding: theme.spacing(3),
    '& $shim': {
      display: 'none',
      flexShrink: 0,
      [theme.breakpoints.up(viewBreakPoint)]: {
        display: 'block'
      }
    }
  },
  content: {
    flexGrow: 1
  },
  pageIcon: {
    display: 'none',
    cursor: 'pointer',
    position: 'absolute',
    top: '50%',
    fontSize: '2rem',
    [theme.breakpoints.up(viewBreakPoint)]: {
      display: 'block'
    }
  },
  next: {
    right: `${theme.spacing(2)}px`
  },
  prev: {
    left: `${theme.spacing(2)}px`
  }
}));

export default function Reader() {
  const classes = useStyles();
  const query = useQuery();
  const id = query.get('id');
  const title = query.get('title');
  const contentUrl = getFileUrl(query.get('book'), query.get('content'));
  const { bookItem, nextPage, prevPage, rendition } = useReader({ opfUrl: contentUrl, bookId: id });
  // useMemo for performance reason
  const clickToc = useMemo(() => {
    // console.log('clickToc');
    return ({ src }) => {
      if (!src) return;
      rendition.current.display(src);
    };
  }, [rendition]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHighlightList(id));
  }, [id, dispatch]);

  const history = useHistory();

  const bookFileName = query.get('book');

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" noWrap>
            { title }
          </Typography>
        </Toolbar>
      </AppBar>
      <ReaderDrawer id={id} book={bookFileName} onClick={clickToc} />
      <main className={classes.main}>
        <div className={classes.shim} />
        <div className={classes.content}>
          { bookItem }
        </div>
        <ArrowBackIosIcon onClick={prevPage} className={clsx(classes.pageIcon, classes.prev)} />
        <ArrowForwardIosIcon onClick={nextPage} className={clsx(classes.pageIcon, classes.next)} />
      </main>
    </div>
  );
}
