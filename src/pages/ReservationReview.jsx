// src/pages/ReservationReview.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';

const ReservationReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState('');

  const reservation = location.state?.reservation;

  useEffect(() => {
    if (!reservation) {
      // Se não houver dados de reserva, redirecione para a página inicial
      navigate('/');
      return;
    }

    // Extrai ano, mês e dia da string de data
    const [year, month, day] = reservation.data.split('-').map(Number);
    const [hour, minute] = reservation.horario_inicio.split(':').map(Number);
    const bookingDate = new Date(year, month - 1, day, hour, minute);

    const updateCountdown = () => {
      const now = new Date();
      const difference = bookingDate - now;

      if (difference <= 0) {
        setTimeRemaining('A reserva já começou.');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, [reservation, navigate]);

  if (!reservation) {
    return null; // Ou algum loader
  }

  // Extrai ano, mês e dia para formatação
  const [year, month, day] = reservation.data.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  const formattedDate = localDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Foto da Quadra */}
        <Box textAlign="center" mb={4}>
          <img
            src={reservation.foto_principal || 'https://via.placeholder.com/150'}
            alt={reservation.nome}
            width="100%"
            style={{ borderRadius: '8px' }}
          />
        </Box>

        {/* Detalhes da Reserva */}
        <Typography variant="h5" gutterBottom>
          Detalhes da Reserva
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Nome da Quadra:</strong> {reservation.nome}</Typography>
            <Typography><strong>Esporte:</strong> {reservation.esporte}</Typography>
            <Typography><strong>Horário:</strong> {reservation.horario_inicio} - {reservation.horario_fim}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Solicitado por:</strong> {reservation.cliente}</Typography>
            <Typography><strong>Data:</strong> {formattedDate}</Typography>
            <Typography><strong>Inicia em:</strong> {timeRemaining}</Typography>
          </Grid>
        </Grid>

        {/* Pagamento */}
        <Box mt={4}>
          <Typography variant="h6">Pagamento</Typography>
          <Typography><strong>Forma de Pagamento:</strong> {reservation.pagamento}</Typography>
          <Typography><strong>Total:</strong> R$ {reservation.total.toFixed(2)}</Typography>
          <Typography><strong>Pague no Local:</strong> {reservation.pague_no_local ? 'Sim' : 'Não'}</Typography>
        </Box>

        {/* Botões de Compartilhar e Cancelar */}
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button variant="outlined" color="primary">
            Compartilhar
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
            Cancelar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReservationReview;