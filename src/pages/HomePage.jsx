// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import axios from '../api/apiService';
import { Container, Grid, Typography } from '@mui/material';
import DefaultCourtCard from '../components/DefaultCourtCard';
import Header from '../components/global/Header';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HomePage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        console.log('Iniciando busca de quadras...');
        const response = await axios.get('/courts');
        console.log('Resposta da API:', response.data);
        
        if (response.data.success) {
          setCourts(response.data.courts);
        } else {
          setError('Erro ao carregar as quadras');
        }
      } catch (error) {
        console.error('Erro ao buscar quadras:', error);
        console.error('Detalhes do erro:', error.response?.data);
        setError('Erro ao carregar as quadras. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  // Número de skeletons a serem exibidos na grade
  const skeletonGrid = Array.from({ length: 6 }).map((_, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Skeleton height={300} />
    </Grid>
  ));

  return (
    <>
      <Header />
      <HeroSection courts={courts} loading={loading} />
      <AboutSection />
      
    </>
  );
};

export default HomePage;