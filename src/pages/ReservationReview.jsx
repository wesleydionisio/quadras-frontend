// src/pages/ReservationReview.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from '@mui/material';
import axios from '../api/apiService';

const ReservationReview = () => {
  const { reservationId } = useParams(); // Extrai o ID da reserva da URL
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [error, setError] = useState('');
  const [openCancelModal, setOpenCancelModal] = useState(false); // Estado para controlar o modal

  useEffect(() => {
    if (!reservationId) {
      navigate('/'); // Redireciona para a página inicial se não houver ID
      return;
    }

    const fetchReservationDetails = async () => {
      try {
        const response = await axios.get(`/bookings/${reservationId}`);
        if (response.data.success) {
          setReservation(response.data.reservation); // Ajuste conforme a estrutura da resposta
        } else {
          setError('Reserva não encontrada.');
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes da reserva:', err);
        setError('Não foi possível carregar os detalhes da reserva.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [reservationId, navigate]);

  useEffect(() => {
    if (!reservation) return;

    // Extrai ano, mês e dia da string de data
    const [year, month, day] = reservation.data.split('-').map(Number);
    const [hour, minute] = reservation.horario_inicio.split(':').map(Number);
    const bookingDate = new Date(year, month - 1, day, hour, minute); // Data local

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
  }, [reservation]);

  // Função para abrir o modal de cancelamento
  const handleOpenCancelModal = () => {
    setOpenCancelModal(true);
  };

  // Função para fechar o modal de cancelamento
  const handleCloseCancelModal = () => {
    setOpenCancelModal(false);
  };

  // Função para cancelar a reserva
  const handleCancelReservation = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Supondo que o token esteja armazenado no localStorage

      // Fazer a requisição para cancelar a reserva
      const response = await axios.put(`/bookings/${reservationId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Atualizar o estado da reserva para refletir o cancelamento
        setReservation(prev => ({
          ...prev,
          status: 'cancelada',
        }));
        // Fechar o modal
        handleCloseCancelModal();
      } else {
        alert('Não foi possível cancelar a reserva. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao cancelar a reserva:', error);
      const errorMessage =
        error.response?.data?.message || 'Não foi possível cancelar a reserva. Tente novamente.';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
        <Box mt={3} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>
            Voltar para a Página Inicial
          </Button>
        </Box>
      </Container>
    );
  }

  // Formatando a data para exibição
  const formattedDate = new Date(reservation.data).toLocaleDateString('pt-BR', {
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

        {/* Label de Reserva Cancelada */}
        {reservation.status === 'cancelada' && (
          <Box mt={3}>
            <Chip label="Reserva Cancelada" color="error" size="large" />
          </Box>
        )}

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
          {/* Exibir botão de cancelar apenas se a reserva não estiver cancelada */}
          {reservation.status !== 'cancelada' && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenCancelModal}
            >
              Cancelar
            </Button>
          )}
        </Box>
      </Paper>

      {/* Modal de Confirmação de Cancelamento */}
      <Dialog
        open={openCancelModal}
        onClose={handleCloseCancelModal}
        aria-labelledby="cancel-reservation-dialog-title"
        aria-describedby="cancel-reservation-dialog-description"
      >
        <DialogTitle id="cancel-reservation-dialog-title">
          Confirmar Cancelamento
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-reservation-dialog-description">
            Você tem certeza que deseja cancelar esta reserva? Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelModal} color="primary">
            Não
          </Button>
          <Button onClick={handleCancelReservation} color="secondary" autoFocus>
            Sim, Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReservationReview;