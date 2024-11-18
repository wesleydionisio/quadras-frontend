// src/components/CourtCard.jsx

import React, { useState } from 'react';
import { Card, CardMedia, CardContent, CardActions, Button, Typography, Box } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CourtCard = ({ court }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getEsportes = (esportes) => {
    if (!esportes || !Array.isArray(esportes)) return 'Esportes não especificados';
    return esportes.map(esporte => 
      typeof esporte === 'object' ? esporte.nome : esporte
    ).join(', ');
  };

  return (
    <Card sx={{ 
      width: '100%',
      maxWidth: { xs: '100%', sm: 345 },
      minWidth: { xs: '100%', sm: 345 },
      borderRadius: 3, 
      boxShadow: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      mx: { xs: 0, sm: 'auto' },
    }}>
      {/* Área da Imagem */}
      {!imageLoaded && (
        <Skeleton 
          height={200} 
          width="100%" 
          style={{ display: 'block' }}
        />
      )}

      <CardMedia
        component="img"
        alt={court.nome}
        height="200"
        image={court.foto_principal || 'https://via.placeholder.com/300x200'}
        onLoad={() => setImageLoaded(true)}
        style={{
          ...(!imageLoaded && { display: 'none' }),
          objectFit: 'cover',
        }}
      />

      {/* Conteúdo do Card */}
      <CardContent sx={{ flexGrow: 1 }}>
        {!imageLoaded ? (
          <>
            <Skeleton height={30} width="80%" style={{ marginBottom: 6 }} />
            <Skeleton height={20} width="60%" />
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton circle={true} height={24} width={24} />
              <Skeleton height={20} width="50%" />
            </Box>
          </>
        ) : (
          <>
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
          </>
        )}
      </CardContent>

      {/* Ações do Card */}
      <CardActions sx={{ padding: 2 }}>
        {!imageLoaded ? (
          <Skeleton height={36} width="40%" />
        ) : (
          <Button 
            size="small" 
            variant="contained" 
            color="primary" 
            href={`/booking/${court._id}`}
            fullWidth
          >
            Reservar
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default CourtCard;