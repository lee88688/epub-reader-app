import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { getBookToc } from '../../api/file';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NestedList from './NestedList';
import { Hidden } from '@material-ui/core';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Drawer from '@material-ui/core/Drawer';
import { useRendered } from '../../hooks';

function TabPanel(props) {
  const { children, value, index, className } = props;
  const [rendered, curState] = useRendered(value === index);

  return (
    <div
      className={className}
      role="tabpanel"
      hidden={!curState}
      style={{ display: !curState ? 'none': 'block' }}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      {rendered && (
        <Box p={0}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  className: PropTypes.string
};

export const drawerWidth = 340;
export const viewBreakPoint = 'sm';

const useDrawerStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up(viewBreakPoint)]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawer: {
    maxHeight: '100%;',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  appBar: {
    flexShrink: 0
  },
  tabPanel: {
    flexGrow: 1,
    overflow: 'auto'
  },
  tab: {
    minWidth: 0
  }
}));

export default function ReaderDrawer(props) {
  const { book, onClick } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tocData, setTocData ] = useState([]);
  const classes = useDrawerStyles();

  useEffect(() => {
    (async () => {
      const { data } = await getBookToc(book);
      setTocData(data);
    })();
  }, [book]);

  const container = window !== undefined ? () => window.document.body : undefined;

  const drawer = (
    <div className={classes.drawer}>
      <AppBar className={classes.appBar} position="static" color="default">
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
      <TabPanel className={classes.tabPanel} value={tabIndex} index={0}>
        <NestedList data={tocData} onClick={onClick} />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={tabIndex} index={1}>
        Item Two
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={tabIndex} index={2}>
        Item Three
      </TabPanel>
    </div>
  );

  return (
    <nav className={classes.root} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp>
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
      <Hidden xsDown>
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

ReaderDrawer.propTypes = {
  book: PropTypes.string,
  onClick: PropTypes.func
};
