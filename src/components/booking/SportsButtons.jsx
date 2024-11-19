// src/components/booking/SportsButtons.jsx
import React from 'react';
import { Button, Box, Stack } from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';

const SportsButtons = ({ sports, selectedSport, onSportSelect, showGlow }) => {
  // Mapa de ícones para cada esporte
  const sportIcons = {
    'Tênis': <SportsTennisIcon />,
    'Vôlei': <SportsVolleyballIcon />,
    'Basquete': <SportsBasketballIcon />,
    'Futebol': <SportsFootballIcon />
  };

  const handleSportSelect = (sport) => {
    onSportSelect(sport._id);
  };

  return (
    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
      {sports.map((sport) => (
        <Button
          key={sport._id}
          variant={selectedSport === sport._id ? "contained" : "outlined"}
          onClick={() => onSportSelect(sport._id)}
          sx={{
            minWidth: '120px',
            ...(showGlow && {
              boxShadow: '0 0 15px rgba(25, 118, 210, 0.4)'
            })
          }}
        >
          {sport.nome}
        </Button>
      ))}
    </Stack>
  );
};

export default SportsButtons;