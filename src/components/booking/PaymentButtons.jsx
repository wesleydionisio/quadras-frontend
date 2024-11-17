// src/components/booking/PaymentButtons.jsx
import React from 'react';
import { Grid, Button, Typography } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// Importe outros ícones conforme necessário

// Mapeamento de nomes de formas de pagamento para ícones
const iconMapping = {
  dinheiro: <MonetizationOnIcon />,
  'cartão de crédito': <CreditCardIcon />,
  pix: <AccountBalanceWalletIcon />,
  boleto: <ReceiptLongIcon />,
  // Adicione outros mapeamentos conforme as formas de pagamento disponíveis
};

const PaymentButtons = ({ payments, selectedPayment, onPaymentSelect }) => {
  console.log('Forma de Pagamento:', payments); // Log para inspeção

  return (
    <Grid container spacing={2}>
      {payments.map((payment, index) => {
        // Verifique se 'payment' é uma string
        const paymentNome = payment ? payment.toLowerCase() : 'default';
        const icon = iconMapping[paymentNome] || <CreditCardIcon />; // Ícone padrão

        return (
          <Grid item xs={6} sm={4} key={payment || index}>
            <Button
              variant={selectedPayment === payment ? 'contained' : 'outlined'}
              color={selectedPayment === payment ? 'primary' : 'default'}
              onClick={() => onPaymentSelect(payment)}
              startIcon={icon}
              fullWidth
              sx={{
                textTransform: 'none',
                backgroundColor: selectedPayment === payment ? 'primary.main' : 'background.paper',
                '&:hover': {
                  backgroundColor: selectedPayment === payment ? 'primary.dark' : 'background.default',
                },
              }}
            >
              <Typography variant="body1">{payment || 'Forma de Pagamento'}</Typography>
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PaymentButtons;