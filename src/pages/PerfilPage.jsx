// src/pages/PerfilPage.jsx

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/apiService';
import { useSnackbar } from 'notistack';

const PerfilPage = () => {
  const { user, setUser, login, register, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [profileData, setProfileData] = useState({
    nome: '',
    email: '',
    telefone: '',
    // Adicione outros campos conforme necessário
  });

  const [reservations, setReservations] = useState([]);

  const [editing, setEditing] = useState(false);

  // Estados para o formulário de login/cadastro
  const [activeTab, setActiveTab] = useState(0); // 0: Login, 1: Cadastro
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    password: '',
    telefone: '',
    // Adicione outros campos conforme necessário
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        // Preencha outros campos conforme necessário
      });
      fetchReservations();
    }
    // eslint-disable-next-line
  }, [user]);

  // Função para buscar as reservas do usuário
  const fetchReservations = async () => {
    try {
      const response = await axios.get('/api/bookings/user');
      if (response.data.success) {
        setReservations(response.data.reservas);
      } else {
        enqueueSnackbar('Não foi possível carregar suas reservas.', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      enqueueSnackbar('Erro ao buscar reservas. Tente novamente.', { variant: 'error' });
    }
  };

  // Função para lidar com a edição dos campos do perfil
  const handleChangeProfile = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Função para salvar as alterações do perfil
  const handleSave = async () => {
    try {
      const response = await axios.put('/api/user/profile', profileData);
      if (response.data.success) {
        enqueueSnackbar('Perfil atualizado com sucesso.', { variant: 'success' });
        setEditing(false);
        // Atualizar o usuário no contexto
        setUser(response.data.user);
      } else {
        enqueueSnackbar('Não foi possível atualizar o perfil.', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      enqueueSnackbar('Erro ao atualizar perfil. Tente novamente.', { variant: 'error' });
    }
  };

  // Função para lidar com logout
  const handleLogout = () => {
    // Chamar a função de logout do contexto
    logout();
    navigate('/'); // Redirecionar para a página inicial
  };

  // Funções para lidar com o formulário de login
  const handleChangeLogin = (e) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;
    const result = await login(email, password);
    if (result.success) {
      enqueueSnackbar('Login realizado com sucesso.', { variant: 'success' });
      navigate('/perfil'); // Redirecionar para a página de perfil
    } else {
      enqueueSnackbar(result.message || 'Erro no login.', { variant: 'error' });
    }
  };

  // Funções para lidar com o formulário de cadastro
  const handleChangeRegister = (e) => {
    setRegisterData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { nome, email, password, telefone } = registerData;
    const result = await register({ nome, email, password, telefone });
    if (result.success) {
      enqueueSnackbar('Cadastro realizado com sucesso.', { variant: 'success' });
      navigate('/perfil'); // Redirecionar para a página de perfil
    } else {
      enqueueSnackbar(result.message || 'Erro no cadastro.', { variant: 'error' });
    }
  };

  // Função para renderizar os cards de reservas
  const renderReservations = () => {
    if (reservations.length === 0) {
      return <Typography variant="body1">Você não possui reservas.</Typography>;
    }

    return (
      <Grid container spacing={2}>
        {reservations.map(reserva => (
          <Grid item xs={12} sm={6} md={4} key={reserva._id}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar src={reserva.quadra.foto_principal} alt={reserva.quadra.nome} />
                }
                title={reserva.quadra.nome}
                subheader={`${reserva.horario_inicio} - ${reserva.horario_fim}`}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Data: {reserva.data}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Esporte: {reserva.esporte.nome}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {reserva.status}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total: R$ {reserva.total.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate(`/reservation-review/${reserva._id}`)}>
                  Revisar Reserva
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Se o usuário não estiver autenticado, mostrar o formulário de login/cadastro
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Login" />
            <Tab label="Criar Conta" />
          </Tabs>

          {/* Formulário de Login */}
          {activeTab === 0 && (
            <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleChangeLogin}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Senha"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChangeLogin}
              />
              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
                Login
              </Button>
            </Box>
          )}

          {/* Formulário de Cadastro */}
          {activeTab === 1 && (
            <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nome"
                name="nome"
                value={registerData.nome}
                onChange={handleChangeRegister}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={registerData.email}
                onChange={handleChangeRegister}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Telefone"
                name="telefone"
                value={registerData.telefone}
                onChange={handleChangeRegister}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Senha"
                name="password"
                type="password"
                value={registerData.password}
                onChange={handleChangeRegister}
              />
              {/* Adicione outros campos conforme necessário */}
              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
                Criar Conta
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Meu Perfil
        </Typography>

        {/* Formulário de Perfil */}
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            {/* Nome */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={profileData.nome}
                onChange={handleChangeProfile}
                InputProps={{
                  readOnly: !editing,
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleChangeProfile}
                InputProps={{
                  readOnly: !editing,
                }}
              />
            </Grid>

            {/* Telefone */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={profileData.telefone}
                onChange={handleChangeProfile}
                InputProps={{
                  readOnly: !editing,
                }}
              />
            </Grid>

            {/* Outros campos podem ser adicionados aqui */}
          </Grid>

          {/* Botões de Ação */}
          <Box mt={3} display="flex" gap={2}>
            {editing ? (
              <>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Salvar
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setEditing(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={() => setEditing(true)}>
                Editar Perfil
              </Button>
            )}
          </Box>
        </Box>

        {/* Seção de Reservas */}
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>
            Minhas Reservas
          </Typography>
          {renderReservations()}
        </Box>

        {/* Botão de Logout */}
        <Box mt={5} display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Sair da Conta
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PerfilPage;