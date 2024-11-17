// src/components/booking/TimeSlots.jsx
import React from 'react';
import { Grid, Button } from '@mui/material';

const TimeSlots = ({ slots, onSlotSelect }) => {
  return (
    <Grid container spacing={2}>
      {slots.map((slot) => (
        <Grid item xs={3} key={`${slot.horario_inicio}-${slot.horario_fim}`}>
          <Button
            variant="contained"
            color={slot.available ? 'primary' : 'secondary'}
            onClick={() => onSlotSelect(slot)}
            disabled={!slot.available}
            fullWidth
          >
            {slot.horario_inicio} - {slot.horario_fim}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default TimeSlots;