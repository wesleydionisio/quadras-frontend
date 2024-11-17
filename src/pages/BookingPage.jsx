import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import axios from '../api/apiService'; // Importa o serviço de API
import Calendar from '../components/booking/Calendar';
import TimeSlots from '../components/booking/TimeSlots';
import SportsDropdown from '../components/booking/SportsDropdown';
import PaymentOptions from '../components/booking/PaymentOptions';

const BookingPage = () => {
  const { quadraId } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null); // Armazena os detalhes da quadra
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [timeSlots, setTimeSlots] = useState([]); // Time slots disponíveis

  // Horários de funcionamento fixos (exemplo)
  const horarioInicio = 8; // 08:00
  const horarioFim = 22; // 22:00

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

  // Atualiza os horários disponíveis com base na data selecionada
  useEffect(() => {
    if (selectedDate) {
      const fetchTimeSlots = async () => {
        try {
          const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
          const response = await axios.get(`/api/courts/${quadraId}/reserved-times`, {
            params: { data: formattedDate },
          });

          const reservedTimes = response.data.horariosReservados || [];
          const slots = generateTimeSlots(reservedTimes);
          setTimeSlots(slots);
        } catch (error) {
          console.error('Erro ao buscar horários disponíveis:', error);
        }
      };

      fetchTimeSlots();
    }
  }, [selectedDate, quadraId]);

  // Gera time slots com base nos horários de funcionamento e horários reservados
  const generateTimeSlots = (horariosReservados) => {
    const slots = [];
    for (let hour = horarioInicio; hour < horarioFim; hour++) {
      const slot = `${hour.toString().padStart(2, '0')}:00`;

      const isReserved = horariosReservados.some(
        (reserva) =>
          reserva.horario_inicio === slot || reserva.horario_fim === slot
      );

      slots.push({ time: slot, available: !isReserved });
    }
    return slots;
  };

  // Função para confirmar a reserva
  const handleConfirmReservation = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        // Salva os dados da reserva localmente e redireciona para login
        localStorage.setItem('pendingReservation', JSON.stringify({
          quadraId,
          data: selectedDate,
          horario: selectedSlot,
          esporte: selectedSport,
          pagamento: selectedPayment,
        }));
        navigate('/login'); // Redireciona para a página de login
        return;
      }

      const requestBody = {
        quadraId,
        data: selectedDate,
        horario: selectedSlot,
        esporte: selectedSport,
        pagamento: selectedPayment,
      };

      await axios.post(`/api/bookings`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Reserva confirmada com sucesso!');
    } catch (error) {
      console.error('Erro ao confirmar a reserva:', error);
      alert('Não foi possível confirmar a reserva. Tente novamente.');
    }
  };

  return (
    <Container>
      {court ? (
        <>
          {/* Imagem e Nome da Quadra */}
          <Box>
            <img
              src={court.foto_principal || 'https://via.placeholder.com/150'}
              alt={court.nome}
              width="100%"
              style={{ borderRadius: '8px', marginBottom: '16px' }}
            />
            <Typography variant="h5" align="center">
              {court.nome}
            </Typography>
          </Box>

          {/* Calendário */}
          <Box mt={3}>
            <Calendar onDateChange={setSelectedDate} />
          </Box>

          {/* Time Slots */}
          {selectedDate && (
            <Box mt={3}>
              <TimeSlots slots={timeSlots} onSlotSelect={setSelectedSlot} />
            </Box>
          )}

          {/* Dropdown de Esportes */}
          {selectedSlot && (
            <Box mt={3}>
              <SportsDropdown
                sports={court?.esportes_permitidos || []}
                onSportSelect={setSelectedSport}
                selectedSport={selectedSport}
              />
            </Box>
          )}

          {/* Opções de Pagamento */}
          {selectedSport && (
            <Box mt={3}>
              <PaymentOptions
                payments={['Dinheiro', 'Cartão de Crédito', 'Pix']}
                onPaymentSelect={setSelectedPayment}
                selectedPayment={selectedPayment}
              />
            </Box>
          )}

          {/* Botão de Confirmar Reserva */}
          {selectedDate && selectedSlot && selectedSport && selectedPayment && (
            <Box mt={3} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmReservation}
              >
                Confirmar Reserva
              </Button>
            </Box>
          )}
        </>
      ) : (
        // Loader enquanto os detalhes da quadra são carregados
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default BookingPage;