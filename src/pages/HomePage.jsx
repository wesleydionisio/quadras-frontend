import React, { useEffect, useState } from 'react';
import axios from '../api/apiService';
import { Container, Grid, Typography } from '@mui/material';
import CourtCard from '../components/booking/CourtCard';

const HomePage = () => {
  const [courts, setCourts] = useState([]); // Estado para armazenar as quadras

  // Função para buscar as quadras
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get('/api/courts'); // Chamada à API
        setCourts(response.data); // Atualiza o estado com os dados das quadras
      } catch (error) {
        console.error('Erro ao buscar quadras:', error);
      }
    };
    fetchCourts();
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Quadras Disponíveis
      </Typography>
      <Grid container spacing={3}>
        {courts.length > 0 ? (
          courts.map((court) => (
            <Grid item xs={12} sm={6} md={4} key={court._id}>
              <CourtCard court={court} />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" align="center" style={{ width: '100%' }}>
            Nenhuma quadra disponível no momento.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default HomePage;