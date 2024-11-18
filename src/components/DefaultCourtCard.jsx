import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Button, Typography, Box } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const CourtCard = ({ court }) => {
  // Função para extrair os nomes dos esportes
  const getEsportes = (esportes) => {
    if (!esportes || !Array.isArray(esportes)) return 'Esportes não especificados';
    
    // Se for um array de objetos, extrair a propriedade nome
    return esportes.map(esporte => 
      typeof esporte === 'object' ? esporte.nome : esporte
    ).join(', ');
  };

  return (
    <Card sx={{ maxWidth: 345, borderRadius: 3, boxShadow: 3 }}>
      <CardMedia
        component="img"
        alt={court.nome}
        height="200"
        image={court.foto_principal || 'https://via.placeholder.com/300x200'}
      />

      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {court.nome}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {court.endereco}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SportsSoccerIcon color="primary" />
          <Typography variant="body1">
            {getEsportes(court.esportes_permitidos)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small" variant="contained" color="primary" href={`/booking/${court._id}`}>
          Reservar
        </Button>
      </CardActions>
    </Card>
  );
};

export default CourtCard;