import React from 'react';
import { Button, Grid, Typography } from '@mui/material';

const TimeSlots = ({ slots, onSlotSelect }) => {
  return (
    <div>
      <Typography variant="h6">Horários Disponíveis</Typography>
      <Grid container spacing={2}>
        {slots.map((slot) => (
          <Grid item key={slot.time}>
            <Button
              variant="contained"
              color={slot.available ? 'primary' : 'secondary'}
              disabled={!slot.available}
              onClick={() => slot.available && onSlotSelect(slot.time)}
            >
              {slot.time}
            </Button>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TimeSlots;