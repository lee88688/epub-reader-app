import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { Hidden } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Mock from 'mockjs';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddIcon from '@material-ui/icons/Add';
import BookIcon from '@material-ui/icons/Book';
import LabelIcon from '@material-ui/icons/Label';

const useGridStyles = makeStyles(theme => ({
  root: {
  },
  gridItem: {
    width: '180px',
    height: '280px',
    '& > *': {
      height: '100%'
    }
  },
  addPaper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'rgba(0, 0, 0, 0.2)',
    cursor: 'pointer'
  },
  tile: {
    cursor: 'pointer',
    height: '100%'
    // position: 'relative'
  },
  imgFullWidth: {
    // display: 'block',
    transform: 'none',
    top: '5px',
    left: '0',
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '100%'
  }
}));

const tileData = Mock.mock({ 'data|0': [{ title: '@sentence', subtitle: '@word' }] }).data;

function useBookList() {
  const classes = useGridStyles();

  const gridList = (
    <Grid container spacing={2}>
      <Grid item className={classes.gridItem} key="add-button">
        <Paper classes={{ root: classes.addPaper }} elevation={2}>
          <AddIcon fontSize="large" />
        </Paper>
      </Grid>
      {tileData.map((tile) => (
        <Grid item className={classes.gridItem} key={tile.title}>
          <Paper elevation={2}>
            <GridListTile
              component="div"
              classes={{
                root: classes.tile
              }}
            >
              <img src="https://source.unsplash.com/700x700/?nature,water,2" alt={tile.title} />
              <GridListTileBar
                title={tile.title}
                subtitle={tile.subtitle}
              />
            </GridListTile>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
  return {
    gridList
  };
}

const useDrawerStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  }
}));

function useDrawer() {
  const theme = useTheme();
  const classes = useDrawerStyles();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container = window !== undefined ? () => window.document.body : undefined;

  const drawer = (
    <div>
      <List>
        <ListItem>
          <Typography variant="h5">Lithium</Typography>
        </ListItem>
        <ListItem button>
          <ListItemIcon><BookIcon /></ListItemIcon>
          <ListItemText primary="我的书籍"/>
        </ListItem>
        <ListItem button>
          <ListItemIcon><LabelIcon /></ListItemIcon>
          <ListItemText primary="分类"/>
        </ListItem>
      </List>
      <Divider />
      <List subheader={<ListSubheader>分类</ListSubheader>}>
        <ListItem button>
          <ListItemIcon><AddIcon /></ListItemIcon>
          <ListItemText primary="创建分类"/>
        </ListItem>
      </List>
    </div>
  );

  const drawerItem = (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden mdUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );

  return {
    handleDrawerToggle,
    drawerItem
  };
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Bookshelf() {
  const classes = useStyles();
  const { gridList } = useBookList();
  const { handleDrawerToggle, drawerItem } = useDrawer();

  return (
    <Container className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      { drawerItem }
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {gridList}
      </main>
    </Container>
  );
}
