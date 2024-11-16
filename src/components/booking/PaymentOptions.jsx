import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const PaymentOptions = ({ payments, onPaymentSelect, selectedPayment }) => {
  const handleSelect = (event) => {
    onPaymentSelect(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
      <InputLabel id="payment-select-label">Formas de Pagamento</InputLabel>
      <Select
        labelId="payment-select-label"
        id="payment-select"
        value={selectedPayment || ''} // Valor controlado
        onChange={handleSelect}
        label="Formas de Pagamento"
      >
        {payments.length > 0 ? (
          payments.map((payment, index) => (
            <MenuItem key={index} value={payment}>
              {payment}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            Nenhuma forma de pagamento disponível
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default PaymentOptions;