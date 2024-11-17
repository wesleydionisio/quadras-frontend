// src/components/Header.jsx

import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Box, Drawer, List, ListItem, ListItemText, Collapse } from '@mui/material';
import { Menu as MenuIcon, AccountCircle, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estado para o menu de "Minha Conta"
  const [anchorElMinhaConta, setAnchorElMinhaConta] = useState(null);
  const openMinhaConta = Boolean(anchorElMinhaConta);

  const handleMinhaContaClick = (event) => {
    setAnchorElMinhaConta(event.currentTarget);
  };

  const handleMinhaContaClose = () => {
    setAnchorElMinhaConta(null);
  };

  // Estado para o menu de "Meu Perfil"
  const [anchorElMeuPerfil, setAnchorElMeuPerfil] = useState(null);
  const openMeuPerfil = Boolean(anchorElMeuPerfil);

  const handleMeuPerfilClick = (event) => {
    setAnchorElMeuPerfil(event.currentTarget);
  };

  const handleMeuPerfilClose = () => {
    setAnchorElMeuPerfil(null);
  };

  // Estado para o Drawer no mobile
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Estado para collapses no Drawer
  const [openMinhaContaDrawer, setOpenMinhaContaDrawer] = useState(false);
  const [openMeuPerfilDrawer, setOpenMeuPerfilDrawer] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    // Lógica de logout (limpar token, redirecionar, etc.)
    localStorage.removeItem('authToken');
    navigate('/'); // Redirecionar para a página inicial ou de login
  };

  // Menu para desktop
  const desktopMenu = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button color="inherit" component={RouterLink} to="/">
        Início
      </Button>
      <Button color="inherit" component={RouterLink} to="/quadras">
        Quadras
      </Button>
      <Button color="inherit" component={RouterLink} to="/sobre">
        Sobre
      </Button>

      {/* Minha Conta */}
      <Button
        color="inherit"
        onClick={handleMinhaContaClick}
        endIcon={<AccountCircle />}
      >
        Minha Conta
      </Button>
      <Menu
        anchorEl={anchorElMinhaConta}
        open={openMinhaConta}
        onClose={handleMinhaContaClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => { handleMinhaContaClose(); navigate('/reservas'); }}>
          Reservas
        </MenuItem>
      </Menu>

      {/* Meu Perfil */}
      <Button
        color="inherit"
        onClick={handleMeuPerfilClick}
        endIcon={<AccountCircle />}
      >
        Meu Perfil
      </Button>
      <Menu
        anchorEl={anchorElMeuPerfil}
        open={openMeuPerfil}
        onClose={handleMeuPerfilClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => { handleMeuPerfilClose(); handleLogout(); }}>
          Sair
        </MenuItem>
      </Menu>
    </Box>
  );

  // Menu para mobile (Drawer)
  const mobileMenu = (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={RouterLink} to="/">
              <ListItemText primary="Início" />
            </ListItem>
            <ListItem button component={RouterLink} to="/quadras">
              <ListItemText primary="Quadras" />
            </ListItem>
            <ListItem button component={RouterLink} to="/sobre">
              <ListItemText primary="Sobre" />
            </ListItem>

            {/* Minha Conta com Collapse */}
            <ListItem button onClick={() => setOpenMinhaContaDrawer(!openMinhaContaDrawer)}>
              <ListItemText primary="Minha Conta" />
              {openMinhaContaDrawer ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMinhaContaDrawer} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} component={RouterLink} to="/reservas">
                  <ListItemText primary="Reservas" />
                </ListItem>
              </List>
            </Collapse>

            {/* Meu Perfil com Collapse */}
            <ListItem button onClick={() => setOpenMeuPerfilDrawer(!openMeuPerfilDrawer)}>
              <ListItemText primary="Meu Perfil" />
              {openMeuPerfilDrawer ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMeuPerfilDrawer} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={handleLogout}>
                  <ListItemText primary="Sair" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Nome da Aplicação
        </Typography>
        {isMobile ? mobileMenu : desktopMenu}
      </Toolbar>
    </AppBar>
  );
};

export default Header;