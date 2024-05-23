import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, IconButton, Menu, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { UserAuth } from './AuthContext';

const pages = ['Inicio', 'Crear', 'Practicar'];
const settings = ['Inicio', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logOut } = UserAuth();

  const cerrarSesion = async () => {
    try {
      await logOut();
      navigate('/signup');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const isSignupPage = location.pathname === '/signup';
  const isHomePage = location.pathname === '/';

  if (isSignupPage || isHomePage) {
    return null;
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#66FFFF', color: 'black' }}>
      <div>
        <Toolbar disableGutters sx={{ mx: 2 }}>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left' }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', md: 'none' } }}>
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link to={`/${page.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>{page}</Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page} color="inherit" sx={{ fontWeight: 'bold' }}>
                <Link to={`/${page.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>{page}</Link>
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {user ? (
                  <Avatar alt="User Avatar" src={user.photoURL} />
                ) : (
                  <Avatar alt="Default Avatar" src="/static/images/avatar/default.jpg" />
                )}
              </IconButton>
            </Tooltip>
            <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  {setting === 'Logout' ? (
                    <Link onClick={cerrarSesion} style={{ textDecoration: 'none', color: 'inherit' }}>{setting}</Link>
                  ) : (
                    <Link to="/inicio" style={{ textDecoration: 'none', color: 'inherit' }}>{setting}</Link>
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </div>
    </AppBar>
  );
}

export default ResponsiveAppBar;
