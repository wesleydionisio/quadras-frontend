import React from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';

const Calendar = ({ onDateChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        onChange={onDateChange}
        slots={{
          textField: (params) => <TextField {...params} fullWidth />,
        }}
      />
    </LocalizationProvider>
  );
};

export default Calendar;