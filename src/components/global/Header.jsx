// src/components/global/Header.jsx

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [elevate, setElevate] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setElevate(true);
    } else {
      setElevate(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    { label: 'A Beach Sports', path: '/' },
    { label: 'Valores', path: '/valores' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Escola', path: '/escola' },
    { label: 'Contato', path: '/contato' },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={elevate ? 4 : 0}
      sx={{
        transition: 'background-color 0.3s ease',
        backgroundColor: elevate ? '#fff' : 'transparent',
        color: elevate ? '#000' : '#fff',
      }}
    >
      <Toolbar sx={{ 
        padding: '8px 16px',
        minHeight: 'auto',
      }}>
        {/* Logo */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="/logo_beach_sports.png"
            alt="A Beach Sports Logo"
            style={{
              height: '60px', // Ajuste a altura conforme necessário
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </Box>

        {/* Menu para Desktop */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                component={RouterLink}
                to={item.path}
                sx={{ color: 'inherit' }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              component={RouterLink}
              to="/entrar"
              variant="outlined"
              color="primary"
              sx={{ ml: 2 }}
            >
              Entrar
            </Button>
            <Button
              component={RouterLink}
              to="/cadastrar"
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
            >
              Cadastrar
            </Button>
          </Box>
        )}

        {/* Menu para Mobile */}
        {isMobile && (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  onClick={handleClose}
                >
                  {item.label}
                </MenuItem>
              ))}
              <MenuItem
                component={RouterLink}
                to="/entrar"
                onClick={handleClose}
              >
                Entrar
              </MenuItem>
              <MenuItem
                component={RouterLink}
                to="/cadastrar"
                onClick={handleClose}
              >
                Cadastrar
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;