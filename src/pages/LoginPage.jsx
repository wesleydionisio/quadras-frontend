import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import axios from '../api/apiService'; // Serviço de API
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [tab, setTab] = useState(0); // Tab 0 = Login, Tab 1 = Criar Conta
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState(''); // Usado apenas na criação de conta
  const [telefone, setTelefone] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setEmail('');
    setSenha('');
    setNome('');
    setTelefone('');
  };

  const handleLogin = async () => {
    try {
      if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      const response = await axios.post('/api/auth/login', { email, senha });
      localStorage.setItem('authToken', response.data.token);

      // Verifica se há uma reserva pendente
      const pendingReservation = localStorage.getItem('pendingReservation');
      if (pendingReservation) {
        const reservationData = JSON.parse(pendingReservation);
        await axios.post('/api/bookings', reservationData, {
          headers: { Authorization: `Bearer ${response.data.token}` },
        });
        alert('Reserva confirmada com sucesso!');
        localStorage.removeItem('pendingReservation');
      }

      navigate('/'); // Redireciona para a página inicial
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      const errorMessage =
        error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      alert(errorMessage);
    }
  };

  const handleCreateAccount = async () => {
    try {
      if (!nome || !email || !telefone || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      const requestBody = { nome, email, telefone, senha };
      const response = await axios.post('/api/auth/register', requestBody);
      alert('Conta criada com sucesso! Faça login para continuar.');

      // Opcional: Automaticamente redireciona para a aba de login após criar a conta
      setTab(0);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      const errorMessage =
        error.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      alert(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2}>
        <Typography variant="h5" align="center" gutterBottom>
          Login ou Criar Conta
        </Typography>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          centered
        >
          <Tab label="Login" />
          <Tab label="Criar Conta" />
        </Tabs>
        <Box mt={3}>
          {tab === 0 ? (
            // Formulário de Login
            <Box>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Senha"
                type="password"
                fullWidth
                margin="normal"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                sx={{ mt: 2 }}
              >
                Fazer Login
              </Button>
            </Box>
          ) : (
            // Formulário de Criação de Conta
            <Box>
              <TextField
                label="Nome"
                fullWidth
                margin="normal"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <TextField
                label="Telefone"
                type="tel"
                fullWidth
                margin="normal"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Senha"
                type="password"
                fullWidth
                margin="normal"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCreateAccount}
                sx={{ mt: 2 }}
              >
                Criar Conta
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;