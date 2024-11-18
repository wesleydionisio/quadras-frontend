// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import axios from '../api/apiService';
import { Container, Grid, Typography, Box, IconButton } from '@mui/material';
import DefaultCourtCard from '../components/DefaultCourtCard';
import Header from '../components/global/Header';
import Slider from 'react-slick';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import backgroundImage from '../assets/images/pages/section-1.png';

const HomePage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true); // Adicionado estado de loading

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get('/courts');
        setCourts(response.data);
      } catch (error) {
        console.error('Erro ao buscar quadras:', error);
      } finally {
        setLoading(false); // Define loading como false após a tentativa de fetch
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
    autoplaySpeed: 3500,
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

  // Número de skeletons a serem exibidos no slider
  const skeletonSlides = Array.from({ length: 3 }).map((_, index) => (
    <Box key={index} sx={{ padding: '0 8px' }}>
      <Skeleton height={200} /> {/* Ajuste a altura conforme necessário */}
    </Box>
  ));

  // Número de skeletons a serem exibidos na grade
  const skeletonGrid = Array.from({ length: 6 }).map((_, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Skeleton height={300} /> {/* Ajuste a altura conforme necessário */}
    </Grid>
  ));

  return (
    <>
      {/* Header */}
      <Header />

      {/* Sessão 1 */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          backgroundImage: `url(${backgroundImage})`,
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
        />

        {/* Conteúdo da Sessão */}
        <Box
          sx={{
            position: 'relative',
            textAlign: 'left',
            zIndex: 1,
            width: { xs: '90%', md: '70%' },
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              letterSpacing: '-0.5px',
              fontSize: {
                xs: '2rem',     // Telas muito pequenas (mobile)
                sm: '2.5rem',   // Telas pequenas (tablets)
                md: '3rem',     // Telas médias (desktop)
                lg: '3.5rem'    // Telas grandes
              },
              lineHeight: {
                xs: 1,          // Reduzido para mobile
                sm: 1.1,        // Reduzido para tablet
                md: 1.2         // Reduzido para desktop
              },
              mb: {
                xs: 2,
                sm: 3,
                md: 4
              }
            }}
          >
            Convoque o time e
            <br /> marque uma partida!
          </Typography>

          {/* Slider das Quadras */}
          <Box sx={{ 
            mt: 4,
            position: 'relative',
            width: '100%',
            '& .slick-slide': {
              padding: { xs: '0 8px', sm: '0 8px' },
              display: 'flex !important',
              justifyContent: 'center',
              '& > div': {
                width: '100%',
              }
            },
            '& .slick-list': {
              margin: { xs: '0 -8px', sm: '0 -8px' },
              overflow: 'hidden',
              '.slick-track': {
                display: 'flex !important',
                gap: { xs: '16px', sm: 0 },
              }
            },
            '& .slick-track': {
              display: 'flex !important',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            },
            '& .slick-slider': {
              width: '100%',
              margin: '0 auto',
            },
            '@media (max-width: 600px)': {
              mx: -2,
              width: 'calc(100% + 16px)',
              '& .slick-slide': {
                marginBottom: '16px',
              }
            }
          }}>
            {loading ? (
              <Slider {...sliderSettings}>
                {skeletonSlides}
              </Slider>
            ) : courts.length > 0 ? (
              <Slider {...sliderSettings}>
                {courts.map((court) => (
                  <Box 
                    key={court._id} 
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                      px: { xs: 2, sm: 0 },
                      mb: { xs: 2, sm: 0 }
                    }}
                  >
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
          {loading ? (
            // Skeletons na grade enquanto carrega
            skeletonGrid
          ) : courts.length > 0 ? (
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