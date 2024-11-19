import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CircularProgress,
  Grid,
  Chip,
  Stack,
  Skeleton
} from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import axios from '../api/apiService';
import BookingCalendar from '../components/booking/Calendar';
import TimeSlots from '../components/booking/TimeSlots';
import SportsButtons from '../components/booking/SportsButtons';
import PaymentButton from '../components/booking/PaymentButton';
import Slider from "react-slick";
import Lightbox from "yet-another-react-lightbox";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "yet-another-react-lightbox/styles.css";
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'; // Importando localização brasileira
import customParseFormat from 'dayjs/plugin/customParseFormat'; // Para parsing de formato personalizado
import utc from 'dayjs/plugin/utc'; // Para manipulação de UTC
import { useSnackbar } from 'notistack';

const OptionSkeleton = ({ title }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Skeleton variant="rounded" width={120} height={45} />
      <Skeleton variant="rounded" width={120} height={45} />
    </Box>
  </Box>
);

// Função auxiliar para o efeito de brilho
const glowEffect = (theme) => ({
  boxShadow: `0 0 15px ${theme.palette.primary.main}40`, // 40 é a opacidade em hex
  transition: 'all 0.3s ease-in-out'
});

const BookingPage = () => {
  const { quadraId } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useTheme();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const horarioInicio = 8;
  const horarioFim = 22;
  const duracao = 1;

  // Função para gerar slots de horário


  const generateTimeSlots = (reservas) => {
    // Filtrar apenas reservas que não estão canceladas
    const reservasAtivas = reservas.filter(reserva => reserva.status !== 'cancelada');
  
    const slots = [];
    for (let hour = horarioInicio; hour < horarioFim; hour++) {
      const slotInicio = `${hour.toString().padStart(2, '0')}:00`;
      const slotFim = `${(hour + duracao).toString().padStart(2, '0')}:00`;
  
      const isReserved = reservasAtivas.some(
        (reserva) =>
          (reserva.inicio <= slotInicio && reserva.fim > slotInicio) ||
          (reserva.inicio < slotFim && reserva.fim >= slotFim)
      );
  
      slots.push({ horario_inicio: slotInicio, horario_fim: slotFim, available: !isReserved });
    }
    console.log('Slots gerados:', slots); // Log para verificar
    return slots;
  };

  // Função para buscar métodos de pagamento
  const fetchPaymentMethods = useCallback(async (courtId) => {
    try {
      setLoadingPayments(true);
      const response = await axios.get(`/payment-methods/courts/${courtId}`);
      
      if (response.data.success && Array.isArray(response.data.paymentMethods)) {
        setPaymentMethods(response.data.paymentMethods);
      } else {
        console.error('Formato inválido de resposta:', response.data);
        setError('Erro ao carregar métodos de pagamento');
      }
    } catch (error) {
      console.error('Erro ao buscar métodos de pagamento:', error);
      setError('Erro ao carregar métodos de pagamento');
    } finally {
      setLoadingPayments(false);
    }
  }, []);

  // useEffect para carregar dados da quadra e métodos de pagamento
  useEffect(() => {
    if (!quadraId) return;

    const loadCourtData = async () => {
      try {
        setLoading(true);
        const [courtResponse] = await Promise.all([
          axios.get(`/courts/${quadraId}`),
          fetchPaymentMethods(quadraId)
        ]);

        if (courtResponse.data.success) {
          setCourt(courtResponse.data.court);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados da quadra');
      } finally {
        setLoading(false);
      }
    };

    loadCourtData();
  }, [quadraId, fetchPaymentMethods]);

  // Buscar horários reservados
  useEffect(() => {
    if (selectedDate) {
      const fetchTimeSlots = async () => {
        setLoading(true);
        try {
          const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
          const response = await axios.get(`/bookings/${quadraId}/reserved-times`, {
            params: { data: formattedDate },
          });

          const reservas = response.data.horarios_agendados || [];
          console.log('Reservas recebidas:', reservas); // Log para verificar
          const slots = generateTimeSlots(reservas);
          setTimeSlots(slots);
        } catch (error) {
          console.error('Erro ao buscar horários disponíveis:', error);
          setError('Não foi possível carregar os horários disponíveis.');
        } finally {
          setLoading(false);
        }
      };

      fetchTimeSlots();
    }
  }, [selectedDate, quadraId]);

  const validateBookingData = (data) => {
    const errors = [];
    
    if (!data.quadra_id) errors.push('ID da quadra é obrigatório');
    if (!data.data) errors.push('Data é obrigatória');
    if (!data.horario_inicio) errors.push('Horário de início é obrigatório');
    if (!data.horario_fim) errors.push('Horário de fim é obrigatório');
    if (!data.esporte_id) errors.push('Esporte é obrigatório');
    if (!data.pagamento) errors.push('Forma de pagamento é obrigatória');
    
    return errors;
  };

  const handleConfirmReservation = async () => {
    try {
      // Validações iniciais com feedback visual
      if (!selectedDate) {
        enqueueSnackbar('Selecione uma data', { variant: 'error' });
        return;
      }
      if (!selectedSlot) {
        enqueueSnackbar('Selecione um horário', { variant: 'error' });
        return;
      }
      if (!selectedSport) {
        enqueueSnackbar('Selecione um esporte', { variant: 'error' });
        return;
      }
      if (!selectedPayment) {
        enqueueSnackbar('Selecione um método de pagamento', { variant: 'error' });
        return;
      }

      const reservationData = {
        quadra_id: quadraId,
        data: selectedDate.format('YYYY-MM-DD'),
        horario_inicio: selectedSlot.horario_inicio,
        horario_fim: selectedSlot.horario_fim,
        esporte_id: selectedSport,
        pagamento: selectedPayment._id
      };

      const response = await axios.post('/bookings', reservationData);
      
      if (response.data && response.data.reserva) {
        enqueueSnackbar('Reserva criada com sucesso!', { variant: 'success' });
        setTimeout(() => {
          navigate(`/reservas/${response.data.reserva._id}`);
        }, 1000);
      } else {
        enqueueSnackbar('Erro ao processar a reserva. Tente novamente.', { 
          variant: 'warning' 
        });
        setTimeout(() => {
          navigate('/perfil');
        }, 1000);
      }
    } catch (error) {
      // Tratamento específico para erros de validação do backend
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.message;
        const validationErrors = error.response.data.errors;
        
        enqueueSnackbar(errorMessage, { variant: 'error' });
        
        if (Array.isArray(validationErrors)) {
          validationErrors.forEach(err => {
            enqueueSnackbar(err, { variant: 'error' });
          });
        }
      } else {
        enqueueSnackbar('Erro ao criar reserva. Tente novamente.', { 
          variant: 'error' 
        });
      }
    }
  };

  // Mapa de ícones para cada esporte
  const sportIcons = {
    'Tênis': <SportsTennisIcon />,
    'Vôlei': <SportsVolleyballIcon />,
    'Basquete': <SportsBasketballIcon />,
    'Futebol': <SportsFootballIcon />
  };

  // Array com todas as fotos
  const allPhotos = court ? [court.foto_principal, ...(court.galeria || [])] : [];

  // Configurações do Slick Slider
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    // Aqui você pode adicionar qualquer lógica adicional necessária
    // quando a data mudar
  };

  // Log para debug dos métodos de pagamento
  useEffect(() => {
    console.log('Estado atual dos métodos de pagamento:', paymentMethods);
  }, [paymentMethods]);

  // Função para lidar com a seleção de método de pagamento
  const handlePaymentSelect = (method) => {
    console.log('Método de pagamento selecionado:', method);
    setSelectedPayment(method);
  };

  return (
    <>
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Coluna Esquerda */}
        <Grid item xs={12} md={7} 
          sx={{
            position: 'relative',
            height: { xs: 'auto', md: '100vh' },
            minHeight: { xs: '50vh', md: '100vh' },
            overflow: { xs: 'visible', md: 'hidden' },
          }}
        >
          {/* Background com overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: court ? `url(${court.foto_principal})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
          />

          {/* Conteúdo da coluna esquerda */}
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-start' },
              p: { xs: 1 },
              pl: { md: 8 },
              pr: { md: 8 },
              pt: { md: 8 },
              pb: { md: 8 },
            }}
          >
            {/* Container do Título e Esportes */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '600px',
                textAlign: { xs: 'center', md: 'left' },
                mb: { xs: 4, md: 6 },
              }}
            >
              <Typography 
                variant="h3" 
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: 'white',
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                {court?.nome}
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={1} 
                flexWrap="wrap" 
                gap={1}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                {court?.esportes_permitidos?.map((esporte) => (
                  <Chip
                    key={esporte._id}
                    icon={sportIcons[esporte.nome]}
                    label={esporte.nome}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      '& .MuiChip-icon': {
                        color: 'white'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Galeria de Fotos */}
            <Box 
              sx={{ 
                width: '100%',
                maxWidth: { xs: '100%', md: '600px' },
                position: 'relative',
                mb: { xs: -6, md: 0 },
                px: { xs: 2, md: 0 },
                '& .slick-slide': {
                  px: 1,
                },
                '& .slick-track': {
                  display: 'flex',
                  gap: '8px'
                },
                '& .slick-list': {
                  margin: '0',
                  overflow: 'hidden',
                },
                ml: { xs: 0, md: 0 },
                mr: { xs: 0, md: 0 },
                zIndex: { xs: 2, md: 1 },
                '& img': {
                  height: { xs: '80px', md: '120px' },
                  objectFit: 'cover',
                  borderRadius: '8px'
                }
              }}
            >
              <Slider {...sliderSettings}>
                {allPhotos.map((foto, index) => (
                  <div key={index}>
                    <Box
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setLightboxOpen(true);
                      }}
                      sx={{
                        height: { xs: '80px', md: '120px' },
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`
                        }
                      }}
                    >
                      <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                  </div>
                ))}
              </Slider>
            </Box>
          </Box>
        </Grid>

        {/* Coluna Direita */}
        <Grid item xs={12} md={5}>
          <Box 
            sx={{ 
              p: 4,
              pt: { xs: 8, md: 4 },
              maxWidth: 800, 
              mx: 'auto',
              minHeight: { xs: 'auto', md: '100vh' },
              display: 'flex',
              alignItems: { md: 'center' },
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
              backgroundColor: 'background.paper',
            }}
          >
            {court ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 5, md: 4 },
                  py: { md: 4 },
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {/* Container Superior */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 5, md: 4 },
                  }}
                >
                  {/* Título e Subtítulo */}
                  <Box sx={{ mb: { xs: 4, md: 2 } }}>
                    <Typography 
                      variant="h4" 
                      component="h2" 
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Faça a sua reserva
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                      sx={{ fontSize: '1.1rem' }}
                    >
                      Comece escolhendo uma data
                    </Typography>
                  </Box>

                  {/* Calendário e Time Slots em linha */}
                  <Box sx={{ 
                    display: { xs: 'block', md: 'flex' }, 
                    gap: 4,
                    position: 'relative',
                    zIndex: 3,
                  }}>
                    {/* Calendário */}
                    <Box sx={{ 
                      flex: 1,
                      position: 'relative',
                      zIndex: 4,
                      backgroundColor: 'background.paper',
                      borderRadius: 1,
                      ...((!selectedDate) && glowEffect(theme)),
                    }}>

                      <BookingCalendar 
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        quadraId={quadraId}
                      />
                    </Box>

                    {/* Time Slots */}
                    <Box sx={{ flex: 1, mt: { xs: 4, md: 0 } }}>
                      {selectedDate ? (
                        <>
                          <Typography variant="h6" gutterBottom>
                            Selecione um Horário:
                          </Typography>
                          <TimeSlots 
                            slots={timeSlots} 
                            onSlotSelect={setSelectedSlot}
                            selectedSlot={selectedSlot}
                            showGlow={selectedDate && !selectedSlot}
                          />
                        </>
                      ) : (
                        <OptionSkeleton title="Selecione um Horário:" />
                      )}
                    </Box>
                  </Box>

                  {/* Container de Esportes e Pagamento */}
                  <Box 
                    sx={{ 
                      display: { xs: 'flex', md: 'flex' },
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: { xs: 5, md: 4 },
                    }}
                  >
                    {/* Botões de Esportes */}
                    <Box sx={{ flex: 1 }}>
                      {selectedDate && selectedSlot ? (
                        <>
                          <Typography variant="h6" gutterBottom>
                            Selecione um Esporte:
                          </Typography>
                          <SportsButtons
                            sports={court.esportes_permitidos || []}
                            selectedSport={selectedSport}
                            onSportSelect={setSelectedSport}
                            showGlow={selectedDate && selectedSlot && !selectedSport}
                          />
                        </>
                      ) : (
                        <OptionSkeleton title="Esporte:" />
                      )}
                    </Box>

                    {/* Botões de Pagamento */}
                    <Box sx={{ flex: 1 }}>
                      {selectedDate && selectedSlot && selectedSport ? (
                        <>
                          <Typography variant="h6" gutterBottom>
                            Forma de Pagamento:
                          </Typography>
                          <PaymentButton
                            paymentMethods={paymentMethods}
                            selectedPayment={selectedPayment}
                            onPaymentSelect={handlePaymentSelect}
                            loading={loadingPayments}
                            showGlow={selectedDate && selectedSlot && selectedSport && !selectedPayment}
                          />
                        </>
                      ) : (
                        <OptionSkeleton title="Forma de Pagamento:" />
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Container Inferior - Botão de Confirmar */}
                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleConfirmReservation}
                    disabled={!selectedDate || !selectedSlot || !selectedSport || !selectedPayment}
                    fullWidth
                    sx={{
                      position: { xs: 'fixed', md: 'static' },
                      bottom: { xs: 0, md: 'auto' },
                      left: { xs: 0, md: 'auto' },
                      right: { xs: 0, md: 'auto' },
                      py: 2,
                      fontSize: '1.1rem',
                      width: '100%',
                      opacity: (!selectedDate || !selectedSlot || !selectedSport || !selectedPayment) ? 0.5 : 1,
                      transition: 'opacity 0.3s ease-in-out',
                      borderRadius: { xs: 0, md: 1 },
                      backgroundColor: 'primary.main',
                      boxShadow: { xs: '0px -2px 8px rgba(0,0,0,0.1)', md: 'none' },
                      zIndex: 1000,
                    }}
                  >
                    Confirmar Reserva
                  </Button>
                </Box>

                {/* Espaço para compensar o botão fixo em mobile */}
                <Box sx={{ height: { xs: '80px', md: 0 } }} />
              </Box>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default BookingPage;