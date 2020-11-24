import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import { apiDeleteBook, getFileUrl, uploadBook } from '../../api/file';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVert from '@material-ui/icons/MoreVert';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBooks,
  getCategories,
  selectBooks,
  selectCategories,
  selectCategory,
  setCategoryAndGetBooks
} from './bookshelfSlice';
import {
  apiAddBooksToCategory,
  apiCreateCategory,
  apiRemoveBooksFromCategory,
  apiRemoveCategory
} from '../../api/category';

const BOOK_MENU_TYPE = {
  ADD_CATEGORY: 'ADD_CATEGORY',
  REMOVE_FROM_CATEGORY: 'REMOVE_FROM_CATEGORY',
  REMOVE_BOOK: 'REMOVE_BOOK'
};

const useGridItemStyles = makeStyles(() => ({
  gridItem: {
    // width: '180px',
    // height: '280px',
    width: '150px',
    height: '240px',
    '& > *': {
      height: '100%'
    }
  },
  tile: {
    cursor: 'pointer',
    height: '100%'
    // position: 'relative'
  },
  paper: {
    position: 'relative'
  },
  menuIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    color: 'white'
  }
}));

function BookShelfItem(props) {
  const { book, onClick } = props;
  const classes = useGridItemStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const category = useSelector(selectCategory);

  const menuOpen = e => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const menuClose = () => setAnchorEl(null);

  const menuClick = (type, id) => () => {
    menuClose();
    props.onMenuSelected(type, id);
  };

  return (
    <Grid className={classes.gridItem} item>
      <Paper
        elevation={2}
        className={classes.paper}
        onClick={onClick}
      >
        <IconButton className={classes.menuIcon} onClick={menuOpen} size="small">
          <MoreVert />
        </IconButton>
        <GridListTile
          component="div"
          classes={{
            root: classes.tile
          }}
        >
          <img src={getFileUrl(book.fileName, book.cover)} alt={`${book.fileName} cover`} />
          <GridListTileBar
            title={book.title}
            subtitle={book.author}
          />
        </GridListTile>
      </Paper>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={menuClose}
        // anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        // transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        keepMounted
      >
        <MenuItem onClick={menuClick(BOOK_MENU_TYPE.ADD_CATEGORY, book._id)}>添加到分类</MenuItem>
        {category && (
          <MenuItem onClick={menuClick(BOOK_MENU_TYPE.REMOVE_FROM_CATEGORY, book._id)}>从分类中删除</MenuItem>
        )}
        <MenuItem onClick={menuClick(BOOK_MENU_TYPE.REMOVE_BOOK, book._id)}>删除书籍</MenuItem>
      </Menu>
    </Grid>
  );
}

BookShelfItem.propTypes = {
  book: PropTypes.object,
  onClick: PropTypes.func,
  onMenuSelected: PropTypes.func
};

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
  imgFullWidth: {
    // display: 'block',
    transform: 'none',
    top: '5px',
    left: '0',
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '100%'
  },
  selectDialog: {
    minWidth: '300px'
  }
}));

function useBookList() {
  const classes = useGridStyles();
  const addInputRef = useRef(null);
  const history = useHistory();
  const books = useSelector(selectBooks);
  const categories = useSelector(selectCategories);
  const category = useSelector(selectCategory);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  // select category dialog
  const [categoryDialog, setsCategoryDialog] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  const currentCategories = categories.filter(name => category !== name);

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

  const bookMenuSelected = async (type, id) => {
    if (type !== BOOK_MENU_TYPE.REMOVE_BOOK && Array.isArray(currentCategories) && currentCategories.length === 0) {
      enqueueSnackbar('暂无类别，请添加后重试！');
      return;
    }
    switch (type) {
      case BOOK_MENU_TYPE.ADD_CATEGORY: {
        setSelectedBooks([...selectedBooks, id]);
        setsCategoryDialog(true);
        break;
      }
      case BOOK_MENU_TYPE.REMOVE_FROM_CATEGORY: {
        if (!category) return;
        await apiRemoveBooksFromCategory(category, [id]);
        dispatch(getBooks());
        enqueueSnackbar('移除成功', { variant: 'success' });
        break;
      }
      case BOOK_MENU_TYPE.REMOVE_BOOK: {
        if (!id) return;
        await apiDeleteBook(id);
        dispatch(getBooks());
        enqueueSnackbar('删除成功', { variant: 'success' });
        break;
      }
      default: {
        break;
      }
    }
  };

  const inputChange = async () => {
    enqueueSnackbar('start upload');
    const [file] = addInputRef.current.files;
    if (!file) return;
    await uploadBook(file);
    dispatch(getBooks());
    enqueueSnackbar('successful upload', { variant: 'success' });
  };

  const handleCategorySelected = name => async () => {
    setsCategoryDialog(false);
    await apiAddBooksToCategory(name, selectedBooks);
    setSelectedBooks([]);
    enqueueSnackbar('添加成功', { variant: 'success' });
  };

  const addItem = category ? null : (
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
  );

  const gridList = (
    <React.Fragment>
      <Grid container className={classes.root} justify="center" spacing={2}>
        {addItem}
        {books.map((book) => (
          <BookShelfItem
            key={book._id}
            book={book}
            onClick={bookClick(book._id, book.fileName, book.contentPath, book.title)}
            onMenuSelected={bookMenuSelected}
          />
        ))}
      </Grid>
      <Dialog classes={{ paper: classes.selectDialog }} open={categoryDialog} onClose={() => setsCategoryDialog(false)}>
        <DialogTitle>选择类别</DialogTitle>
        <List>
          {currentCategories.map(name => (
            <ListItem key={name} button onClick={handleCategorySelected(name)}>
              <ListItemText primary={name}/>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </React.Fragment>
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
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectCategory);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategoryClick = name => () => {
    dispatch(setCategoryAndGetBooks(name));
  };

  const container = window !== undefined ? () => window.document.body : undefined;

  const drawer = (
    <div>
      <List>
        <ListItem>
          <Typography variant="h5">Beryllium</Typography>
        </ListItem>
        <ListItem button selected={!selectedCategory} onClick={handleCategoryClick('')}>
          <ListItemIcon><BookIcon /></ListItemIcon>
          <ListItemText primary="我的书籍"/>
        </ListItem>
      </List>
      <Divider />
      <List subheader={<ListSubheader>分类</ListSubheader>}>
        {categories.map(name => (
          <ListItem button key={name} onClick={handleCategoryClick(name)} selected={name === selectedCategory}>
            <ListItemIcon><LabelIcon /></ListItemIcon>
            <ListItemText primary={name}/>
          </ListItem>
        ))}
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

  const createCategory = async () => {
    setCategoryDialog(false);
    await apiCreateCategory(categoryName);
    setCategoryName('');
    dispatch(getCategories());
    enqueueSnackbar('successful created', { variant: 'success' });
  };

  const addCategoryDialog = (
    <Dialog open={categoryDialog} classes={{ paper: classes.dialogPaper }}>
      <DialogTitle>添加类别</DialogTitle>
      <DialogContent>
        <TextField
          value={categoryName}
          onInput={e => setCategoryName(e.target.value)}
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
  sidebarButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  appBarTitle: {
    flexGrow: 1
  },
  menuButton: {},
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
  const [menuAnchor, setMenuAnchor] = useState(null);
  const selectedCategory = useSelector(selectCategory);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const menuClose = () => setMenuAnchor(null);
  const menuOpen = e => setMenuAnchor(e.currentTarget);
  const handleRemoveCategory = async () => {
    menuClose();
    await apiRemoveCategory(selectedCategory);
    dispatch(setCategoryAndGetBooks(null));
    dispatch(getCategories());
    enqueueSnackbar('删除成功', { variant: 'success' });
  };

  const menuButton = !selectedCategory ? null : (
    <IconButton
      color="inherit"
      aria-label="open menu"
      edge="end"
      onClick={menuOpen}
    >
      <MoreVert />
    </IconButton>
  );

  return (
    <Container className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.sidebarButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.appBarTitle} variant="h6" noWrap>
            Bookshelf
          </Typography>
          {menuButton}
          <Menu open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={menuClose}>
            <MenuItem onClick={handleRemoveCategory}>删除类别</MenuItem>
          </Menu>
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
