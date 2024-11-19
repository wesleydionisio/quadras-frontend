import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/global/Header';
import Footer from '../components/global/Footer';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          position: 'relative',
          zIndex: 0,
          paddingTop: '76px',
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout; 