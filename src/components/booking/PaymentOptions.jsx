import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const PaymentOptions = ({ payments, onPaymentSelect }) => {
  const [selectedPayment, setSelectedPayment] = React.useState('');

  const handleChange = (event) => {
    setSelectedPayment(event.target.value);
    if (onPaymentSelect) {
      onPaymentSelect(event.target.value);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Forma de Pagamento</InputLabel>
      <Select value={selectedPayment} onChange={handleChange}>
        {payments.map((payment) => (
          <MenuItem key={payment} value={payment}>
            {payment}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PaymentOptions;