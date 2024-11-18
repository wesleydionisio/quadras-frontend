// src/components/booking/PaymentButtons.jsx
import React from 'react';
import { Box } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PixIcon from '@mui/icons-material/Pix';
import { Button } from '@mui/material';

const PaymentButtons = ({ selectedPayment, onPaymentSelect }) => {
  // Array de métodos de pagamento
  const paymentMethods = [
    { id: 'dinheiro', nome: 'Dinheiro', icon: <MonetizationOnIcon /> },
    // { id: 'cartao', nome: 'Cartão', icon: <CreditCardIcon /> },
    // { id: 'pix', nome: 'Pix', icon: <PixIcon /> }
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {paymentMethods.map((method) => (
        <Button
          key={method.id}
          variant={selectedPayment === method.id ? "contained" : "outlined"}
          onClick={() => onPaymentSelect(method.id)}
          startIcon={method.icon}
          sx={{
            minWidth: '120px',
            py: 1,
          }}
        >
          {method.nome}
        </Button>
      ))}
    </Box>
  );
};

export default PaymentButtons;