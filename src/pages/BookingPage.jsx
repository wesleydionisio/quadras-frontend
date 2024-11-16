import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import Calendar from '../components/booking/Calendar';
import TimeSlots from '../components/booking/TimeSlots';
import SportsDropdown from '../components/booking/SportsDropdown';
import PaymentOptions from '../components/booking/PaymentOptions';

const BookingPage = () => {
  const { quadraId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');

  // Mock data for time slots, sports, and payments
  const timeSlots = [
    { time: '08:00', available: true },
    { time: '09:00', available: false }, // já reservado
    { time: '10:00', available: true },
  ];
  const sports = [
    { id: '1', name: 'Futebol' },
    { id: '2', name: 'Basquete' },
  ];
  const payments = ['pagamento no ato'];

  return (
    <Container>
      <Box>
        <img src="url-da-imagem" alt="Quadra" width="100%" />
        <Typography variant="h5" align="center">
          Nome da Quadra
        </Typography>
      </Box>
      <Box mt={3}>
        <Calendar onDateChange={setSelectedDate} />
        {selectedDate && <TimeSlots slots={timeSlots} onSlotSelect={setSelectedSlot} />}
        {selectedSlot && <SportsDropdown sports={sports} onSportSelect={setSelectedSport} />}
        {selectedSport && <PaymentOptions payments={payments} onPaymentSelect={setSelectedPayment} />}
      </Box>
    </Container>
  );
};

export default BookingPage;