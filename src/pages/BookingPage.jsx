// src/pages/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import axios from '../api/apiService';
import Calendar from '../components/booking/Calendar';
import TimeSlots from '../components/booking/TimeSlots';
import SportsButtons from '../components/booking/SportsButtons';
import PaymentButtons from '../components/booking/PaymentButtons';

const BookingPage = () => {
  const { quadraId } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const horarioInicio = 8;
  const horarioFim = 22;
  const duracao = 1;

  // Função para gerar slots de horário
  const generateTimeSlots = (reservas) => {
    const slots = [];
    for (let hour = horarioInicio; hour < horarioFim; hour++) {
      const slotInicio = `${hour.toString().padStart(2, '0')}:00`;
      const slotFim = `${(hour + duracao).toString().padStart(2, '0')}:00`;

      const isReserved = reservas.some(
        (reserva) =>
          (reserva.inicio <= slotInicio && reserva.fim > slotInicio) ||
          (reserva.inicio < slotFim && reserva.fim >= slotFim)
      );

      slots.push({ horario_inicio: slotInicio, horario_fim: slotFim, available: !isReserved });
    }
    console.log('Slots gerados:', slots); // Log para verificar
    return slots;
  };

  // Buscar detalhes da quadra
  useEffect(() => {
    const fetchCourtDetails = async () => {
      try {
        const response = await axios.get(`/courts/${quadraId}`); // Requisição correta
        console.log('Resposta da API /courts/:id:', response.data); // Log para inspeção

        // Ajuste conforme a estrutura da resposta
        if (response.data.court) {
          setCourt(response.data.court);
        } else if (response.data.data) {
          setCourt(response.data.data);
        } else {
          setCourt(response.data); // Caso a estrutura seja diferente
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes da quadra:', error);
        setError('Não foi possível carregar os detalhes da quadra.');
        setLoading(false); // Parar o loading em caso de erro
      }
    };

    fetchCourtDetails();
  }, [quadraId]);

  // Buscar horários reservados
  useEffect(() => {
    if (selectedDate) {
      const fetchTimeSlots = async () => {
        setLoading(true);
        try {
          const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
          const response = await axios.get(`/bookings/${quadraId}/reserved-times`, {
            params: { data: formattedDate },
          });

          const reservas = response.data.horarios_agendados || [];
          console.log('Reservas recebidas:', reservas); // Log para verificar
          const slots = generateTimeSlots(reservas);
          setTimeSlots(slots);
        } catch (error) {
          console.error('Erro ao buscar horários disponíveis:', error);
          setError('Não foi possível carregar os horários disponíveis.');
        } finally {
          setLoading(false);
        }
      };

      fetchTimeSlots();
    }
  }, [selectedDate, quadraId]);

  // Função para confirmar reserva
  const handleConfirmReservation = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // Aqui, substitua 'Nome do Cliente' por dados reais do usuário.
      // Se estiver usando um contexto de autenticação, recupere o nome do usuário a partir dele.
      const userName = 'Nome do Cliente'; // Exemplo estático

      const requestBody = {
        quadra_id: quadraId,
        data: selectedDate.toISOString().split('T')[0],
        horario_inicio: selectedSlot.horario_inicio,
        horario_fim: selectedSlot.horario_fim,
        esporte_id: selectedSport,
        pagamento: selectedPayment,
      };

      // Requisição para criar a reserva
      const response = await axios.post(`/bookings`, requestBody);

      if (response.data.success) {
        // Obter o ID da reserva criada
        const reservationId = response.data.reserva._id; // Ajuste conforme a resposta da API

        // Redireciona para a página de revisão com o ID da reserva na URL
        navigate(`/reservation-review/${reservationId}`);
      } else {
        // Trate o caso de falha na criação da reserva
        alert('Não foi possível confirmar a reserva. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao confirmar a reserva:', error);
      const errorMessage =
        error.response?.data?.message || 'Não foi possível confirmar a reserva. Tente novamente.';
      alert(errorMessage);
    }
  };

  return (
    <Container maxWidth="md">
      {court ? (
        <>
          {/* Detalhes da Quadra */}
          <Box textAlign="center">
            <img
              src={court.foto_principal || 'https://via.placeholder.com/150'}
              alt={court.nome}
              width="100%"
              style={{ borderRadius: '8px', marginBottom: '16px' }}
            />
            <Typography variant="h4" align="center">
              {court.nome}
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary">
              {court.descricao}
            </Typography>
          </Box>

          {/* Calendário */}
          <Box mt={5}>
            <Calendar onDateChange={setSelectedDate} />
          </Box>

          {/* Time Slots */}
          {selectedDate && (
            <Box mt={5}>
              <Typography variant="h6">Selecione um Horário:</Typography>
              {loading ? (
                <CircularProgress />
              ) : (
                <TimeSlots slots={timeSlots} onSlotSelect={setSelectedSlot} />
              )}
            </Box>
          )}

          {/* Botões de Esportes */}
          {selectedSlot && (
            <Box mt={5}>
              <Typography variant="h6">Selecione um Esporte:</Typography>
              <SportsButtons
                sports={court.esportes_permitidos || []}
                selectedSport={selectedSport}
                onSportSelect={setSelectedSport}
              />
            </Box>
          )}

          {/* Botões de Pagamento */}
          {selectedSport && (
            <Box mt={5}>
              <Typography variant="h6">Selecione uma Forma de Pagamento:</Typography>
              <PaymentButtons
                payments={court.formas_pagamento || []}
                selectedPayment={selectedPayment}
                onPaymentSelect={setSelectedPayment}
              />
            </Box>
          )}

          {/* Botão de Confirmar Reserva */}
          {selectedDate && selectedSlot && selectedSport && selectedPayment && (
            <Box mt={5} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleConfirmReservation}
              >
                Confirmar Reserva
              </Button>
            </Box>
          )}

          {/* Exibir Erros */}
          {error && (
            <Box mt={3}>
              <Typography variant="body1" color="error" align="center">
                {error}
              </Typography>
            </Box>
          )}
        </>
      ) : (
        // Loader enquanto carrega
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default BookingPage;