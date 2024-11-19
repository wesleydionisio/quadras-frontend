import React from 'react';
import { Box, Typography, Button, CircularProgress, Stack } from '@mui/material';

const PaymentButton = ({ paymentMethods, selectedPayment, onPaymentSelect, showGlow, loading }) => {
  if (loading) {
    return <CircularProgress />;
  }

  if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
    return (
      <Typography color="error">
        Nenhum método de pagamento disponível
      </Typography>
    );
  }

  return (
    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
      {paymentMethods.map((method) => (
        <Button
          key={method._id}
          variant={selectedPayment?._id === method._id ? "contained" : "outlined"}
          onClick={() => onPaymentSelect(method)}
          sx={{
            minWidth: '120px',
            ...(showGlow && {
              boxShadow: '0 0 15px rgba(25, 118, 210, 0.4)'
            })
          }}
        >
          {method.nome}
        </Button>
      ))}
    </Stack>
  );
};

export default PaymentButton; 