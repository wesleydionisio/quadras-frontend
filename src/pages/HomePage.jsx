// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import axios from '../api/apiService';
import { Container, Grid, Typography, Box, IconButton } from '@mui/material';
import DefaultCourtCard from '../components/DefaultCourtCard'; // Alterado para DefaultCourtCard
import Header from '../components/global/Header';
import Slider from 'react-slick';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get('/courts');
        setCourts(response.data);
      } catch (error) {
        console.error('Erro ao buscar quadras:', error);
      }
    };
    fetchCourts();
  }, []);

  // Configurações do slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    centerPadding: '0px',
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    pauseOnFocus: true,
    pauseOnDotsHover: true,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* Header */}
      <Header />

      {/* Sessão 1 */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          backgroundImage: 'url(https://www.planetball.com.br/site/images/home-banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />

        {/* Conteúdo da Sessão */}
        <Box
          sx={{
            position: 'relative',
            textAlign: 'left',
            zIndex: 1,
            width: { xs: '90%', md: '60%' },
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            Convoque o time e
            <br></br>marque uma partida!
          </Typography>

          {/* Slider das Quadras */}
          <Box sx={{ 
            mt: 4,
            position: 'relative',
            width: '100%',
            '& .slick-slide': {
              padding: '0 8px',
            },
            '& .slick-list': {
              margin: '0 -8px',
              overflow: 'visible',
            },
            '& .slick-track': {
              marginLeft: '0',
              display: 'flex',
              gap: '16px',
            },
            '& .slick-slider': {
              overflow: 'hidden',
              width: '100%',
            }
          }}>
            {courts.length > 0 ? (
              <Slider {...sliderSettings}>
                {courts.map((court) => (
                  <Box key={court._id}>
                    <DefaultCourtCard court={court} />
                  </Box>
                ))}
              </Slider>
            ) : (
              <Typography variant="h6">Nenhuma quadra disponível no momento.</Typography>
            )}
          </Box>

          {/* Redes Sociais */}
          <Box sx={{ 
            mt: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}>
            <Typography 
              variant="h6"
              sx={{
                m: 0,
              }}
            >
              Siga-nos nas redes sociais
            </Typography>
            <Box sx={{ 
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}>
              <IconButton
                component="a"
                href="https://instagram.com/seu-perfil"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#fff' }}
              >
                <InstagramIcon fontSize="large" />
              </IconButton>
              <IconButton
                component="a"
                href="https://facebook.com/seu-perfil"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#fff' }}
              >
                <FacebookIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Sessão de Quadras Disponíveis */}
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Quadras Disponíveis
        </Typography>
        <Grid container spacing={3}>
          {courts.length > 0 ? (
            courts.map((court) => (
              <Grid item xs={12} sm={6} md={4} key={court._id}>
                <DefaultCourtCard court={court} />
              </Grid>
            ))
          ) : (
            <Typography variant="h6" align="center" sx={{ width: '100%' }}>
              Nenhuma quadra disponível no momento.
            </Typography>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;