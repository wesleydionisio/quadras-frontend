import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import axios from '../api/apiService'; // Importa o serviço de API
import Calendar from '../components/booking/Calendar';
import TimeSlots from '../components/booking/TimeSlots';
import SportsDropdown from '../components/booking/SportsDropdown';
import PaymentOptions from '../components/booking/PaymentOptions';

const BookingPage = () => {
  const { quadraId } = useParams();
  const [court, setCourt] = useState(null); // Armazena os detalhes da quadra
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');

  // Dados para os horários reservados (mock inicialmente)
  const [timeSlots, setTimeSlots] = useState([
    { time: '08:00', available: true },
    { time: '09:00', available: false }, // já reservado
    { time: '10:00', available: true },
  ]);

  // Buscar detalhes da quadra ao carregar a página
  useEffect(() => {
    const fetchCourtDetails = async () => {
      try {
        const response = await axios.get(`/api/courts/${quadraId}`); // Chamada ao backend
        setCourt(response.data); // Atualiza os detalhes da quadra
      } catch (error) {
        console.error('Erro ao buscar detalhes da quadra:', error);
      }
    };

    fetchCourtDetails();
  }, [quadraId]);

  return (
    <Container>
      <Box>
        <img src={court?.foto_principal || 'https://via.placeholder.com/150'} alt={court?.nome || 'Quadra'} width="100%" />
        <Typography variant="h5" align="center">
          {court?.nome || 'Carregando...'}
        </Typography>
      </Box>
      <Box mt={3}>
        {/* Exibe o calendário */}
        <Calendar onDateChange={setSelectedDate} />

        {/* Exibe os horários disponíveis dinamicamente */}
        {selectedDate && <TimeSlots slots={timeSlots} onSlotSelect={setSelectedSlot} />}

        {/* Exibe os esportes permitidos pela quadra */}
        {selectedSlot && (
          <SportsDropdown sports={court?.esportes_permitidos || []} onSportSelect={setSelectedSport} />
        )}

        {/* Exibe as opções de pagamento disponíveis */}
        {selectedSport && <PaymentOptions payments={court?.formas_pagamento || []} onPaymentSelect={setSelectedPayment} />}
      </Box>
    </Container>
  );
};

export default BookingPage;