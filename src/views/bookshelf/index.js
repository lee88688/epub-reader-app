import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddIcon from '@material-ui/icons/Add';
import BookIcon from '@material-ui/icons/Book';
import LabelIcon from '@material-ui/icons/Label';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { apiGetBooks, getFileUrl, uploadBook } from '../../api/file';

const useGridStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 150px)'
  },
  gridItem: {
    // width: '180px',
    // height: '280px',
    width: '150px',
    height: '240px',
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
  addInput: {
    display: 'none'
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

// const tileData = Mock.mock({ 'data|10': [{ title: '@sentence', subtitle: '@word' }] }).data;

function useBookList() {
  const [books, setBooks] = useState([]);
  const classes = useGridStyles();
  const addInputRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async () => {
    const { data } = await apiGetBooks();
    setBooks(data || []);
  };

  const bookClick = (id, book, content, title) => {
    return () => {
      const query = new URLSearchParams();
      query.set('book', book);
      query.set('content', content);
      query.set('id', id);
      query.set('title', title);
      history.push(`/reader?${query.toString()}`);
    };
  };

  const inputChange = async () => {
    console.log('input file change');
    const [file] = addInputRef.current.files;
    if (!file) return;
    await uploadBook(file);
    getBooks();
    console.log('successful upload');
  };

  const gridList = (
    <Grid container className={classes.root} justify="center" spacing={2}>
      <Grid onClick={() => addInputRef.current.click()} item className={classes.gridItem} key="add-button">
        <Paper classes={{ root: classes.addPaper }} elevation={2}>
          <AddIcon fontSize="large" />
          <input
            ref={addInputRef}
            onChange={inputChange}
            type="file"
            accept="application/epub+zip"
            className={classes.addInput}
          />
        </Paper>
      </Grid>
      {books.map((book) => (
        <Grid
          key={book._id}
          onClick={bookClick(book._id, book.fileName, book.contentPath, book.title)}
          className={classes.gridItem}
          item
        >
          <Paper elevation={2}>
            <GridListTile
              component="div"
              classes={{
                root: classes.tile
              }}
            >
              <img src={getFileUrl(book.fileName, book.cover)} alt={book.cover} />
              <GridListTileBar
                title={book.title}
                subtitle={book.author}
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
  },
  dialogPaper: {
    minWidth: '300px'
  }
}));

function useDrawer() {
  const theme = useTheme();
  const classes = useDrawerStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [categoryName, setCategoryName] = useState('');

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
        <ListItem button onClick={() => {
          setCategoryDialog(true);
          setMobileOpen(false);
        }}>
          <ListItemIcon><AddIcon /></ListItemIcon>
          <ListItemText primary="创建分类"/>
        </ListItem>
      </List>
    </div>
  );

  const createCategory = () => {
    setCategoryDialog(false);
    setCategoryName('');
  };

  const addCategoryDialog = (
    <Dialog open={categoryDialog} classes={{ paper: classes.dialogPaper }}>
      <DialogTitle>添加类别</DialogTitle>
      <DialogContent>
        <TextField
          value={categoryName}
          onInput={e => setCategoryDialog(e.target.value)}
          autoFocus
          label="输入类别名称"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => {
          setCategoryName('');
          setCategoryDialog(false);
        }}>取消</Button>
        <Button color="primary" onClick={createCategory}>创建</Button>
      </DialogActions>
    </Dialog>
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
      { addCategoryDialog }
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
    padding: `${theme.spacing(3)}px 0`,
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
            Bookshelf
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
