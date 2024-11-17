// src/components/booking/SportsButtons.jsx
import React from 'react';
import { Grid, Button, Typography } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
// Importe outros ícones conforme necessário

const iconMapping = {
  futebol: <SportsSoccerIcon />,
  basquete: <SportsBasketballIcon />,
  tenis: <SportsTennisIcon />,
  // Adicione outros mapeamentos conforme os esportes disponíveis
};

const SportsButtons = ({ sports, selectedSport, onSportSelect }) => {
  return (
    <Grid container spacing={2}>
      {sports.map((sport) => (
        <Grid item xs={6} sm={4} key={sport._id}>
          <Button
            variant={selectedSport === sport._id ? 'contained' : 'outlined'}
            color={selectedSport === sport._id ? 'primary' : 'default'}
            onClick={() => onSportSelect(sport._id)}
            startIcon={iconMapping[sport.nome.toLowerCase()] || <SportsSoccerIcon />}
            fullWidth
          >
            <Typography variant="body1">{sport.nome}</Typography>
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default SportsButtons;