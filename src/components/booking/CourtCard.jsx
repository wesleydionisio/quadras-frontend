import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

const CourtCard = ({ court }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={court.foto_principal || 'https://via.placeholder.com/150'} // Imagem padrão
        alt={court.nome}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {court.nome}
        </Typography>
        <Button variant="contained" color="primary">
          Reservar
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourtCard;