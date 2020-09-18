import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Hidden } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { useReader } from './epubReader';
import { useQuery } from '../../hooks';
import { getFileUrl } from '../../api/file';
import clsx from 'clsx';

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const drawerWidth = 340;
const viewBreakPoint = 'sm';

const useDrawerStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up(viewBreakPoint)]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  tab: {
    minWidth: 0
  }
}));

function useDrawer() {
  const [tabIndex, setTabIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const classes = useDrawerStyles();

  const container = window !== undefined ? () => window.document.body : undefined;

  const drawer = (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={tabIndex}
          onChange={(_, index) => setTabIndex(index)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="目录" classes={{ root: classes.tab }} />
          <Tab label="备注" classes={{ root: classes.tab }} />
          <Tab label="书签" classes={{ root: classes.tab }} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabIndex} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        Item Three
      </TabPanel>
    </div>
  );

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <SwipeableDrawer
          container={container}
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onOpen={() => setMobileOpen(true)}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </SwipeableDrawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="right"
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

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
  const drawer = useDrawer();
  const query = useQuery();
  const contentUrl = getFileUrl(query.get('book'), query.get('content'));
  const { bookItem, nextPage, prevPage } = useReader({ opfUrl: contentUrl });

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      { drawer }
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
