import React, { useEffect, useState, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/pt-br';
import axios from '../../api/apiService';

dayjs.extend(isSameOrAfter);
dayjs.locale('pt-br');

const PASTEL_COLORS = {
  GREEN: '#C1E1C1',
  YELLOW: '#FAF0BE',
  RED: '#FAA0A0'
};

const StyledDay = styled(PickersDay)(({ theme, availability }) => ({
  position: 'relative',
  '&::after': availability !== undefined && {
    content: '""',
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '4px',
    backgroundColor: availability >= 60 ? PASTEL_COLORS.GREEN :
                    availability > 0 ? PASTEL_COLORS.YELLOW :
                    PASTEL_COLORS.RED,
    borderRadius: '2px',
    transition: 'all 0.2s ease',
  },
  '&:hover::after': availability !== undefined && {
    height: '6px',
    width: '85%',
  },
  padding: '0 0 6px 0',
}));

function ServerDay(props) {
  const { highlightedDays = {}, day, outsideCurrentMonth, ...other } = props;
  const availability = !outsideCurrentMonth ? highlightedDays[day.format('YYYY-MM-DD')] : undefined;

  return (
    <StyledDay 
      {...other} 
      outsideCurrentMonth={outsideCurrentMonth} 
      day={day}
      availability={availability}
      sx={{
        ...props.sx,
        '&.MuiPickersDay-root': {
          marginBottom: '4px',
        },
      }}
    />
  );
}

const BookingCalendar = ({ selectedDate, onDateChange, quadraId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState({});
  const requestAbortController = useRef(null);

  const calculateAvailability = async (date) => {
    try {
      if (requestAbortController.current) {
        requestAbortController.current.abort();
      }
      
      const controller = new AbortController();
      requestAbortController.current = controller;

      const formattedDate = date.format('YYYY-MM-DD');
      const response = await axios.get(`/bookings/${quadraId}/reserved-times`, {
        params: { data: formattedDate },
        signal: controller.signal
      });

      const reservas = response.data.horarios_agendados || [];
      const totalSlots = 14;
      const slotsDisponiveis = totalSlots - reservas.length;
      const availabilityPercentage = (slotsDisponiveis / totalSlots) * 100;

      setHighlightedDays(prev => ({
        ...prev,
        [formattedDate]: availabilityPercentage
      }));
    } catch (error) {
      if (error.name === 'CanceledError') return;
    }
  };

  const fetchMonthAvailability = async (date) => {
    setIsLoading(true);
    const startOfMonth = date.startOf('month');
    const daysInMonth = date.daysInMonth();
    
    setHighlightedDays({});
    
    const promises = Array.from({ length: daysInMonth }, (_, i) => {
      const currentDate = startOfMonth.add(i, 'day');
      if (currentDate.isSameOrAfter(dayjs(), 'day')) {
        return calculateAvailability(currentDate);
      }
      return Promise.resolve();
    });
    
    try {
      await Promise.all(promises);
    } catch (error) {
      if (error.name === 'CanceledError') return;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthAvailability(dayjs());
    return () => {
      if (requestAbortController.current) {
        requestAbortController.current.abort();
      }
    };
  }, [quadraId]);

  const handleMonthChange = (date) => {
    fetchMonthAvailability(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DateCalendar
        value={selectedDate}
        onChange={onDateChange}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
        disablePast
        sx={{
          width: '100%',
          '& .MuiPickersDay-root': {
            fontSize: '0.875rem',
            height: '40px', // Aumentar altura para acomodar a barra
          },
          '& .MuiDayCalendar-weekDayLabel': {
            fontSize: '0.875rem',
          },
          '& .MuiPickersDay-today': {
            borderColor: 'primary.main',
          },
          // Aumentar espaçamento entre as semanas
          '& .MuiDayCalendar-monthContainer': {
            rowGap: '8px',
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default BookingCalendar;